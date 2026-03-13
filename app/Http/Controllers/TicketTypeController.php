<?php
namespace App\Http\Controllers;

use App\Models\TicketType;
use Illuminate\Http\Request;

class TicketTypeController extends Controller {
    public function index() {
        return response()->json(TicketType::with('event')->get());
    }

    public function store(Request $request) {
        $data = $request->validate([
            'tickettype_id' => 'required|string|unique:tickets_types',
            'name' => 'required|string|max:45',
            'price' => 'required|numeric',
            'quota' => 'required|integer',
            'available_stock' => 'required|integer',
            'events_event_id' => 'required|exists:events,event_id',
            'events_event_category_eventcategory_id' => 'required'
        ]);

        $ticketType = TicketType::create($data);
        return response()->json($ticketType, 201);
    }

    public function update(Request $request, $id) {
        $ticketType = TicketType::findOrFail($id);
        $data = $request->validate([
            'name' => 'required|string|max:45',
            'price' => 'required|numeric',
            'quota' => 'required|integer',
            'available_stock' => 'required|integer'
        ]);

        $ticketType->update($data);
        return response()->json($ticketType);
    }
}
