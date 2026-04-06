<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class FinanceController extends Controller
{
    public function index(Request $request)
    {
        $totalSales    = Transaction::where('transaction_status', 'Success')->sum('total_amount');
        $platformFee   = $totalSales * 0.20;
        $organizerPay  = $totalSales * 0.80;
        $pendingAmount = Transaction::where('transaction_status', 'Pending')->sum('total_amount');

        $financeStats = [
            ['title' => 'Total Ticket Sales',  'value' => 'Rp' . number_format($totalSales, 0, ',', '.')],
            ['title' => 'Platform Fee (20%)',   'value' => 'Rp' . number_format($platformFee, 0, ',', '.')],
            ['title' => 'Organizer Payouts',    'value' => 'Rp' . number_format($organizerPay, 0, ',', '.')],
            ['title' => 'Pending Payouts',      'value' => 'Rp' . number_format($pendingAmount, 0, ',', '.')],
        ];

        // Build transactions query with filters
        $query = Transaction::with(['user', 'event']);

        // Search
        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('id', 'like', "%{$s}%")
                  ->orWhereHas('user', fn($uq) => $uq->where('name', 'like', "%{$s}%"))
                  ->orWhereHas('event', fn($eq) => $eq->where('title', 'like', "%{$s}%"));
            });
        }

        // Status filter
        if ($request->filled('status') && $request->status !== 'All') {
            $query->where('transaction_status', $request->status);
        }

        // Date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Dynamic sorting
        $sortMap = [
            'user'   => 'user',
            'event'  => 'event',
            'amount' => 'total_amount',
            'fee'    => 'total_amount',
            'date'   => 'created_at',
            'status' => 'transaction_status',
        ];
        $sortCol = $sortMap[$request->input('sort')] ?? 'created_at';
        $sortDir = $request->input('direction', 'desc') === 'asc' ? 'asc' : 'desc';

        if ($sortCol === 'user') {
            $query->leftJoin('users', 'transactions.user_id', '=', 'users.id')
                  ->orderBy('users.name', $sortDir)
                  ->select('transactions.*');
        } elseif ($sortCol === 'event') {
            $query->leftJoin('events', 'transactions.event_id', '=', 'events.id')
                  ->orderBy('events.title', $sortDir)
                  ->select('transactions.*');
        } else {
            $query->orderBy($sortCol, $sortDir);
        }

        $recentTransactions = $query
            ->paginate($request->input('per_page', 10))
            ->through(fn($t) => [
                'id'     => $t->id,
                'user'   => $t->user->name ?? '—',
                'event'  => $t->event->title ?? '—',
                'amount' => 'Rp' . number_format($t->total_amount, 0, ',', '.'),
                'fee'    => 'Rp' . number_format($t->total_amount * 0.20, 0, ',', '.'),
                'date'   => $t->created_at ? $t->created_at->format('M d, Y') : '—',
                'status' => $t->transaction_status,
            ]);

        // Monthly revenue (last 6 months)
        $monthlyRevenue = collect();
        for ($i = 5; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $monthlySales = Transaction::where('transaction_status', 'Success')
                ->whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->sum('total_amount');

            $monthlyRevenue->push([
                'month' => $date->format('M'),
                'sales' => 'Rp' . number_format($monthlySales, 0, ',', '.'),
                'fee'   => 'Rp' . number_format($monthlySales * 0.20, 0, ',', '.'),
            ]);
        }

        return Inertia::render('Admin/Finance/Index', [
            'financeStats'       => $financeStats,
            'recentTransactions' => $recentTransactions,
            'monthlyRevenue'     => $monthlyRevenue,
            'filters'            => $request->only(['search', 'status', 'sort', 'direction', 'date_from', 'date_to', 'per_page']),
        ]);
    }
}
