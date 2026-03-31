<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EventCategory;
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
                'id' => $cat->id,
                'name' => $cat->name,
                'description' => $cat->description,
                'events' => $cat->events_count,
            ]);

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store new category.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:45|unique:event_category,name',
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
            'name' => 'required|string|max:45|unique:event_category,name,' . $id,
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
