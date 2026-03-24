<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class FinanceController extends Controller
{
    public function index()
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

        // Recent transactions
        $recentTransactions = Transaction::with(['user', 'event'])
            ->orderByDesc('created_at')
            ->limit(10)
            ->get()
            ->map(fn($t) => [
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
        ]);
    }
}
