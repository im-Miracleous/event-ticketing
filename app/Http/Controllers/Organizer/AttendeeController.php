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
                // Only successful transactions for events this organizer owns
                $q->whereIn('event_id', $eventIds)->where('transaction_status', 'success');
            });

        // Optional filtering by event
        if ($request->filled('event_id')) {
            $query->whereHas('detail.transaction', function($q) use ($request) {
                $q->where('event_id', $request->event_id);
            });
        }

        $tickets = $query->latest('issued_at')->paginate(20)->withQueryString();

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
            'filters' => $request->only(['event_id']),
        ]);
    }
}
