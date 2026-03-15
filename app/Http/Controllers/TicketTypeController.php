<?php
namespace App\Http\Controllers;
use App\Models\TicketType;
use Illuminate\Http\Request;

class TicketTypeController extends Controller {
    public function index() {
        return response()->json(TicketType::all());
    }

    public function store(Request $request) {
        $data = $request->validate([
            'name' => 'required|string|max:45',
            'price' => 'required|numeric',
            'quota' => 'required|integer',
            'available_stock' => 'required|integer',
            'event_id' => 'required|exists:events,id'
        ]);

        return response()->json(TicketType::create($data), 201);
    }

    public function update(Request $request, $id) {
        $type = TicketType::findOrFail($id);
        $data = $request->validate([
            'name' => 'string|max:45',
            'price' => 'numeric',
            'quota' => 'integer',
            'available_stock' => 'integer'
        ]);
        $type->update($data);

        return response()->json($type);
    }

    public function toggleStatus($id) {
        $type = TicketType::findOrFail($id);
        $type->available_stock = 0;
        $type->save();
        
        return response()->json($type);
    }
}
