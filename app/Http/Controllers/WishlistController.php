<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WishlistController extends Controller
{
    /**
     * Display the user's saved/wishlisted events.
     */
    public function index()
    {
        $wishlists = Wishlist::with(['event.category', 'event.ticketTypes', 'event.organizer'])
            ->where('user_id', Auth::id())
            ->latest()
            ->get()
            ->map(function ($wishlist) {
                return [
                    'id'       => $wishlist->id,
                    'event'    => $wishlist->event,
                    'saved_at' => $wishlist->created_at->toISOString(),
                ];
            });

        return Inertia::render('Profile/SavedEvents', [
            'wishlists' => $wishlists,
        ]);
    }

    /**
     * Toggle save/unsave an event (used via AJAX from event cards).
     */
    public function toggle(Request $request)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
        ]);

        $userId  = Auth::id();
        $eventId = $request->event_id;

        $existing = Wishlist::where('user_id', $userId)
            ->where('event_id', $eventId)
            ->first();

        if ($existing) {
            $existing->delete();
            return back()->with('success', 'Event removed from your saved list.');
        }

        Wishlist::create([
            'user_id'  => $userId,
            'event_id' => $eventId,
        ]);

        return back()->with('success', 'Event saved successfully!');
    }

    /**
     * Check if an event is wishlisted by the current user (for API usage).
     */
    public function check(Request $request)
    {
        $eventId = $request->query('event_id');

        $exists = Wishlist::where('user_id', Auth::id())
            ->where('event_id', $eventId)
            ->exists();

        return response()->json(['saved' => $exists]);
    }
}
