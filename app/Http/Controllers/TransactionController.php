<?php
namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\TicketType;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller {
    public function index() {
        return response()->json(Transaction::with(['user', 'payment', 'event'])->get());
    }

    public function store(Request $request) {
        $request->validate([
            'id' => 'required|string|unique:transactions',
            'user_id' => 'required',
            'event_id' => 'required',
            'ticket_type_id' => 'required',
            'quantity' => 'required|integer|min:1',
            'payment_method' => 'required|in:Cash,Transfer,E-Wallet,Credit Card'
        ]);

        DB::beginTransaction();
        try {
            $ticketType = TicketType::findOrFail($request->ticket_type_id);

            if ($ticketType->available_stock < $request->quantity) {
                return response()->json(['error' => 'Stok tiket tidak mencukupi'], 400);
            }
            $ticketType->decrement('available_stock', $request->quantity);

            $payment = Payment::create([
                'payment_method' => $request->payment_method,
                'payment_status' => 'Pending',
                'transaction_time' => now()
            ]);

            $total_amount = $ticketType->price * $request->quantity;
            $transaction = Transaction::create([
                'id' => $request->id,
                'total_amount' => $total_amount,
                'transaction_status' => 'Pending',
                'user_id' => $request->user_id,
                'payment_id' => $payment->id,
                'event_id' => $request->event_id
            ]);

            TransactionDetail::create([
                'subtotal' => $total_amount,
                'quantity' => $request->quantity,
                'transaction_id' => $transaction->id,
                'ticket_type_id' => $ticketType->id
            ]);

            DB::commit();
            return response()->json($transaction, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Terjadi kesalahan sistem'], 500);
        }
    }

    public function update(Request $request, $id) {
        $transaction = Transaction::findOrFail($id);
        $data = $request->validate([
            'transaction_status' => 'required|in:Pending,Success,Failed,Cancelled'
        ]);
        $transaction->update($data);
        return response()->json($transaction);
    }
}
