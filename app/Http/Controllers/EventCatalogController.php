<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventCategory;
use Illuminate\Http\Request;

use Inertia\Inertia;

class EventCatalogController extends Controller
{
    /**
     * Display the event catalog with search and filters.
     */
    public function index(Request $request)
    {
        $query = Event::query()->with(['category', 'organizer', 'ticketTypes']);

        // Search by title or description
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
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

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('event_date', '>=', $request->input('date_from'));
        }
        if ($request->filled('date_to')) {
            $query->whereDate('event_date', '<=', $request->input('date_to'));
        }

        // Filter by status (only active events)
        $query->where('status', 'Active');

        $events = $query->orderBy('event_date', 'asc')->paginate(12)->withQueryString();
        $categories = EventCategory::all();

        return Inertia::render('Events/Index', [
            'events' => $events,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'location', 'date_from', 'date_to']),
        ]);
    }
}
