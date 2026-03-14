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

        $payment = Payment::create($data);
        return response()->json($payment, 201);
    }

    public function update(Request $request, $id) {
        $payment = Payment::findOrFail($id);
        $data = $request->validate([
            'payment_status' => 'required|in:Pending,Paid,Failed,Cancelled'
        ]);

        $payment->update($data);
        return response()->json($payment);
    }
}
