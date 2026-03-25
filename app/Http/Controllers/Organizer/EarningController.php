<?php

namespace App\Http\Controllers\Organizer;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EarningController extends Controller
{
    /**
     * Display the comprehensive earnings ledger for the current organizer.
     */
    public function index(Request $request)
    {
        $organizerId = auth()->user()->organizer?->id ?? 0;

        $events = Event::where('organizer_id', $organizerId)->get(['id', 'title']);
        $eventIds = $events->pluck('id');

        $query = Transaction::with(['user', 'event', 'payment'])
            ->whereIn('event_id', $eventIds)
            ->where('transaction_status', 'success');

        // Optional filtering by event
        if ($request->filled('event_id')) {
            $query->where('event_id', $request->event_id);
        }

        $transactions = $query->latest()->paginate(20)->withQueryString();
        
        // Transform the data to keep the React component clean
        $ledger = $transactions->through(function ($tx) {
            return [
                'id' => $tx->id,
                'buyer_name' => $tx->user->name ?? 'Guest',
                'buyer_email' => $tx->user->email ?? '-',
                'event_name' => $tx->event->title ?? 'Unknown Event',
                'total_amount' => $tx->total_amount,
                'date' => $tx->created_at,
                'payment_method' => $tx->payment->payment_type ?? 'Transfer Bank',
                'payment_status' => $tx->payment->payment_status ?? 'success',
            ];
        });

        // Totals mapping for cards
        $totalEarnings = Transaction::whereIn('event_id', $eventIds)
            ->where('transaction_status', 'success')
            ->sum('total_amount');
            
        $totalTransactions = Transaction::whereIn('event_id', $eventIds)
            ->where('transaction_status', 'success')
            ->count();

        return Inertia::render('Organizer/Earnings/Index', [
            'ledger' => $ledger,
            'events' => $events,
            'filters' => $request->only(['event_id']),
            'summary' => [
                'totalEarnings' => $totalEarnings,
                'totalTransactions' => $totalTransactions,
            ]
        ]);
    }
}
