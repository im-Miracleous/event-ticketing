<?php
namespace App\Http\Controllers;

use App\Models\EventCategory;
use Illuminate\Http\Request;

class EventCategoryController extends Controller {
    public function index() {
        return response()->json(EventCategory::all());
    }

    public function store(Request $request) {
        $data = $request->validate([
            'eventcategory_id' => 'required|string|unique:event_category',
            'name' => 'required|string|max:45',
            'description' => 'nullable|string|max:100'
        ]);

        $category = EventCategory::create($data);
        return response()->json($category, 201);
    }

    public function update(Request $request, $id) {
        $category = EventCategory::findOrFail($id);
        $data = $request->validate([
            'name' => 'required|string|max:45',
            'description' => 'nullable|string|max:100'
        ]);

        $category->update($data);
        return response()->json($category);
    }
}
