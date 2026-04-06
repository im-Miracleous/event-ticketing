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

        // Fetch trending events for carousel
        $trendingEvents = Event::where('status', 'Active')
            ->with(['category', 'ticketTypes'])
            ->orderBy('total_quota', 'desc')
            ->limit(5)
            ->get();

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
}
