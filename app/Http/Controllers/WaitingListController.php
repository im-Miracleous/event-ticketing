<?php

namespace App\Http\Controllers;

use App\Models\WaitingList;
use App\Models\TicketType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WaitingListController extends Controller
{
    /**
     * Display the user's waiting list entries.
     */
    public function index()
    {
        $entries = WaitingList::with(['event.category', 'event.ticketTypes', 'ticketType'])
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($entry) {
                return [
                    'id'          => $entry->id,
                    'status'      => $entry->status,
                    'event'       => $entry->event,
                    'ticket_type' => $entry->ticketType,
                    'joined_at'   => $entry->created_at->toISOString(),
                ];
            });

        return Inertia::render('Profile/WaitingList', [
            'entries' => $entries,
        ]);
    }

    /**
     * Join a waiting list for a sold-out ticket type.
     */
    public function store(Request $request)
    {
        $request->validate([
            'event_id'       => 'required|exists:events,id',
            'ticket_type_id' => 'required|exists:tickets_types,id',
        ]);

        $userId = Auth::id();

        // Check if already on waiting list
        $exists = WaitingList::where('user_id', $userId)
            ->where('event_id', $request->event_id)
            ->where('ticket_type_id', $request->ticket_type_id)
            ->where('status', 'Waiting')
            ->exists();

        if ($exists) {
            return back()->withErrors(['message' => 'Kamu sudah ada di waiting list untuk tiket ini.']);
        }

        WaitingList::create([
            'status'         => 'Waiting',
            'event_id'       => $request->event_id,
            'ticket_type_id' => $request->ticket_type_id,
            'user_id'        => $userId,
        ]);

        return back()->with('success', 'Berhasil bergabung ke waiting list!');
    }

    /**
     * Leave the waiting list.
     */
    public function cancel($id)
    {
        $entry = WaitingList::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $entry->update(['status' => 'Cancelled']);

        return back()->with('success', 'Berhasil keluar dari waiting list.');
    }
}
