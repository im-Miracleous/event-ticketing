<?php
namespace App\Http\Controllers;
use App\Models\Ticket;
use Illuminate\Http\Request;

class TicketController extends Controller {
    public function index() {
        return response()->json(Ticket::with(['detail', 'ticketType'])->get());
    }

    public function store(Request $request) {
        $data = $request->validate([
            'id' => 'required|string|max:50|unique:tickets',
            'qr_code' => 'required|string|max:255',
            'ticket_status' => 'required|in:Pending,Valid,Checked-In,Expired,Failed',
            'issued_at' => 'required|date',
            'transaction_detail_id' => 'required|exists:transaction_details,id',
            'ticket_type_id' => 'required|exists:tickets_types,id'
        ]);

        return response()->json(Ticket::create($data), 201);
    }

    public function update(Request $request, $id) {
        $ticket = Ticket::findOrFail($id);
        $data = $request->validate([
            'ticket_status' => 'required|in:Pending,Valid,Checked-In,Expired,Failed',
            'validated_at' => 'nullable|date'
        ]);
        $ticket->update($data);

        return response()->json($ticket);
    }

    public function toggleStatus($id) {
        $ticket = Ticket::findOrFail($id);
        $ticket->ticket_status = ($ticket->ticket_status == 'Valid') ? 'Failed' : 'Valid';
        $ticket->save();
        
        return response()->json($ticket);
    }
}
