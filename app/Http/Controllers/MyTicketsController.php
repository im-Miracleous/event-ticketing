<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MyTicketsController extends Controller
{
    public function index()
    {
        $userId = Auth::id();
        $now = now();

        $transactions = Transaction::with([
            'event',
            'payment',
            'details.ticketType',
            'details.tickets.attendee',
        ])
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($trx) use ($now) {
                $eventDate = $trx->event ? $trx->event->event_date : null;

                // Determine tab category
                if ($trx->transaction_status !== 'Success') {
                    $tab = 'other'; // Pending / Cancelled / Failed
                } elseif ($eventDate && $now->lt($eventDate)) {
                    $tab = 'upcoming';
                } else {
                    // Check if any ticket has been scanned (validated_at set)
                    $hasUsed = $trx->details->flatMap->tickets->contains(fn($t) => $t->validated_at !== null);
                    $tab = $hasUsed ? 'used' : 'expired';
                }

                return array_merge($trx->toArray(), ['tab' => $tab]);
            });

        return Inertia::render('Profile/MyTickets', [
            'transactions' => $transactions,
        ]);
    }
}
