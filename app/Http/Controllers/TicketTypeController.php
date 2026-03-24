<?php
namespace App\Http\Controllers;
use App\Models\TicketType;
use Illuminate\Http\Request;

use App\Models\Event;
use Inertia\Inertia;

class TicketTypeController extends Controller {
    public function index($eventId) {
        $event = Event::findOrFail($eventId);
        $ticketTypes = TicketType::where('event_id', $eventId)->get();
        return Inertia::render('Organizer/Tickets/Manage', [
            'event' => $event,
            'ticketTypes' => $ticketTypes
        ]);
    }

    public function store(Request $request, $eventId) {
        $data = $request->validate([
            'name' => 'required|string|max:45',
            'price' => 'required|numeric',
            'quota' => 'required|integer'
        ]);
        
        $data['event_id'] = $eventId;
        $data['available_stock'] = $data['quota']; // Initially available stock = quota

        TicketType::create($data);

        return redirect()->back()->with('success', 'Ticket type added successfully.');
    }

    public function destroy($eventId, $id) {
        $type = TicketType::findOrFail($id);
        $type->delete();
        
        return redirect()->back()->with('success', 'Ticket type removed.');
    }
}
