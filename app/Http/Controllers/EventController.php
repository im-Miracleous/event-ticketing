<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventCategory;
use App\Models\Transaction;
use App\Models\Ticket;
use App\Models\Organizer;
use App\Models\TicketType;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class EventController extends Controller
{
    /**
     * Get the current user's organizer, or abort.
     */
    private function organizer()
    {
        $user = Auth::user();
        $organizer = $user->organizer;
        if (! $organizer) {
            abort(403, 'You do not have an organizer profile.');
        }
        return $organizer;
    }

    public function dashboard(Request $request)
    {
        $user = auth()->user();
        if (!$user->organizer) {
            return redirect()->route('dashboard')->with('error', 'Your account is not registered as an Organizer.');
        }

        $organizerId = $user->organizer->id;
        $period = $request->input('period', '30days');
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');
        $filterEventId = $request->input('event_id');

        // ── STATS ──
        $events = Event::where('organizer_id', $organizerId)->get();
        $eventIds = $events->pluck('id');

        // If filtering by specific event, scope eventIds
        $scopedEventIds = $filterEventId ? $eventIds->intersect([$filterEventId]) : $eventIds;

        $totalActiveEvents = $events->where('status', 'Active')->count();

        $allTransactions = Transaction::whereIn('event_id', $scopedEventIds)
            ->where('transaction_status', 'Success')
            ->get();

        $totalRevenue = $allTransactions->sum('total_amount');
        $totalTicketsSold = $allTransactions->count();

        $totalTickets = TicketType::whereIn('event_id', $scopedEventIds)->sum('quota');
        $checkedIn = Ticket::whereHas('detail.transaction', function($q) use ($scopedEventIds) {
            $q->whereIn('event_id', $scopedEventIds);
        })->where('ticket_status', 'Checked-In')->count();

        $uniqueAttendees = $allTransactions->unique('user_id')->count();

        // ── EVENT STATUS BREAKDOWN ──
        $eventStatus = [
            'upcoming' => $events->where('status', 'Active')->where('start_date', '>', now())->count(),
            'ongoing' => $events->where('status', 'Active')->where('start_date', '<=', now())->where('end_date', '>=', now())->count(),
            'completed' => $events->where('status', 'Active')->where('end_date', '<', now())->count(),
        ];

        // ── TICKET TYPE SUMMARY ──
        $ticketTypeSummary = DB::table('tickets_types')
            ->join('events', 'tickets_types.event_id', '=', 'events.id')
            ->where('events.organizer_id', $organizerId)
            ->when($filterEventId, fn($q) => $q->where('events.id', $filterEventId))
            ->select('tickets_types.name', DB::raw('SUM(tickets_types.quota - tickets_types.available_stock) as sold'))
            ->groupBy('tickets_types.name')
            ->orderByDesc('sold')
            ->take(5)
            ->get();

        // ── DETERMINE DATE RANGE ──
        $useCustomRange = $dateFrom && $dateTo;

        if ($useCustomRange) {
            $startDate = Carbon::parse($dateFrom)->startOfDay();
            $endDate = Carbon::parse($dateTo)->endOfDay();
            $days = $startDate->diffInDays($endDate) + 1;
        } else {
            $days = match($period) {
                '7days' => 7,
                '30days' => 30,
                '1year' => 365,
                default => 30,
            };
            $startDate = now()->subDays($days)->startOfDay();
            $endDate = now()->endOfDay();
        }

        // ── CHARTS: TRANSACTION GRAPH (Revenue + Tickets Sold per Day) ──
        $transactionGraph = [];

        $rawTransactions = Transaction::whereIn('event_id', $scopedEventIds)
            ->where('transaction_status', 'Success')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->orderBy('created_at')
            ->get();

        // Count tickets sold per transaction (via transaction_details)
        $ticketCountByTxn = DB::table('transaction_details')
            ->whereIn('transaction_id', $rawTransactions->pluck('id'))
            ->select('transaction_id', DB::raw('SUM(quantity) as qty'))
            ->groupBy('transaction_id')
            ->pluck('qty', 'transaction_id');

        if ((!$useCustomRange && $period === '1year') || ($useCustomRange && $days > 90)) {
            // Group by Month
            $transactionData = $rawTransactions->groupBy(function($val) {
                return Carbon::parse($val->created_at)->format('Y-m');
            });

            $months = $useCustomRange
                ? $startDate->diffInMonths($endDate) + 1
                : 12;

            for ($i = $months - 1; $i >= 0; $i--) {
                $monthDate = ($useCustomRange ? $endDate->copy() : now())->subMonths($i);
                $key = $monthDate->format('Y-m');
                $label = $monthDate->format('M Y');
                $monthTxns = $transactionData[$key] ?? collect();
                $transactionGraph[] = [
                    'date' => $label,
                    'revenue' => $monthTxns->sum('total_amount'),
                    'tickets_sold' => $monthTxns->sum(fn($tx) => $ticketCountByTxn[$tx->id] ?? 0),
                ];
            }
        } else {
            // Group by Day
            $transactionData = $rawTransactions->groupBy(function($val) {
                return Carbon::parse($val->created_at)->format('Y-m-d');
            });

            for ($i = $days - 1; $i >= 0; $i--) {
                $dayDate = ($useCustomRange ? $endDate->copy() : now())->subDays($i);
                $key = $dayDate->format('Y-m-d');
                $label = $dayDate->format('M d');
                $dayTxns = $transactionData[$key] ?? collect();
                $transactionGraph[] = [
                    'date' => $label,
                    'revenue' => $dayTxns->sum('total_amount'),
                    'tickets_sold' => $dayTxns->sum(fn($tx) => $ticketCountByTxn[$tx->id] ?? 0),
                ];
            }
        }

        // ── CHARTS: EVENT PERFORMANCE (revenue + tickets per event) ──
        $eventPerformance = $events->map(function($e) use ($allTransactions, $ticketCountByTxn) {
            $eventTxns = $allTransactions->where('event_id', $e->id);
            return [
                'name' => $e->title,
                'revenue' => $eventTxns->sum('total_amount'),
                'tickets_sold' => $eventTxns->sum(fn($tx) => $ticketCountByTxn[$tx->id] ?? 0),
            ];
        })->sortByDesc('revenue')->values()->take(10);

        // ── PER-EVENT DAILY BREAKDOWN ──
        // Build per-event chart data: each event gets a daily/monthly breakdown
        $perEventCharts = [];
        $scopedEvents = $filterEventId
            ? $events->where('id', $filterEventId)
            : $events->sortByDesc(fn($e) => $allTransactions->where('event_id', $e->id)->sum('total_amount'))->take(5);

        foreach ($scopedEvents as $event) {
            $eventTxns = $rawTransactions->where('event_id', $event->id);

            $chartData = [];
            if ((!$useCustomRange && $period === '1year') || ($useCustomRange && $days > 90)) {
                // Monthly
                $grouped = $eventTxns->groupBy(fn($val) => Carbon::parse($val->created_at)->format('Y-m'));
                $months = $useCustomRange ? $startDate->diffInMonths($endDate) + 1 : 12;
                for ($i = $months - 1; $i >= 0; $i--) {
                    $monthDate = ($useCustomRange ? $endDate->copy() : now())->subMonths($i);
                    $key = $monthDate->format('Y-m');
                    $label = $monthDate->format('M Y');
                    $mTxns = $grouped[$key] ?? collect();
                    $chartData[] = [
                        'date' => $label,
                        'revenue' => $mTxns->sum('total_amount'),
                        'tickets_sold' => $mTxns->sum(fn($tx) => $ticketCountByTxn[$tx->id] ?? 0),
                    ];
                }
            } else {
                // Daily
                $grouped = $eventTxns->groupBy(fn($val) => Carbon::parse($val->created_at)->format('Y-m-d'));
                for ($i = $days - 1; $i >= 0; $i--) {
                    $dayDate = ($useCustomRange ? $endDate->copy() : now())->subDays($i);
                    $key = $dayDate->format('Y-m-d');
                    $label = $dayDate->format('M d');
                    $dTxns = $grouped[$key] ?? collect();
                    $chartData[] = [
                        'date' => $label,
                        'revenue' => $dTxns->sum('total_amount'),
                        'tickets_sold' => $dTxns->sum(fn($tx) => $ticketCountByTxn[$tx->id] ?? 0),
                    ];
                }
            }

            $perEventCharts[] = [
                'event_id' => $event->id,
                'event_name' => $event->title,
                'total_revenue' => $eventTxns->sum('total_amount'),
                'total_tickets' => $eventTxns->sum(fn($tx) => $ticketCountByTxn[$tx->id] ?? 0),
                'chart' => $chartData,
            ];
        }

        // ── RECENT TRANSACTIONS ──
        $recentTransactions = Transaction::with(['event', 'user'])
            ->whereIn('event_id', $scopedEventIds)
            ->orderByDesc('created_at')
            ->take(8)
            ->get()
            ->map(function($tx) {
                return [
                    'id' => $tx->id,
                    'buyer_name' => $tx->user->name ?? 'Guest',
                    'event_name' => $tx->event->title ?? 'N/A',
                    'total_amount' => $tx->total_amount,
                    'payment_method' => $tx->payment?->payment_method ?: ($tx->payment?->doku_channel ?: 'Bank Transfer'),
                    'payment_status' => $tx->transaction_status,
                    'date' => $tx->created_at->format('d M, H:i'),
                ];
            });

        // ── EVENT LIST for dropdown filter ──
        $eventList = $events->map(fn($e) => ['id' => $e->id, 'title' => $e->title])->values();

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
                'perEventCharts' => $perEventCharts,
            ],
            'recentTransactions' => $recentTransactions,
            'period' => $period,
            'dateFrom' => $dateFrom,
            'dateTo' => $dateTo,
            'filterEventId' => $filterEventId,
            'eventList' => $eventList,
        ]);
    }


    /**
     * List organizer's own events with filters and pagination.
     */
    public function index(Request $request) {
        $organizer = $this->organizer();

        $query = Event::with(['category', 'ticketTypes'])
            ->where('organizer_id', $organizer->id)
            ->where('status', '!=', 'Deactivated');

        // Status filter (from tabs or advanced filter)
        if ($request->filled('status') && $request->status !== 'All') {
            $query->where('status', $request->status);
        }

        // Category filter
        if ($request->filled('category_id')) {
            $query->where('event_category_id', $request->category_id);
        }

        // Search filter
        if ($request->filled('search')) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        // Date range
        if ($request->filled('date_from')) {
            $query->whereDate('event_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('event_date', '<=', $request->date_to);
        }

        // Dynamic Sorting
        $sortMap = [
            'name'     => 'title',
            'category' => 'event_category_id',
            'date'     => 'event_date',
            'status'   => 'status',
        ];
        $sortCol = $sortMap[$request->input('sort')] ?? 'created_at';
        $sortDir = $request->input('direction', 'desc') === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sortCol, $sortDir);

        $events = $query
            ->paginate($request->input('per_page', 10))
            ->through(fn ($e) => [
                'id' => $e->id,
                'name' => $e->title,
                'category' => $e->category->name ?? '—',
                'date' => $e->event_date ? Carbon::parse($e->event_date)->format('M d, Y') : '—',
                'tickets' => $e->ticketTypes->count() > 0
                    ? ($e->ticketTypes->sum('quota') - $e->ticketTypes->sum('available_stock')).' / '.$e->ticketTypes->sum('quota')
                    : '0 / '.$e->total_quota,
                'status' => $e->status ?? 'Active',
            ]);

        return Inertia::render('Organizer/Events/Index', [
            'events' => $events,
            'categories' => EventCategory::all(['id', 'name']),
            'filters' => $request->only(['status', 'search', 'per_page', 'sort', 'direction', 'date_from', 'date_to', 'category_id']),
        ]);
    }

    /**
     * Show event creation form for organizer.
     */
    public function create()
    {
        $this->organizer();

        return Inertia::render('Organizer/Events/Create', [
            'categories' => EventCategory::all(),
        ]);
    }

    /**
     * Store a new event for the organizer.
     */
    public function store(Request $request)
    {
        $organizer = $this->organizer();

        $data = $request->validate([
            'title' => 'required|string|max:45',
            'description' => 'required|string|max:200',
            'banner_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'event_date' => 'required|date',
            'total_quota' => 'required|integer',
            'start_time' => 'required|date',
            'end_time' => 'required|date',
            'location' => 'required|string|max:45',
            'format' => 'required|in:Online,Offline',
            'event_category_id' => 'required|exists:event_category,id',
            'ticket_types' => 'nullable|array',
            'ticket_types.*.name' => 'required_with:ticket_types|string|max:50',
            'ticket_types.*.price' => 'required_with:ticket_types|numeric|min:0',
            'ticket_types.*.quota' => 'required_with:ticket_types|integer|min:1',
        ]);

        if ($request->hasFile('banner_image')) {
            $path = $request->file('banner_image')->store('banners', 'public');
            $data['banner_image'] = '/storage/'.$path;
        } else {
            $data['banner_image'] = '/images/default-event.jpg';
        }

        $data['organizer_id'] = $organizer->id;
        $data['status'] = 'Active';

        $ticketTypesData = $data['ticket_types'] ?? [];
        unset($data['ticket_types']);

        $event = Event::create($data);

        // Create ticket types
        foreach ($ticketTypesData as $tt) {
            $event->ticketTypes()->create([
                'name' => $tt['name'],
                'price' => $tt['price'],
                'quota' => $tt['quota'],
                'available_stock' => $tt['quota'],
            ]);
        }

        return redirect()->route('organizer.events.index')->with('success', 'Event created successfully.');
    }

    /**
     * Show event details for organizer (uses shared Admin/Events/Show page).
     */
    public function show(string $id)
    {
        $organizer = $this->organizer();
        $event = Event::with(['category', 'organizer', 'ticketTypes', 'promotions'])->findOrFail($id);

        if ($event->organizer_id !== $organizer->id) {
            abort(403, 'You are not authorized to view this event.');
        }

        // --- Calculate Stats ---
        $transactions = Transaction::where('event_id', $event->id)
            ->where('transaction_status', 'Success')
            ->get();

        $stats = [
            'revenue' => $transactions->sum('total_amount'),
            'sold' => $transactions->count(),
            'quota' => $event->ticketTypes->sum('quota'),
            'checkedIn' => Ticket::whereHas('detail.transaction', function($q) use ($event) {
                $q->where('event_id', $event->id);
            })->where('ticket_status', 'Checked-In')->count(),
        ];

        // --- Ticket Breakdown ---
        $ticketBreakdown = $event->ticketTypes->map(function ($tt) {
            $sold = Ticket::where('ticket_type_id', $tt->id)
                ->whereHas('detail.transaction', function($q) {
                    $q->where('transaction_status', 'Success');
                })->count();
            return [
                'name' => $tt->name,
                'sold' => $sold,
                'quota' => $tt->quota,
            ];
        });

        // --- Attendees ---
        $attendees = Ticket::with(['detail.transaction.user', 'ticketType'])
            ->whereHas('detail.transaction', function($q) use ($event) {
                $q->where('event_id', $event->id);
            })
            ->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'name' => $t->detail->transaction->user->name ?? 'Guest',
                'email' => $t->detail->transaction->user->email ?? '-',
                'ticket_type' => $t->ticketType->name,
                'status' => $t->ticket_status,
                'qr_code' => $t->qr_code,
                'validated_at' => $t->validated_at,
            ]);

        // --- Recent Transactions ---
        $recentTransactions = Transaction::with(['user', 'payment'])
            ->where('event_id', $event->id)
            ->orderByDesc('created_at')
            ->take(5)
            ->get()
            ->map(fn($tx) => [
                'id' => $tx->id,
                'buyer_name' => $tx->user->name ?? 'Guest',
                'amount' => $tx->total_amount,
                'status' => $tx->transaction_status,
                'payment_method' => $tx->payment?->payment_method ?: ($tx->payment?->doku_channel ?: 'Bank Transfer'),
                'date' => $tx->created_at->format('d M, H:i'),
            ]);

        return Inertia::render('Organizer/Events/Show', [
            'event' => $event,
            'stats' => $stats,
            'ticketBreakdown' => $ticketBreakdown,
            'attendees' => $attendees,
            'recentTransactions' => $recentTransactions,
        ]);
    }

    /**
     * Show event edit form for organizer.
     */
    public function edit(string $id)
    {
        $organizer = $this->organizer();
        $event = Event::with('ticketTypes')->findOrFail($id);

        if ($event->organizer_id !== $organizer->id) {
            abort(403, 'You are not authorized to edit this event.');
        }

        return Inertia::render('Organizer/Events/Edit', [
            'event' => $event,
            'categories' => EventCategory::all(),
            'existingTicketTypes' => $event->ticketTypes,
        ]);
    }

    /**
     * Update an event owned by this organizer.
     */
    public function update(Request $request, string $id)
    {
        $organizer = $this->organizer();
        $event = Event::findOrFail($id);

        if ($event->organizer_id !== $organizer->id) {
            abort(403, 'You are not authorized to edit this event.');
        }

        $data = $request->validate([
            'title' => 'string|max:45',
            'description' => 'string|max:200',
            'event_date' => 'date',
            'total_quota' => 'integer',
            'start_time' => 'date',
            'end_time' => 'date',
            'location' => 'string|max:45',
            'format' => 'in:Online,Offline',
            'event_category_id' => 'exists:event_category,id',
            'ticket_types' => 'nullable|array',
            'ticket_types.*.id' => 'nullable|string',
            'ticket_types.*.name' => 'required_with:ticket_types|string|max:50',
            'ticket_types.*.price' => 'required_with:ticket_types|numeric|min:0',
            'ticket_types.*.quota' => 'required_with:ticket_types|integer|min:1',
        ]);

        if ($request->hasFile('banner_image')) {
            $request->validate(['banner_image' => 'image|mimes:jpeg,png,jpg|max:2048']);
            $path = $request->file('banner_image')->store('banners', 'public');
            $data['banner_image'] = '/storage/'.$path;
        }

        $ticketTypesData = $data['ticket_types'] ?? null;
        unset($data['ticket_types']);

        \DB::transaction(function () use ($event, $data, $ticketTypesData) {
            $event->update($data);

            if ($ticketTypesData !== null) {
                $existingIds = $event->ticketTypes()->pluck('id')->toArray();
                $incomingIds = array_filter(array_column($ticketTypesData, 'id'));

                $toDelete = array_diff($existingIds, $incomingIds);
                foreach ($toDelete as $idToDelete) {
                    $hasTickets = \DB::table('tickets')->where('ticket_type_id', $idToDelete)->exists();
                    if (!$hasTickets) {
                        TicketType::where('id', $idToDelete)->delete();
                    } else {
                        \Log::warning("Cannot delete ticket type $idToDelete as it has active tickets.");
                    }
                }

                foreach ($ticketTypesData as $tt) {
                    if (! empty($tt['id'])) {
                        $ticketType = TicketType::findOrFail($tt['id']);
                        $oldQuota = $ticketType->quota;
                        $newQuota = $tt['quota'];
                        $diff = $newQuota - $oldQuota;

                        $ticketType->update([
                            'name' => $tt['name'],
                            'price' => $tt['price'],
                            'quota' => $newQuota,
                            'available_stock' => max(0, $ticketType->available_stock + $diff),
                        ]);
                    } else {
                        $event->ticketTypes()->create([
                            'name' => $tt['name'],
                            'price' => $tt['price'],
                            'quota' => $tt['quota'],
                            'available_stock' => $tt['quota'],
                        ]);
                    }
                }
            }
        });

        return redirect()->route('organizer.events.show', $id)->with('success', 'Event updated successfully.');
    }

    /**
     * Update event status (Organizer can Complete or Cancel their own events).
     */
    public function updateStatus(Request $request, string $id)
    {
        $organizer = $this->organizer();
        $event = Event::findOrFail($id);

        if ($event->organizer_id !== $organizer->id) {
            abort(403, 'You are not authorized to update this event status.');
        }

        $request->validate([
            'status' => 'required|in:Active,Completed,Cancelled',
        ]);

        // Organizers cannot Deactivate -- only Admin/Root can
        if ($request->status === 'Deactivated') {
            return back()->with('error', 'Only administrators can deactivate events.');
        }

        $event->update(['status' => $request->status]);

        return back()->with('success', "Event status updated to {$request->status}.");
    }

    public function transactions(Request $request)
    {
        $user = auth()->user();
        $organizerId = $user->organizer->id;
        $eventIds = Event::where('organizer_id', $organizerId)->pluck('id');

        $query = Transaction::with(['event', 'user', 'payment'])
            ->whereIn('event_id', $eventIds);

        // Filters
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('id', 'like', "%$search%")
                  ->orWhereHas('user', function($qu) use ($search) {
                      $qu->where('name', 'like', "%$search%");
                  })
                  ->orWhereHas('event', function($qe) use ($search) {
                      $qe->where('title', 'like', "%$search%");
                  });
            });
        }

        if ($request->filled('status') && $request->status !== 'All') {
            $query->where('transaction_status', $request->status);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Dynamic Sorting
        $sortMap = [
            'id'             => 'id',
            'buyer'          => 'user_id', // Simplified, could be a join
            'amount'         => 'total_amount',
            'date'           => 'created_at',
            'status'         => 'transaction_status',
        ];
        $sortCol = $sortMap[$request->input('sort')] ?? 'created_at';
        $sortDir = $request->input('direction', 'desc') === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sortCol, $sortDir);

        $transactions = $query->paginate($request->input('per_page', 10))
            ->through(function($tx) {
                return [
                    'id' => $tx->id,
                    'buyer_name' => $tx->user->name ?? 'Guest',
                    'buyer_email' => $tx->user->email ?? 'N/A',
                    'event_name' => $tx->event->title ?? 'N/A',
                    'total_amount' => $tx->total_amount,
                    'payment_status' => $tx->transaction_status,
                    'payment_method' => $tx->payment?->payment_method ?: ($tx->payment?->doku_channel ?: 'Bank Transfer'),
                    'date' => $tx->created_at,
                ];
            });

        return Inertia::render('Organizer/Transactions/Index', [
            'transactions' => $transactions,
            'filters' => $request->only(['search', 'status', 'per_page', 'sort', 'direction', 'date_from', 'date_to'])
        ]);
    }

    public function exportSales()
    {
        $organizerId = auth()->user()->organizer?->id;
        return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\OrganizerSalesExport($organizerId), 'transaction-report.xlsx');
    }
}
