<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventCategory;
use App\Models\Organizer;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EventController extends Controller
{
    /**
     * List all events with optional filters (excludes Deactivated).
     */
    public function index(Request $request)
    {
        $query = Event::with(['category', 'organizer', 'ticketTypes']);

        // Exclude Deactivated events (they go to archive)
        $query->where('status', '!=', 'Deactivated');

        // Status filter
        if ($request->filled('status') && $request->status !== 'All') {
            $query->where('status', $request->status);
        }

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhereHas('organizer', fn ($oq) => $oq->where('name', 'like', "%{$search}%"));
            });
        }

        // ── Advanced filters ──────────────────────────────────────
        if ($request->filled('date_from')) {
            $query->whereDate('event_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('event_date', '<=', $request->date_to);
        }
        if ($request->filled('category') && $request->category !== 'All') {
            $query->whereHas('category', fn ($q) => $q->where('name', $request->category));
        }

        // ── Sorting ───────────────────────────────────────────────
        $sortColumn = $request->input('sort', 'created_at');
        $sortDirection = $request->input('direction', 'desc');

        // Map frontend column keys → actual DB columns / joins
        $sortMap = [
            'name'      => 'title',
            'date'      => 'event_date',
            'status'    => 'status',
            'organizer' => 'organizer',   // handled separately
            'category'  => 'category',    // handled separately
            'tickets'   => 'total_quota', // approximate – sort by quota
        ];

        $dbColumn = $sortMap[$sortColumn] ?? 'created_at';

        if ($dbColumn === 'organizer') {
            $query->leftJoin('organizers', 'events.organizer_id', '=', 'organizers.id')
                  ->orderBy('organizers.name', $sortDirection)
                  ->select('events.*');
        } elseif ($dbColumn === 'category') {
            $query->leftJoin('event_category', 'events.event_category_id', '=', 'event_category.id')
                  ->orderBy('event_category.name', $sortDirection)
                  ->select('events.*');
        } else {
            $query->orderBy($dbColumn, $sortDirection);
        }

        $events = $query
            ->paginate($request->input('per_page', 10))
            ->through(fn ($e) => [
                'id' => $e->id,
                'name' => $e->title,
                'organizer' => $e->organizer->name ?? '—',
                'category' => $e->category->name ?? '—',
                'date' => $e->event_date ? Carbon::parse($e->event_date)->format('M d, Y') : '—',
                'tickets' => $e->ticketTypes->count() > 0
                    ? ($e->ticketTypes->sum('quota') - $e->ticketTypes->sum('available_stock')).' / '.$e->ticketTypes->sum('quota')
                    : '0 / '.$e->total_quota,
                'status' => $e->status ?? 'Active',
            ]);

        return Inertia::render('Admin/Events/Index', [
            'events' => $events,
            'filters' => $request->only(['status', 'search', 'per_page', 'sort', 'direction', 'date_from', 'date_to', 'category']),
            'categories' => EventCategory::orderBy('name')->pluck('name'),
        ]);
    }

    /**
     * Show archived/deactivated events.
     */
    public function archive(Request $request)
    {
        $query = Event::with(['category', 'organizer', 'ticketTypes'])
            ->whereIn('status', ['Deactivated', 'Cancelled']);

        // Organizers can only see their own events
        $user = Auth::user();
        if ($user->role === 'Organizer' && $user->organizer) {
            $query->where('organizer_id', $user->organizer->id);
        }

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhereHas('organizer', fn ($oq) => $oq->where('name', 'like', "%{$search}%"));
            });
        }

        // ── Advanced filters ──────────────────────────────────────
        if ($request->filled('date_from')) {
            $query->whereDate('event_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('event_date', '<=', $request->date_to);
        }
        if ($request->filled('archive_status') && $request->archive_status !== 'All') {
            $query->where('status', $request->archive_status);
        }

        // ── Sorting ───────────────────────────────────────────────
        $sortColumn = $request->input('sort', 'created_at');
        $sortDirection = $request->input('direction', 'desc');

        $sortMap = [
            'name'           => 'title',
            'date'           => 'event_date',
            'organizer'      => 'organizer',
            'category'       => 'category',
            'tickets'        => 'total_quota',
            'deactivated_at' => 'updated_at',
        ];

        $dbColumn = $sortMap[$sortColumn] ?? 'created_at';

        if ($dbColumn === 'organizer') {
            $query->leftJoin('organizers', 'events.organizer_id', '=', 'organizers.id')
                  ->orderBy('organizers.name', $sortDirection)
                  ->select('events.*');
        } elseif ($dbColumn === 'category') {
            $query->leftJoin('event_category', 'events.event_category_id', '=', 'event_category.id')
                  ->orderBy('event_category.name', $sortDirection)
                  ->select('events.*');
        } else {
            $query->orderBy($dbColumn, $sortDirection);
        }

        $events = $query
            ->paginate($request->input('per_page', 10))
            ->through(fn ($e) => [
                'id' => $e->id,
                'name' => $e->title,
                'organizer' => $e->organizer->name ?? '—',
                'category' => $e->category->name ?? '—',
                'date' => $e->event_date ? Carbon::parse($e->event_date)->format('M d, Y') : '—',
                'tickets' => $e->ticketTypes->count() > 0
                    ? ($e->ticketTypes->sum('quota') - $e->ticketTypes->sum('available_stock')).' / '.$e->ticketTypes->sum('quota')
                    : '0 / '.$e->total_quota,
                'status' => $e->status ?? 'Deactivated',
                'deactivated_at' => $e->updated_at?->format('M d, Y H:i'),
            ]);

        return Inertia::render('Admin/Events/Archive', [
            'events' => $events,
            'filters' => $request->only(['search', 'per_page', 'sort', 'direction', 'date_from', 'date_to', 'archive_status']),
            'isRoot' => $user->role === 'Root',
        ]);
    }

    /**
     * Show single event details.
     */
    public function show(string $id)
    {
        $event = Event::with(['category', 'organizer', 'ticketTypes', 'promotions'])->findOrFail($id);
        $user = Auth::user();
        $isRoot = $user->role === 'Root';

        // Authorization check
        if (! in_array($user->role, ['Root', 'Admin']) &&
            ! ($user->organizer && $user->organizer->id === $event->organizer_id)) {
            return back()->with('error', 'You are not authorized to view this event.');
        }

        return Inertia::render('Admin/Events/Show', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'description' => $event->description,
                'banner_image' => $event->banner_image,
                'event_date' => $event->event_date,
                'start_time' => $event->start_time,
                'end_time' => $event->end_time,
                'location' => $event->location,
                'format' => $event->format,
                'total_quota' => $event->total_quota,
                'status' => $event->status,
                'created_at' => $event->created_at,
                'category' => $event->category,
                'organizer' => $event->organizer,
                'organizer_id' => $event->organizer_id,
                'ticket_types' => $event->ticketTypes->map(fn ($tt) => [
                    'id' => $tt->id,
                    'name' => $tt->name,
                    'price' => $tt->price,
                    'quota' => $tt->quota,
                    'available_stock' => $tt->available_stock,
                    'description' => $tt->description,
                ]),
                'promotions' => $event->promotions->map(fn ($p) => [
                    'id' => $p->id,
                    'code' => $p->code,
                    'discount' => $p->discount,
                    'type' => $p->type,
                    'valid_until' => $p->valid_until,
                    'status' => $p->status,
                ]),
            ],
            'canEdit' => in_array($user->role, ['Root', 'Admin']) ||
                         ($user->role === 'Organizer' && $user->organizer && $user->organizer->id === $event->organizer_id),
            'isRoot' => $isRoot,
        ]);
    }

    public function create()
    {
        if (EventCategory::count() === 0) {
            EventCategory::insert([
                ['name' => 'Music & Concert', 'description' => 'Live music events and concerts'],
                ['name' => 'Workshop & Class', 'description' => 'Educational workshops and classes'],
                ['name' => 'Seminar & Conference', 'description' => 'Professional seminars and conferences'],
                ['name' => 'Sports & Wellness', 'description' => 'Sporting events and wellness retreats'],
                ['name' => 'Exhibition & Expo', 'description' => 'Trade shows, exhibitions, and expos'],
            ]);
        }

        return Inertia::render('Admin/Events/Create', [
            'categories' => EventCategory::all(),
            'organizers' => Organizer::all(),
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
            'organizer_id' => 'required|exists:organizers,id',
        ]);

        if ($request->hasFile('banner_image')) {
            $path = $request->file('banner_image')->store('banners', 'public');
            $data['banner_image'] = '/storage/'.$path;
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
            'categories' => EventCategory::all(),
            'organizers' => Organizer::all(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);

        // Check authorization
        $user = Auth::user();
        if (! in_array($user->role, ['Root', 'Admin']) &&
            ! ($user->role === 'Organizer' && $user->organizer && $user->organizer->id === $event->organizer_id)) {
            return back()->with('error', 'You are not authorized to edit this event.');
        }

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
            'organizer_id' => 'exists:organizers,id',
        ]);

        // Prevent changing organizer_id (except for Root)
        if ($user->role !== 'Root' && isset($data['organizer_id'])) {
            unset($data['organizer_id']);
        }

        if ($request->hasFile('banner_image')) {
            $request->validate(['banner_image' => 'image|mimes:jpeg,png,jpg|max:2048']);
            $path = $request->file('banner_image')->store('banners', 'public');
            $data['banner_image'] = '/storage/'.$path;
        }

        $event->update($data);

        return redirect()->route('admin.events.show', $id)->with('success', 'Event updated successfully.');
    }

    /**
     * Update event status (Active, Draft, Cancelled, Deactivated, Completed).
     */
    public function updateStatus(Request $request, string $id)
    {
        $request->validate([
            'status' => 'required|in:Active,Draft,Cancelled,Deactivated,Completed',
        ]);

        $event = Event::findOrFail($id);
        $user = Auth::user();

        // Authorization: Root/Admin can update any event, Organizer can only update own events
        if (! in_array($user->role, ['Root', 'Admin']) &&
            ! ($user->role === 'Organizer' && $user->organizer && $user->organizer->id === $event->organizer_id)) {
            return back()->with('error', 'You are not authorized to update this event status.');
        }

        // Only Root/Admin can deactivate (suspend) events
        if ($request->status === 'Deactivated' && ! in_array($user->role, ['Root', 'Admin'])) {
            return back()->with('error', 'Only administrators can deactivate events.');
        }

        $event->update(['status' => $request->status]);

        return back()->with('success', "Event status updated to {$request->status}.");
    }

    /**
     * Restore a deactivated event to Active.
     */
    public function restore(Request $request, string $id)
    {
        $event = Event::findOrFail($id);

        // Check authorization
        $user = Auth::user();
        if (! in_array($user->role, ['Root', 'Admin']) &&
            ! ($user->role === 'Organizer' && $user->organizer && $user->organizer->id === $event->organizer_id)) {
            return back()->with('error', 'You are not authorized to restore this event.');
        }

        $event->update(['status' => 'Active']);

        return back()->with('success', 'Event restored successfully.');
    }

    /**
     * Permanently delete an event (Root only).
     */
    public function forceDelete(string $id)
    {
        $user = Auth::user();

        // Only Root can permanently delete
        if ($user->role !== 'Root') {
            return back()->with('error', 'Only Root users can permanently delete events.');
        }

        $event = Event::findOrFail($id);

        // Delete related records first (ticket types, promotions, etc.)
        $event->ticketTypes()->delete();
        $event->promotions()->delete();
        $event->transactions()->delete();
        $event->delete();

        return redirect()->route('admin.events.archive')->with('success', 'Event permanently deleted.');
    }

    /**
     * Delete an event (soft delete - requires event to be Deactivated first).
     */
    public function destroy(string $id)
    {
        $event = Event::findOrFail($id);
        $user = Auth::user();

        // Root can delete directly
        if ($user->role === 'Root') {
            $event->ticketTypes()->delete();
            $event->promotions()->delete();
            $event->transactions()->delete();
            $event->delete();

            return back()->with('success', 'Event deleted successfully.');
        }

        // Non-Root: Event must be Deactivated or Cancelled first
        if (! in_array($event->status, ['Deactivated', 'Cancelled'])) {
            return back()->with('error', 'You must deactivate or cancel the event first before deleting it. Go to Archive page to manage.');
        }

        // Check authorization for non-Root
        if (! in_array($user->role, ['Root', 'Admin']) &&
            ! ($user->role === 'Organizer' && $user->organizer && $user->organizer->id === $event->organizer_id)) {
            return back()->with('error', 'You are not authorized to delete this event.');
        }

        $event->delete();

        return back()->with('success', 'Event deleted successfully.');
    }
}
