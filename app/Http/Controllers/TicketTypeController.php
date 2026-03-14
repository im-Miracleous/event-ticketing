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
            'name' => 'required|string|max:45',
            'price' => 'required|numeric',
            'quota' => 'required|integer',
            'available_stock' => 'required|integer',
            'event_id' => 'required|string|exists:events,id'
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
