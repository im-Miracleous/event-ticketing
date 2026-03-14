<?php
namespace App\Http\Controllers;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller {
    public function index() {
        return response()->json(Transaction::with(['user', 'event', 'payment'])->get());
    }

    public function store(Request $request) {
        $data = $request->validate([
            'id' => 'required|string|max:50|unique:transactions',
            'total_amount' => 'required|numeric',
            'transaction_status' => 'required|in:Pending,Success,Failed,Cancelled',
            'user_id' => 'required|exists:users,id',
            'payment_id' => 'required|exists:payments,id',
            'event_id' => 'required|exists:events,id',
            'promotion_id' => 'nullable|exists:promotions,id'
        ]);
        return response()->json(Transaction::create($data), 201);
    }

    public function update(Request $request, $id) {
        $transaction = Transaction::findOrFail($id);
        $data = $request->validate([
            'transaction_status' => 'required|in:Pending,Success,Failed,Cancelled'
        ]);
        $transaction->update($data);
        return response()->json($transaction);
    }

    public function toggleStatus($id) {
        $transaction = Transaction::findOrFail($id);
        $transaction->transaction_status = 'Cancelled';
        $transaction->save();
        return response()->json($transaction);
    }
}
