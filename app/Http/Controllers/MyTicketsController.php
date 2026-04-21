<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Ticket;
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
                
                // Update all associated tickets to Failed
                foreach ($trx->details as $detail) {
                    foreach ($detail->tickets as $ticket) {
                        $ticket->update(['ticket_status' => 'Failed']);
                    }
                }
            });
        }

        // Fix inconsistent ticket statuses for failed transactions
        $inconsistent = Transaction::where('transaction_status', 'Failed')
            ->where('user_id', $userId)
            ->with('details.tickets')
            ->get();

        foreach ($inconsistent as $trx) {
            foreach ($trx->details as $detail) {
                foreach ($detail->tickets as $ticket) {
                    if ($ticket->ticket_status !== 'Failed' && $ticket->validated_at === null) {
                        $ticket->update(['ticket_status' => 'Failed']);
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

                // Determine tab category based on ticket status
                if ($trx->transaction_status === 'Pending') {
                    $tab = 'pending';
                } elseif ($trx->transaction_status === 'Success') {
                    // Check check-in progress
                    $allTickets = $trx->details->flatMap->tickets;
                    $totalCount = $allTickets->count();
                    $usedCount  = $allTickets->filter(fn($t) => $t->validated_at !== null)->count();
                    
                    if ($usedCount === $totalCount && $totalCount > 0) {
                        $tab = 'used'; // Fully checked in
                    } elseif ($usedCount > 0) {
                        $tab = 'partial'; // Partially checked in
                    } elseif ($eventDate && $now->gt($eventDate)) {
                        $tab = 'expired';
                    } else {
                        $tab = 'valid';
                    }
                } else {
                    $tab = 'failed'; // Failed
                }

                return array_merge($trx->toArray(), ['tab' => $tab]);
            });

        return Inertia::render('Profile/MyTickets', [
            'transactions' => $transactions,
        ]);
    }

    public function show(Ticket $ticket)
    {
        $ticket->load([
            'attendee',
            'ticketType',
            'detail.transaction.event',
            'detail.transaction.payment',
        ]);

        // Security: ensure the ticket belongs to the authenticated user
        if ($ticket->detail->transaction->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Profile/TicketDetail', [
            'ticket' => $ticket,
        ]);
    }

    public function print(Ticket $ticket)
    {
        $ticket->load([
            'attendee',
            'ticketType',
            'detail.transaction.event',
            'detail.transaction.payment',
        ]);

        // Security: ensure the ticket belongs to the authenticated user
        if ($ticket->detail->transaction->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('Profile/PrintTicket', [
            'ticket' => $ticket,
        ]);
    }
}
