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

        // If user is organizer, only show their events. If Admin, show all.
        $eventQuery = Event::query();
        if (!$isAdmin) {
            $eventQuery->where('organizer_id', $organizerId);
        }
        $eventIds = $eventQuery->pluck('id');

        // Recent scan history (last 15 logs)
        // Correct relation chain: ticket -> detail (TransactionDetail) -> transaction -> event
        $ticketIds = Ticket::whereHas('detail.transaction', function ($q) use ($eventIds) {
            $q->whereIn('event_id', $eventIds);
        })->pluck('id');

        $history = ValidationLog::with(['ticket.detail.transaction.event', 'ticket.detail.ticketType'])
            ->whereIn('ticket_id', $ticketIds)
            ->orderByDesc('created_at')
            ->take(15)
            ->get()
            ->map(function ($log) {
                return [
                    'id'          => $log->id,
                    'ticket_id'   => $log->ticket->id ?? 'N/A',
                    'event_name'  => $log->ticket?->detail?->transaction?->event?->title ?? 'N/A',
                    'ticket_type' => $log->ticket?->detail?->ticketType?->name ?? 'N/A',
                    'result'      => $log->result,
                    'time'        => $log->created_at->format('H:i:s'),
                ];
            });

        // Current overall check-in status — use ticket_status (actual DB column name)
        $stats = [
            'total_sold' => Ticket::whereHas('detail.transaction', function ($q) use ($eventIds) {
                $q->whereIn('event_id', $eventIds);
            })->count(),
            'checked_in' => Ticket::whereHas('detail.transaction', function ($q) use ($eventIds) {
                $q->whereIn('event_id', $eventIds);
            })->where('ticket_status', 'Checked-In')->count(),
        ];

        return Inertia::render('Organizer/CheckIn', [
            'history' => $history,
            'stats' => $stats
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
        if ($ticket->ticket_status === 'Checked-In') {
            ValidationLog::create([
                'ticket_id'       => $ticket->id,
                'validation_time' => now(),
                'result'          => 'Already Checked-In',
            ]);
            return redirect()->back()->with('error', 'Ticket has already been used (Check-in Failed).');
        }

        if ($ticket->ticket_status === 'Expired') {
            ValidationLog::create([
                'ticket_id'       => $ticket->id,
                'validation_time' => now(),
                'result'          => 'Expired',
            ]);
            return redirect()->back()->with('error', 'Ticket has expired and cannot be used.');
        }

        if ($ticket->ticket_status !== 'Valid') {
            ValidationLog::create([
                'ticket_id'       => $ticket->id,
                'validation_time' => now(),
                'result'          => 'Invalid',
            ]);
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
