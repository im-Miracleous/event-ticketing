<?php
namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller {
    public function index() {
        return response()->json(Event::with('category')->get());
    }

    public function store(Request $request) {
        $data = $request->validate([
            'event_id' => 'required|string|unique:events',
            'title' => 'required|string|max:45',
            'description' => 'required|string|max:200',
            'banner_image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'event_date' => 'required|date',
            'total_quota' => 'required|integer',
            'start_time' => 'required',
            'end_time' => 'required',
            'location' => 'required|string|max:45',
            'event_category_eventcategory_id' => 'required|exists:event_category,eventcategory_id'
        ]);

        if ($request->hasFile('banner_image')) {
            $path = $request->file('banner_image')->store('banners', 'public');
            $data['banner_image'] = '/storage/' . $path;
        }

        $data['status'] = 'Active';

        $event = Event::create($data);
        return response()->json($event, 201);
    }

    public function update(Request $request, $id) {
        $event = Event::findOrFail($id);
        $data = $request->validate([
            'title' => 'required|string|max:45',
            'description' => 'required|string|max:200',
            'event_date' => 'required|date',
            'total_quota' => 'required|integer',
            'start_time' => 'required',
            'end_time' => 'required',
            'location' => 'required|string|max:45',
            'event_category_eventcategory_id' => 'required|exists:event_category,eventcategory_id'
        ]);

        if ($request->hasFile('banner_image')) {
            $request->validate(['banner_image' => 'image|mimes:jpeg,png,jpg|max:2048']);
            $path = $request->file('banner_image')->store('banners', 'public');
            $data['banner_image'] = '/storage/' . $path;
        }

        $event->update($data);
        return response()->json($event);
    }

    public function toggleStatus($id) {
        $event = Event::where('event_id', $id)->firstOrFail();
        $event->status = ($event->status == 'Active') ? 'Inactive' : 'Active';
        $event->save();
        return response()->json($event);
    }
}
