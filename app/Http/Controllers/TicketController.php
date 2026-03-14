<?php
namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TicketController extends Controller {
    public function index() {
        return response()->json(Ticket::with(['transactionDetail', 'ticketType'])->get());
    }

    public function generateTicket($transaction_id) {
        $transaction = Transaction::with('details')->findOrFail($transaction_id);

        if ($transaction->transaction_status !== 'Success') {
            return response()->json(['error' => 'Pembayaran belum lunas'], 400);
        }

        $generatedTickets = [];

        foreach ($transaction->details as $detail) {
            for ($i = 0; $i < $detail->quantity; $i++) {
                $ticket_id = 'TKT-' . strtoupper(uniqid());
                $qrString = "VALIDATE-" . $ticket_id;

                $ticket = Ticket::create([
                    'id' => $ticket_id,
                    'qr_code' => $qrString,
                    'ticket_status' => 'Active',
                    'issued_at' => now(),
                    'transaction_detail_id' => $detail->id,
                    'ticket_type_id' => $detail->ticket_type_id
                ]);

                $generatedTickets[] = $ticket;
            }
        }

        return response()->json($generatedTickets, 201);
    }

    public function update(Request $request, $id) {
        $ticket = Ticket::findOrFail($id);
        $data = $request->validate([
            'ticket_status' => 'required|in:Active,Used,Cancelled,Expired'
        ]);
        $ticket->update($data);
        return response()->json($ticket);
    }
}
