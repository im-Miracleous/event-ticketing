<?php
namespace App\Http\Controllers;

use App\Models\TransactionDetail;
use Illuminate\Http\Request;

class TransactionDetailController extends Controller {
    public function index() {
        return response()->json(TransactionDetail::with(['transaction', 'ticketType'])->get());
    }

    public function store(Request $request) {
        $data = $request->validate([
            'subtotal' => 'required|numeric',
            'quantity' => 'required|integer',
            'transaction_id' => 'required',
            'ticket_type_id' => 'required'
        ]);

        $detail = TransactionDetail::create($data);
        return response()->json($detail, 201);
    }

    public function update(Request $request, $id) {
        $detail = TransactionDetail::findOrFail($id);
        $data = $request->validate([
            'subtotal' => 'required|numeric',
            'quantity' => 'required|integer'
        ]);

        $detail->update($data);
        return response()->json($detail);
    }
}
