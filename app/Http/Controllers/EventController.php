<?php
namespace App\Http\Controllers;
use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller {
    public function index() {
        return response()->json(Event::with(['category', 'organizer'])->get());
    }

    public function store(Request $request) {
        $data = $request->validate([
            'id' => 'required|string|max:36|unique:events',
            'title' => 'required|string|max:45',
            'description' => 'required|string|max:200',
            'banner_image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'event_date' => 'required|date',
            'total_quota' => 'required|integer',
            'start_time' => 'required|date_format:Y-m-d H:i:s',
            'end_time' => 'required|date_format:Y-m-d H:i:s',
            'location' => 'required|string|max:45',
            'event_category_id' => 'required|exists:event_category,id',
            'organizer_id' => 'required|exists:organizers,id'
        ]);

        if ($request->hasFile('banner_image')) {
            $path = $request->file('banner_image')->store('banners', 'public');
            $data['banner_image'] = '/storage/' . $path;
        }

        $data['status'] = 'Active';

        return response()->json(Event::create($data), 201);
    }

    public function update(Request $request, $id) {
        $event = Event::findOrFail($id);
        $data = $request->validate([
            'title' => 'string|max:45',
            'description' => 'string|max:200',
            'event_date' => 'date',
            'total_quota' => 'integer',
            'start_time' => 'date_format:Y-m-d H:i:s',
            'end_time' => 'date_format:Y-m-d H:i:s',
            'location' => 'string|max:45',
            'event_category_id' => 'exists:event_category,id',
            'organizer_id' => 'exists:organizers,id'
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
        $event = Event::findOrFail($id);
        $event->status = ($event->status == 'Active') ? 'Inactive' : 'Active';
        $event->save();
        
        return response()->json($event);
    }
}
