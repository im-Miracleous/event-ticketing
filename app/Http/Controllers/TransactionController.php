<?php
namespace App\Http\Controllers;

use App\Models\Transaction;
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
            'transaction_id' => 'required|string|unique:transactions',
            'users_user_id' => 'required',
            'events_event_id' => 'required',
            'tickets_types_tickettype_id' => 'required',
            'quantity' => 'required|integer|min:1',
            'payment_method' => 'required|in:Cash,Transfer,E-Wallet,Credit Card'
        ]);

        DB::beginTransaction();
        try {
            $ticketType = TicketType::findOrFail($request->tickets_types_tickettype_id);

            if ($ticketType->available_stock < $request->quantity) {
                return response()->json(['error' => 'Stok tiket tidak mencukupi'], 400);
            }
            $ticketType->decrement('available_stock', $request->quantity);

            $payment_id = 'PAY-' . rand(1000, 9999);
            $payment = Payment::create([
                'payment_id' => $payment_id,
                'payment_method' => $request->payment_method,
                'payment_status' => 'Pending',
                'transaction_time' => now()
            ]);

            $total_amount = $ticketType->price * $request->quantity;
            $transaction = Transaction::create([
                'transaction_id' => $request->transaction_id,
                'total_amount' => $total_amount,
                'transaction_status' => 'Pending',
                'users_user_id' => $request->users_user_id,
                'payments_payment_id' => $payment_id,
                'events_event_id' => $request->events_event_id
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
