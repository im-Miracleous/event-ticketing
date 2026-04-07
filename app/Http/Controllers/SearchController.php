<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SearchController extends Controller
{
    /**
     * Display the search results page.
     */
    public function index(Request $request)
    {
        $query = Event::query()->with(['category', 'organizer', 'ticketTypes'])
            ->where('status', 'Active');

        $searchQuery = $request->input('q');

        if (!empty($searchQuery)) {
            $query->where(function($q) use ($searchQuery) {
                $q->where('title', 'like', "%{$searchQuery}%")
                  ->orWhere('description', 'like', "%{$searchQuery}%")
                  ->orWhere('location', 'like', "%{$searchQuery}%");
            });
        }

        $events = $query->paginate(12)->withQueryString();

        return Inertia::render('Search/Index', [
            'events' => $events,
            'query' => $searchQuery,
        ]);
    }
}
