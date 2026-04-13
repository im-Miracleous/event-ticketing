<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventCategory;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use Inertia\Inertia;

class EventCatalogController extends Controller
{
    /**
     * Display the event catalog with search and filters.
     */
    public function index(Request $request)
    {
        $query = Event::query()->with(['category', 'organizer', 'ticketTypes']);

        // Filter by status (only active events)
        $query->where('status', 'Active');

        // Search by title or description
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($request->filled('category')) {
            $query->where('event_category_id', $request->input('category'));
        }

        // Filter by location
        if ($request->filled('location')) {
            $query->where('location', 'like', "%" . $request->input('location') . "%");
        }

        // Filter by format (Online vs Offline)
        if ($request->filled('format')) {
            $query->where('format', $request->input('format'));
        }

        // Filter by price range
        if ($request->filled('price_min')) {
            $query->whereHas('ticketTypes', function ($q) use ($request) {
                $q->where('price', '>=', $request->input('price_min'));
            });
        }
        if ($request->filled('price_max')) {
            $query->whereHas('ticketTypes', function ($q) use ($request) {
                $q->where('price', '<=', $request->input('price_max'));
            });
        }

        // Filter by time quick-filter
        if ($request->filled('time')) {
            $now = now();
            switch ($request->input('time')) {
                case 'today':
                    $query->whereDate('event_date', $now->toDateString());
                    break;
                case 'tomorrow':
                    $query->whereDate('event_date', $now->addDay()->toDateString());
                    break;
                case 'week':
                    $query->whereBetween('event_date', [$now->startOfWeek()->toDateString(), $now->endOfWeek()->toDateString()]);
                    break;
            }
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('event_date', '>=', $request->input('date_from'));
        }
        if ($request->filled('date_to')) {
            $query->whereDate('event_date', '<=', $request->input('date_to'));
        }

        // Sorting
        $sortMapping = [
            'date_asc' => ['event_date', 'asc'],
            'date_desc' => ['event_date', 'desc'],
            'price_asc' => ['price', 'asc'],
            'price_desc' => ['price', 'desc'],
            'popular' => ['total_quota', 'desc'],
        ];

        $sort = $request->input('sort', 'date_asc');
        if (isset($sortMapping[$sort])) {
            $query->orderBy($sortMapping[$sort][0], $sortMapping[$sort][1]);
        }

        $events = $query->paginate(12)->withQueryString();
        if ($request->wantsJson()) {
            return response()->json($events);
        }

        // Fetch trending events for carousel (Randomized but persistent for 1 hour to avoid "jumpscares")
        $trendingEventIds = session('trending_event_ids', []);
        $lastRefresh = session('trending_event_last_refresh');

        if (empty($trendingEventIds) || !$lastRefresh || now()->diffInMinutes($lastRefresh) > 60) {
            $trendingEventIds = Event::where('status', 'Active')
                ->inRandomOrder()
                ->limit(5)
                ->pluck('id')
                ->toArray();
            
            session([
                'trending_event_ids' => $trendingEventIds,
                'trending_event_last_refresh' => now()
            ]);
        }

        $trendingEvents = Event::whereIn('id', $trendingEventIds)
            ->where('status', 'Active') // Ensure they are still active
            ->with(['category', 'ticketTypes'])
            ->get();

        // Maintain the stored random order
        $trendingEvents = $trendingEvents->sortBy(function($event) use ($trendingEventIds) {
            return array_search($event->id, $trendingEventIds);
        })->values();

        $categories = EventCategory::all();

        // Get user's wishlisted event IDs
        $savedEventIds = [];
        if (Auth::check()) {
            $savedEventIds = Wishlist::where('user_id', Auth::id())
                ->pluck('event_id')
                ->toArray();
        }

        return Inertia::render('Events/Index', [
            'events' => $events,
            'trendingEvents' => $trendingEvents,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'location', 'format', 'price_min', 'price_max', 'time', 'date_from', 'date_to', 'sort']),
            'savedEventIds' => $savedEventIds,
        ]);
    }

    /**
     * Display a single event's detail page.
     */
    public function show(Event $event)
    {
        $event->load(['category', 'organizer', 'ticketTypes']);

        // Fetch recommended events (same category, excluding current, limit 6)
        $recommendedEvents = Event::where('status', 'Active')
            ->where('id', '!=', $event->id)
            ->where('event_category_id', $event->event_category_id)
            ->with(['category', 'organizer', 'ticketTypes'])
            ->orderBy('event_date', 'asc')
            ->limit(6)
            ->get();

        // If not enough from the same category, fill with other active events
        if ($recommendedEvents->count() < 6) {
            $remaining = 6 - $recommendedEvents->count();
            $additionalEvents = Event::where('status', 'Active')
                ->where('id', '!=', $event->id)
                ->whereNotIn('id', $recommendedEvents->pluck('id')->toArray())
                ->with(['category', 'organizer', 'ticketTypes'])
                ->orderBy('event_date', 'asc')
                ->limit($remaining)
                ->get();
            $recommendedEvents = $recommendedEvents->merge($additionalEvents);
        }

        // Get user's saved event IDs
        $savedEventIds = [];
        if (Auth::check()) {
            $savedEventIds = Wishlist::where('user_id', Auth::id())
                ->pluck('event_id')
                ->toArray();
        }

        return Inertia::render('Events/Show', [
            'event' => $event,
            'recommendedEvents' => $recommendedEvents,
            'savedEventIds' => $savedEventIds,
        ]);
    }
}
