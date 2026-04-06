<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Transaction;
use App\Models\Ticket;
use App\Models\Organizer;
use App\Models\TicketType;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class EventController extends Controller
{
    public function dashboard(Request $request)
    {
        $user = auth()->user();
        if (!$user->organizer) {
            return redirect()->route('dashboard')->with('error', 'Akun Anda belum terdaftar sebagai Organizer.');
        }

        $organizerId = $user->organizer->id;
        $period = $request->input('period', 'monthly');

        // ── STATS ──
        $events = Event::where('organizer_id', $organizerId)->get();
        $eventIds = $events->pluck('id');

        $totalActiveEvents = $events->where('status', 'Active')->count();
        
        $allTransactions = Transaction::whereIn('event_id', $eventIds)
            ->where('payment_status', 'Paid')
            ->get();
            
        $totalRevenue = $allTransactions->sum('total_amount');
        $totalTicketsSold = $allTransactions->count();

        $totalTickets = TicketType::whereIn('event_id', $eventIds)->sum('quota');
        $checkedIn = Ticket::whereHas('detail', function($q) use ($eventIds) {
            $q->whereIn('event_id', $eventIds);
        })->where('status', 'Used')->count();

        $uniqueAttendees = $allTransactions->unique('user_id')->count();

        // ── EVENT STATUS BREAKDOWN ──
        $eventStatus = [
            'upcoming' => $events->where('status', 'Active')->where('start_date', '>', now())->count(),
            'ongoing' => $events->where('status', 'Active')->where('start_date', '<=', now())->where('end_date', '>=', now())->count(),
            'completed' => $events->where('status', 'Active')->where('end_date', '<', now())->count(),
        ];

        // ── TICKET TYPE SUMMARY ──
        $ticketTypeSummary = DB::table('ticket_types')
            ->join('events', 'ticket_types.event_id', '=', 'events.id')
            ->where('events.organizer_id', $organizerId)
            ->select('ticket_types.name', DB::raw('SUM(ticket_types.sold) as sold'))
            ->groupBy('ticket_types.name')
            ->orderByDesc('sold')
            ->take(5)
            ->get();

        // ── CHARTS: TRANSACTION GRAPH ──
        $days = $period === 'daily' ? 7 : ($period === 'weekly' ? 28 : 90);
        $transactionData = Transaction::whereIn('event_id', $eventIds)
            ->where('payment_status', 'Paid')
            ->where('created_at', '>=', now()->subDays($days))
            ->orderBy('created_at')
            ->get()
            ->groupBy(function($val) use ($period) {
                if ($period === 'daily') return Carbon::parse($val->created_at)->format('D');
                if ($period === 'weekly') return 'Week ' . Carbon::parse($val->created_at)->weekOfYear;
                return Carbon::parse($val->created_at)->format('M d');
            });

        $transactionGraph = [];
        foreach ($transactionData as $key => $items) {
            $transactionGraph[] = [
                'date' => $key,
                'revenue' => $items->sum('total_amount')
            ];
        }

        // ── CHARTS: EVENT PERFORMANCE ──
        $eventPerformance = $events->map(function($e) use ($allTransactions) {
            return [
                'name' => $e->title,
                'revenue' => $allTransactions->where('event_id', $e->id)->sum('total_amount')
            ];
        })->sortByDesc('revenue')->values()->take(5);

        // ── RECENT TRANSACTIONS ──
        $recentTransactions = Transaction::with(['event', 'user'])
            ->whereIn('event_id', $eventIds)
            ->orderByDesc('created_at')
            ->take(8)
            ->get()
            ->map(function($tx) {
                return [
                    'id' => $tx->id,
                    'buyer_name' => $tx->user->name ?? 'Guest',
                    'event_name' => $tx->event->title ?? 'N/A',
                    'total_amount' => $tx->total_amount,
                    'payment_status' => $tx->payment_status,
                    'date' => $tx->created_at->format('d M, H:i'),
                ];
            });

        return Inertia::render('Organizer/Dashboard', [
            'stats' => [
                'totalActiveEvents' => $totalActiveEvents,
                'totalTicketsSold' => $totalTicketsSold,
                'totalRevenue' => $totalRevenue,
                'totalTickets' => $totalTickets,
                'checkedIn' => $checkedIn,
                'uniqueAttendees' => $uniqueAttendees,
            ],
            'eventStatus' => $eventStatus,
            'ticketTypeSummary' => $ticketTypeSummary,
            'charts' => [
                'transactionGraph' => $transactionGraph,
                'eventPerformance' => $eventPerformance,
            ],
            'recentTransactions' => $recentTransactions,
            'period' => $period
        ]);
    }

    public function index()
    {
        $organizerId = auth()->user()->organizer?->id;
        $events = Event::with(['category', 'ticketTypes'])
            ->where('organizer_id', $organizerId)
            ->orderByDesc('created_at')
            ->get()
            ->map(function($e) {
                $sold = $e->ticketTypes->sum('sold');
                $quota = $e->ticketTypes->sum('quota');
                return [
                    'id' => $e->id,
                    'title' => $e->title,
                    'category' => $e->category->name ?? 'Uncategorized',
                    'status' => $e->status,
                    'sold' => $sold,
                    'quota' => $quota,
                    'revenue' => Transaction::where('event_id', $e->id)->where('payment_status', 'Paid')->sum('total_amount'),
                    'date' => Carbon::parse($e->start_date)->format('d M Y'),
                    'progress' => $quota > 0 ? round(($sold / $quota) * 100) : 0,
                ];
            });

        return Inertia::render('Organizer/Events/Index', [
            'events' => $events
        ]);
    }

    public function show(Event $event)
    {
        $this->authorizeOwner($event);

        $event->load(['category', 'ticketTypes']);
        
        $stats = [
            'revenue' => Transaction::where('event_id', $event->id)->where('payment_status', 'Paid')->sum('total_amount'),
            'sold' => $event->ticketTypes->sum('sold'),
            'quota' => $event->ticketTypes->sum('quota'),
            'checkedIn' => Ticket::whereHas('detail', function($q) use ($event) {
                $q->where('event_id', $event->id);
            })->where('status', 'Used')->count(),
        ];

        $ticketBreakdown = $event->ticketTypes->map(function($tt) {
            return [
                'name' => $tt->name,
                'sold' => $tt->sold,
                'quota' => $tt->quota,
                'price' => $tt->price,
            ];
        });

        $attendees = Ticket::with(['detail.transaction.user', 'detail.ticketType'])
            ->whereHas('detail', function($q) use ($event) {
                $q->where('event_id', $event->id);
            })
            ->orderByDesc('created_at')
            ->get()
            ->map(function($t) {
                return [
                    'id' => $t->id,
                    'name' => $t->detail->transaction->user->name ?? 'Guest',
                    'email' => $t->detail->transaction->user->email ?? '-',
                    'ticket_type' => $t->detail->ticketType->name ?? 'N/A',
                    'status' => $t->status,
                    'validated_at' => $t->validated_at ? Carbon::parse($t->validated_at)->format('d M, H:i') : null,
                ];
            });

        return Inertia::render('Organizer/Events/Show', [
            'event' => $event,
            'stats' => $stats,
            'ticketBreakdown' => $ticketBreakdown,
            'attendees' => $attendees,
        ]);
    }

    public function transactions(Request $request)
    {
        $organizerId = auth()->user()->organizer?->id;
        $transactions = Transaction::with(['event', 'user'])
            ->whereIn('event_id', Event::where('organizer_id', $organizerId)->pluck('id'))
            ->orderByDesc('created_at')
            ->get()
            ->map(function($tx) {
                return [
                    'id' => $tx->id,
                    'buyer_name' => $tx->user->name ?? 'Guest',
                    'event_name' => $tx->event->title ?? 'N/A',
                    'total_amount' => $tx->total_amount,
                    'payment_status' => $tx->payment_status,
                    'payment_method' => $tx->payment_method,
                    'date' => $tx->created_at->format('d M Y, H:i'),
                ];
            });

        return Inertia::render('Organizer/Transactions/Index', [
            'transactions' => $transactions
        ]);
    }

    private function authorizeOwner(Event $event)
    {
        if ($event->organizer_id !== auth()->user()->organizer?->id) {
            abort(403);
        }
    }

    public function exportSales()
    {
        $organizerId = auth()->user()->organizer?->id;
        return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\OrganizerSalesExport($organizerId), 'laporan-penjualan.xlsx');
    }
}
