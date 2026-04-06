<?php

namespace App\Http\Controllers\Organizer;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendeeController extends Controller
{
    /**
     * Display a listing of attendees for the current organizer's events.
     */
    public function index(Request $request)
    {
        $organizerId = auth()->user()->organizer?->id ?? 0;

        // Fetch events for filtering dropdown
        $events = Event::where('organizer_id', $organizerId)->get(['id', 'title']);
        $eventIds = $events->pluck('id');

        $query = Ticket::with(['attendee', 'ticketType', 'detail.transaction'])
            ->whereHas('detail.transaction', function($q) use ($eventIds) {
                $q->whereIn('event_id', $eventIds)->where('transaction_status', 'success');
            });

        // Optional filtering by event
        if ($request->filled('event_id')) {
            $query->whereHas('detail.transaction', function($q) use ($request) {
                $q->where('event_id', $request->event_id);
            });
        }

        // Status filter (ticket_status)
        if ($request->filled('status') && $request->status !== 'All') {
            $query->where('ticket_status', $request->status);
        }

        // Search
        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->whereHas('attendee', fn($aq) => $aq->where('name', 'like', "%{$s}%")->orWhere('email', 'like', "%{$s}%"))
                  ->orWhere('id', 'like', "%{$s}%");
            });
        }

        // Date range
        if ($request->filled('date_from')) {
            $query->whereDate('issued_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('issued_at', '<=', $request->date_to);
        }

        // Dynamic sorting
        $sortMap = [
            'attendee_name' => 'issued_at',
            'ticket_type'   => 'issued_at',
            'status'        => 'ticket_status',
            'issued_at'     => 'issued_at',
        ];
        $sortCol = $sortMap[$request->input('sort')] ?? 'issued_at';
        $sortDir = $request->input('direction', 'desc') === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sortCol, $sortDir);

        $tickets = $query->paginate(20)->withQueryString();

        // Transform the data for the frontend table
        $attendees = $tickets->through(function ($ticket) {
            return [
                'id' => $ticket->id,
                'qr_code' => $ticket->qr_code,
                'status' => $ticket->ticket_status,
                'issued_at' => $ticket->issued_at,
                'validated_at' => $ticket->validated_at,
                'attendee_name' => $ticket->attendee->name ?? '-',
                'attendee_email' => $ticket->attendee->email ?? '-',
                'identity_number' => $ticket->attendee->identity_number ?? '-',
                'ticket_type' => $ticket->ticketType->name ?? 'Regular',
                'event_name' => $ticket->detail->transaction->event->title ?? 'Unknown Event',
                'buyer_name' => $ticket->detail->transaction->user->name ?? 'Guest',
            ];
        });

        return Inertia::render('Organizer/Attendees/Index', [
            'attendees' => $attendees,
            'events' => $events,
            'filters' => $request->only(['event_id', 'search', 'status', 'sort', 'direction', 'date_from', 'date_to']),
        ]);
    }
}
