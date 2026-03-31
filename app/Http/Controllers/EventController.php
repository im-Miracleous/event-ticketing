<?php
namespace App\Http\Controllers;
use App\Models\Event;
use Illuminate\Http\Request;

use Inertia\Inertia;

class EventController extends Controller {
    public function dashboard(Request $request) {
        $organizerId = auth()->user()->organizer?->id ?? 0;
        $events = Event::where('organizer_id', $organizerId)->get();
        $eventIds = $events->pluck('id');

        // Total Event Aktif
        $totalActiveEvents = $events->where('status', 'Active')->count();

        // Transactions related to this organizer's events (successful only)
        $transactions = \App\Models\Transaction::whereIn('event_id', $eventIds)
                                ->where('transaction_status', 'success')
                                ->get();
                                
        // Total Pendapatan
        $totalRevenue = $transactions->sum('total_amount');

        // Total Tiket Terjual
        $totalTicketsSold = \App\Models\Ticket::whereHas('detail.transaction', function($q) use ($eventIds) {
            $q->whereIn('event_id', $eventIds)->where('transaction_status', 'success');
        })->count();

        // Peserta Baru (Number of unique buyers)
        $newAttendees = $transactions->unique('user_id')->count();

        // Grafik Transaksi: Revenue grouped by date over the last 30 days
        $thirtyDaysAgo = now()->subDays(30);
        $recentTransactions = \App\Models\Transaction::whereIn('event_id', $eventIds)
                                ->where('transaction_status', 'success')
                                ->where('created_at', '>=', $thirtyDaysAgo)
                                ->orderBy('created_at')
                                ->get();
        
        $transactionGraph = $recentTransactions->groupBy(function($item) {
            return $item->created_at->format('d M y');
        })->map(function($rows) {
            return $rows->sum('total_amount');
        })->map(function($amount, $date) {
            return ['date' => $date, 'revenue' => $amount];
        })->values();

        // Analisis Performa Event: Tickets sold or Revenue per Event
        $eventPerformance = $events->map(function ($event) use ($transactions) {
            // Calculate revenue inside PHP collection for this specific event
            $eventRevenue = $transactions->where('event_id', $event->id)->sum('total_amount');
            return [
                'name' => $event->title,
                'revenue' => $eventRevenue
            ];
        })->sortByDesc('revenue')->take(5)->values(); // Top 5 events by revenue

        return Inertia::render('Organizer/Dashboard', [
            'stats' => [
                'totalActiveEvents' => $totalActiveEvents,
                'totalTicketsSold' => $totalTicketsSold,
                'totalRevenue' => $totalRevenue,
                'newAttendees' => $newAttendees,
            ],
            'charts' => [
                'transactionGraph' => $transactionGraph,
                'eventPerformance' => $eventPerformance,
            ]
        ]);
    }

    public function exportSales() {
        $organizerId = auth()->user()->organizer?->id ?? 0;
        return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\OrganizerSalesExport($organizerId), 'laporan-penjualan-organizer.xlsx');
    }

    public function index() {
        return Inertia::render('Organizer/Events/Index', [
            'events' => Event::with(['category'])->where('organizer_id', auth()->user()->organizer?->id ?? 0)->get()
        ]);
    }
}
