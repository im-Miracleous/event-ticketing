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
                'id' => $e->id,
                'name' => $e->title,
                'organizer' => $e->organizer->name ?? '—',
                'category' => $e->category->name ?? '—',
                'date' => $e->event_date ? \Carbon\Carbon::parse($e->event_date)->format('M d, Y') : '—',
                'tickets' => $e->ticketTypes->count() > 0
                    ? ($e->ticketTypes->sum('quota') - $e->ticketTypes->sum('available_stock')) . ' / ' . $e->ticketTypes->sum('quota')
                    : '0 / ' . $e->total_quota,
                'status' => $e->status ?? 'Active',
            ]);

        return Inertia::render('Admin/Events/Index', [
            'events' => $events,
            'filters' => $request->only(['status', 'search', 'per_page']),
        ]);
    }

    public function create()
    {
        if (\App\Models\EventCategory::count() === 0) {
            \App\Models\EventCategory::insert([
                ['name' => 'Music & Concert', 'description' => 'Live music events and concerts'],
                ['name' => 'Workshop & Class', 'description' => 'Educational workshops and classes'],
                ['name' => 'Seminar & Conference', 'description' => 'Professional seminars and conferences'],
                ['name' => 'Sports & Wellness', 'description' => 'Sporting events and wellness retreats'],
                ['name' => 'Exhibition & Expo', 'description' => 'Trade shows, exhibitions, and expos']
            ]);
        }

        return Inertia::render('Admin/Events/Create', [
            'categories' => \App\Models\EventCategory::all(),
            'organizers' => \App\Models\Organizer::all()
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:45',
            'description' => 'required|string|max:200',
            'banner_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'event_date' => 'required|date',
            'total_quota' => 'required|integer',
            'start_time' => 'required|date',
            'end_time' => 'required|date',
            'location' => 'required|string|max:45',
            'format' => 'required|in:Online,Offline',
            'event_category_id' => 'required|exists:event_category,id',
            'organizer_id' => 'required|exists:organizers,id'
        ]);

        if ($request->hasFile('banner_image')) {
            $path = $request->file('banner_image')->store('banners', 'public');
            $data['banner_image'] = '/storage/' . $path;
        } else {
            $data['banner_image'] = '/images/default-event.jpg';
        }

        Event::create($data);

        return redirect()->route('admin.events.index')->with('success', 'Event created successfully.');
    }

    public function edit($id)
    {
        $event = Event::findOrFail($id);
        return Inertia::render('Admin/Events/Edit', [
            'event' => $event,
            'categories' => \App\Models\EventCategory::all(),
            'organizers' => \App\Models\Organizer::all()
        ]);
    }

    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);
        $data = $request->validate([
            'title' => 'string|max:45',
            'description' => 'string|max:200',
            'event_date' => 'date',
            'total_quota' => 'integer',
            'start_time' => 'date',
            'end_time' => 'date',
            'location' => 'string|max:45',
            'format' => 'in:Online,Offline',
            'event_category_id' => 'exists:event_category,id',
            'organizer_id' => 'exists:organizers,id'
        ]);

        if ($request->hasFile('banner_image')) {
            $request->validate(['banner_image' => 'image|mimes:jpeg,png,jpg|max:2048']);
            $path = $request->file('banner_image')->store('banners', 'public');
            $data['banner_image'] = '/storage/' . $path;
        }

        $event->update($data);

        return redirect()->route('admin.events.index')->with('success', 'Event updated successfully.');
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
