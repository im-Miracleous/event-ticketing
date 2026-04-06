<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventCategory;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * List all categories with event count.
     */
    public function index()
    {
        $categories = EventCategory::withCount('events')
            ->orderBy('name')
            ->get()
            ->map(fn($cat) => [
                'id'          => $cat->id,
                'name'        => $cat->name,
                'description' => $cat->description,
                'events'      => $cat->events_count,
            ]);

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Show a single category with its events.
     */
    public function show(Request $request, int $id)
    {
        $category = EventCategory::findOrFail($id);

        $query = Event::with(['category', 'organizer', 'ticketTypes'])
            ->where('event_category_id', $id);

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

        $events = $query->orderByDesc('created_at')
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

        return Inertia::render('Admin/Categories/Show', [
            'category' => [
                'id' => $category->id,
                'name' => $category->name,
                'description' => $category->description,
            ],
            'events' => $events,
            'filters' => $request->only(['status', 'search', 'per_page']),
        ]);
    }

    /**
     * Store new category.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:45|unique:event_category,name',
            'description' => 'nullable|string|max:100',
        ]);

        EventCategory::create($request->only('name', 'description'));

        return back()->with('success', 'Category created successfully.');
    }

    /**
     * Update existing category.
     */
    public function update(Request $request, int $id)
    {
        $category = EventCategory::findOrFail($id);

        $request->validate([
            'name'        => 'required|string|max:45|unique:event_category,name,' . $id,
            'description' => 'nullable|string|max:100',
        ]);

        $category->update($request->only('name', 'description'));

        return back()->with('success', 'Category updated successfully.');
    }

    /**
     * Delete a category.
     */
    public function destroy(int $id)
    {
        $category = EventCategory::findOrFail($id);

        if ($category->events()->count() > 0) {
            return back()->withErrors(['delete' => 'Cannot delete a category that has events.']);
        }

        $category->delete();

        return back()->with('success', 'Category deleted successfully.');
    }
}
