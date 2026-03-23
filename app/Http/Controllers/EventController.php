<?php
namespace App\Http\Controllers;
use App\Models\Event;
use Illuminate\Http\Request;

use Inertia\Inertia;

class EventController extends Controller {
    public function index() {
        return Inertia::render('Organizer/Dashboard', [
            'events' => Event::with(['category', 'organizer'])->get()
        ]);
    }
    
    public function create() {
        return Inertia::render('Organizer/Events/Create');
    }

    public function store(Request $request) {
        $data = $request->validate([
            'id' => 'required|string|max:36|unique:events',
            'title' => 'required|string|max:45',
            'description' => 'required|string|max:200',
            'banner_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'event_date' => 'required|date',
            'total_quota' => 'required|integer',
            'start_time' => 'required|date',
            'end_time' => 'required|date',
            'location' => 'required|string|max:45',
            'event_category_id' => 'required',
            'organizer_id' => 'required'
        ]);

        if ($request->hasFile('banner_image')) {
            $path = $request->file('banner_image')->store('banners', 'public');
            $data['banner_image'] = '/storage/' . $path;
        } else {
            $data['banner_image'] = '/placeholder.jpg';
        }

        Event::create($data);

        return redirect()->route('organizer.dashboard')->with('success', 'Event created successfully.');
    }

    public function edit($id) {
        $event = Event::findOrFail($id);
        return Inertia::render('Organizer/Events/Edit', [
            'event' => $event
        ]);
    }

    public function update(Request $request, $id) {
        $event = Event::findOrFail($id);
        $data = $request->validate([
            'title' => 'string|max:45',
            'description' => 'string|max:200',
            'event_date' => 'date',
            'total_quota' => 'integer',
            'start_time' => 'date',
            'end_time' => 'date',
            'location' => 'string|max:45'
        ]);

        if ($request->hasFile('banner_image')) {
            $request->validate(['banner_image' => 'image|mimes:jpeg,png,jpg|max:2048']);
            $path = $request->file('banner_image')->store('banners', 'public');
            $data['banner_image'] = '/storage/' . $path;
        }

        $event->update($data);

        return redirect()->route('organizer.dashboard')->with('success', 'Event updated successfully.');
    }

    public function destroy($id) {
        $event = Event::findOrFail($id);
        $event->delete(); // This performs a soft delete
        return redirect()->back()->with('success', 'Event inactive successfully.');
    }
}
