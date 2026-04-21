<?php

namespace App\Http\Controllers;

use App\Models\ValidationLog;
use App\Models\Event;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ValidationLogController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $isAdmin = in_array($user->role, ['Root', 'Admin']);
        $organizerId = $user->organizer?->id;

        // Get filter inputs
        $filterEventId = $request->input('event_id');
        $filterStatus  = $request->input('status');

        // If user is organizer, only show their events. If Admin, show all.
        $eventQuery = Event::query();
        if (!$isAdmin) {
            $eventQuery->where('organizer_id', $organizerId);
        }
        $availableEvents = $eventQuery->orderBy('title')->get(['id', 'title']);
        $eventIds = $availableEvents->pluck('id');

        // Base query for logs
        $logQuery = ValidationLog::with(['ticket.detail.transaction.event', 'ticket.detail.ticketType'])
            ->whereHas('ticket.detail.transaction', function ($q) use ($eventIds, $filterEventId) {
                if ($filterEventId) {
                    $q->where('event_id', $filterEventId);
                } else {
                    $q->whereIn('event_id', $eventIds);
                }
            })
            ->orderByDesc('created_at');

        // Filter by result status
        if ($filterStatus) {
            $logQuery->where('result', $filterStatus);
        }

        // Use pagination (5 per page for the sidebar as requested)
        $history = $logQuery->paginate(5)->through(function ($log) {
            return [
                'id'          => $log->id,
                'ticket_id'   => $log->ticket->id ?? 'N/A',
                'event_name'  => $log->ticket?->detail?->transaction?->event?->title ?? 'N/A',
                'ticket_type' => $log->ticket?->detail?->ticketType?->name ?? 'N/A',
                'result'      => $log->result,
                'time'        => $log->created_at->format('H:i:s'),
            ];
        });

        // Current overall check-in status
        $statsQuery = Ticket::whereHas('detail.transaction', function ($q) use ($eventIds, $filterEventId) {
            if ($filterEventId) {
                $q->where('event_id', $filterEventId);
            } else {
                $q->whereIn('event_id', $eventIds);
            }
        });

        $stats = [
            'total_sold' => (clone $statsQuery)->count(),
            'checked_in' => (clone $statsQuery)->where('ticket_status', 'Checked-In')->count(),
        ];

        return Inertia::render('Organizer/CheckIn', [
            'history' => $history,
            'stats' => $stats,
            'events' => $availableEvents,
            'filters' => $request->only(['event_id', 'status'])
        ]);
    }

    public function verify(Request $request)
    {
        $user = Auth::user();
        $isAdmin = in_array($user->role, ['Root', 'Admin']);
        $organizerId = $user->organizer?->id;
        $code = trim($request->code);

        $ticket = Ticket::with(['detail.transaction.event', 'detail.ticketType', 'attendee'])
            ->where(function ($q) use ($code) {
                $q->where('id', $code)
                  ->orWhere('qr_code', $code)
                  ->orWhere('id', strtolower($code))
                  ->orWhere('qr_code', strtolower($code));
            })->first();

        if (!$ticket) {
            return response()->json(['error' => 'Ticket not found.'], 404);
        }

        if (!$isAdmin) {
            if ($ticket->detail->transaction->event->organizer_id !== $organizerId) {
                return response()->json(['error' => 'Unauthorized: This ticket belongs to another organizer.'], 403);
            }
        }

        return response()->json([
            'ticket' => [
                'id' => $ticket->id,
                'status' => $ticket->ticket_status,
                'type' => $ticket->detail->ticketType->name,
                'event' => $ticket->detail->transaction->event->title,
                'attendee' => [
                    'name' => $ticket->attendee->name ?? 'N/A',
                    'email' => $ticket->attendee->email ?? 'N/A',
                ]
            ]
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $isAdmin = in_array($user->role, ['Root', 'Admin']);
        $organizerId = $user->organizer?->id;
        $code = trim($request->code);

        Log::info("Ticket Scan Attempt", [
            'user_id' => $user->id,
            'role' => $user->role,
            'organizer_id' => $organizerId,
            'code' => $code
        ]);

        // Find ticket by QR code or ID (don't restrict by organizer yet for better error reporting)
        $ticket = Ticket::with(['detail.transaction.event', 'detail.ticketType'])
            ->where(function ($q) use ($code) {
                $q->where('id', $code)
                  ->orWhere('qr_code', $code)
                  ->orWhere('id', strtolower($code))
                  ->orWhere('qr_code', strtolower($code))
                  ->orWhere('id', strtoupper($code))
                  ->orWhere('qr_code', strtoupper($code));
            })->first();

        if (!$ticket) {
            Log::warning("Ticket Scan Failed: Not Found", ['code' => $code]);
            return redirect()->back()->with('error', 'Ticket not found in system.');
        }

        // Only restrict by organizer if the user is not an admin
        if (!$isAdmin) {
            $ticketEventOrganizerId = $ticket->detail->transaction->event->organizer_id;
            if ($ticketEventOrganizerId !== $organizerId) {
                Log::warning("Ticket Scan Failed: Wrong Organizer", [
                    'ticket_id' => $ticket->id,
                    'event_organizer' => $ticketEventOrganizerId,
                    'scanner_organizer' => $organizerId
                ]);
                return redirect()->back()->with('error', 'This ticket belongs to an event from another organizer.');
            }
        }

        Log::info("Ticket Found", ['ticket_id' => $ticket->id, 'status' => $ticket->ticket_status]);

        // DB column is ticket_status, enum values: Pending | Valid | Checked-In | Expired | Failed
        // Only log successful scans to avoid cluttering the history
        if ($ticket->ticket_status === 'Checked-In') {
            return redirect()->back()->with('error', 'Ticket has already been used (Check-in Failed).');
        }

        if ($ticket->ticket_status === 'Expired') {
            return redirect()->back()->with('error', 'Ticket has expired and cannot be used.');
        }

        if ($ticket->ticket_status !== 'Valid') {
            return redirect()->back()->with('error', 'Ticket is ' . strtolower($ticket->ticket_status) . ' and cannot be used.');
        }

        // Mark as Checked-In
        $ticket->update([
            'ticket_status' => 'Checked-In',
            'validated_at'  => now(),
        ]);

        ValidationLog::create([
            'ticket_id'       => $ticket->id,
            'validation_time' => now(),
            'result'          => 'Valid',
        ]);

        return redirect()->back()->with('success', 'Check-in SUCCESSFUL! Enjoy the event.');
    }
}
