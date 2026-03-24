<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    /**
     * List all events with optional filters.
     */
    public function index(Request $request)
    {
        $query = Event::with(['category', 'organizer', 'ticketTypes']);

        // Status filter
        if ($request->filled('status') && $request->status !== 'All') {
            $query->where('status', $request->status);
        }

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhereHas('organizer', fn($oq) => $oq->where('name', 'like', "%{$search}%"));
            });
        }

        $events = $query->orderByDesc('created_at')
            ->paginate($request->input('per_page', 10))
            ->through(fn($e) => [
                'id'        => $e->id,
                'name'      => $e->title,
                'organizer' => $e->organizer->name ?? '—',
                'category'  => $e->category->name ?? '—',
                'date'      => $e->event_date ? \Carbon\Carbon::parse($e->event_date)->format('M d, Y') : '—',
                'tickets'   => $e->ticketTypes->count() > 0
                    ? ($e->ticketTypes->sum('quota') - $e->ticketTypes->sum('available_stock')) . ' / ' . $e->ticketTypes->sum('quota')
                    : '0 / ' . $e->total_quota,
                'status'    => $e->status ?? 'Active',
            ]);

        return Inertia::render('Admin/Events/Index', [
            'events'  => $events,
            'filters' => $request->only(['status', 'search', 'per_page']),
        ]);
    }

    /**
     * Update event status (approve / suspend / etc).
     */
    public function updateStatus(Request $request, string $id)
    {
        $request->validate([
            'status' => 'required|in:Active,Draft,Cancelled,Suspended',
        ]);

        $event = Event::findOrFail($id);
        $event->update(['status' => $request->status]);

        return back()->with('success', "Event status updated to {$request->status}.");
    }

    /**
     * Delete an event.
     */
    public function destroy(string $id)
    {
        $event = Event::findOrFail($id);
        $event->delete();

        return back()->with('success', 'Event deleted successfully.');
    }
}
