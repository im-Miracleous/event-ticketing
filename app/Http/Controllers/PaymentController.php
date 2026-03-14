<?php
namespace App\Http\Controllers;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller {
    public function index() {
        return response()->json(Payment::all());
    }

    public function store(Request $request) {
        $data = $request->validate([
            'payment_method' => 'required|in:Cash,Transfer,E-Wallet,Credit Card',
            'payment_status' => 'required|in:Pending,Paid,Failed,Cancelled',
            'transaction_time' => 'required|date'
        ]);
        return response()->json(Payment::create($data), 201);
    }

    public function toggleStatus($id) {
        $payment = Payment::findOrFail($id);
        $payment->payment_status = 'Cancelled';
        $payment->save();
        return response()->json($payment);
    }
}
