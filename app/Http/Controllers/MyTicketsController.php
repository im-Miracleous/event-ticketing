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

        // On-the-fly cleanup for current user's expired pending transactions
        $expired = Transaction::with('details.ticketType')
            ->where('user_id', $userId)
            ->where('transaction_status', 'Pending')
            ->where('expires_at', '<', $now)
            ->get();

        foreach ($expired as $trx) {
            \Illuminate\Support\Facades\DB::transaction(function () use ($trx) {
                foreach ($trx->details as $detail) {
                    if ($detail->ticketType) {
                        $detail->ticketType->increment('available_stock', $detail->quantity);
                    }
                }
                $trx->update(['transaction_status' => 'Failed']);
                if ($trx->payment) {
                    $trx->payment->update(['payment_status' => 'Failed']);
                }
                
                // Update all associated tickets to Cancelled
                foreach ($trx->details as $detail) {
                    foreach ($detail->tickets as $ticket) {
                        $ticket->update(['ticket_status' => 'Cancelled']);
                    }
                }
            });
        }

        // Fix inconsistent ticket statuses for failed/cancelled transactions
        $inconsistent = Transaction::whereIn('transaction_status', ['Failed', 'Cancelled'])
            ->where('user_id', $userId)
            ->with('details.tickets')
            ->get();

        foreach ($inconsistent as $trx) {
            foreach ($trx->details as $detail) {
                foreach ($detail->tickets as $ticket) {
                    if ($ticket->ticket_status !== 'Cancelled' && $ticket->validated_at === null) {
                        $ticket->update(['ticket_status' => 'Cancelled']);
                    }
                }
            }
        }

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
                if ($trx->transaction_status === 'Pending') {
                    $tab = 'pending';
                } elseif ($trx->transaction_status === 'Success') {
                    // Check if any ticket has been scanned (validated_at set)
                    $hasUsed = $trx->details->flatMap->tickets->contains(fn($t) => $t->validated_at !== null);
                    
                    if ($hasUsed) {
                        $tab = 'used';
                    } elseif ($eventDate && $now->gt($eventDate)) {
                        $tab = 'expired';
                    } else {
                        $tab = 'valid'; // Success, not used, event is in future
                    }
                } else {
                    $tab = 'other'; // Cancelled / Failed / Refunded
                }

                return array_merge($trx->toArray(), ['tab' => $tab]);
            });

        return Inertia::render('Profile/MyTickets', [
            'transactions' => $transactions,
        ]);
    }

    public function show(string $id)
    {
        $ticket = \App\Models\Ticket::with([
            'attendee',
            'ticketType',
            'detail.transaction.event',
            'detail.transaction.payment',
        ])->findOrFail($id);

        // Security: ensure the ticket belongs to the authenticated user
        if ($ticket->detail->transaction->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Profile/TicketDetail', [
            'ticket' => $ticket,
        ]);
    }
}
