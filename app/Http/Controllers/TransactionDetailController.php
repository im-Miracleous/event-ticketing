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
            'transaction_id' => 'required|exists:transactions,id',
            'ticket_type_id' => 'required|exists:tickets_types,id'
        ]);
        $data['status'] = 'Active';
        return response()->json(TransactionDetail::create($data), 201);
    }

    public function update(Request $request, $id) {
        $detail = TransactionDetail::findOrFail($id);
        $data = $request->validate([
            'subtotal' => 'numeric',
            'quantity' => 'integer'
        ]);
        $detail->update($data);
        return response()->json($detail);
    }

    public function toggleStatus($id) {
        $detail = TransactionDetail::findOrFail($id);
        $detail->status = ($detail->status == 'Active') ? 'Cancelled' : 'Active';
        $detail->save();
        return response()->json($detail);
    }
}
