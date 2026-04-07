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
            return redirect()->route('dashboard')->with('error', 'Akun Anda belum terdaftar sebagai Organizer.');
        }

        $organizerId = $user->organizer->id;
        $period = $request->input('period', 'monthly');

        // ── STATS ──
        $events = Event::where('organizer_id', $organizerId)->get();
        $eventIds = $events->pluck('id');

        $totalActiveEvents = $events->where('status', 'Active')->count();
        
        $allTransactions = Transaction::whereIn('event_id', $eventIds)
            ->where('transaction_status', 'Success')
            ->get();
            
        $totalRevenue = $allTransactions->sum('total_amount');
        $totalTicketsSold = $allTransactions->count();

        $totalTickets = TicketType::whereIn('event_id', $eventIds)->sum('quota');
        $checkedIn = Ticket::whereHas('detail.transaction', function($q) use ($eventIds) {
            $q->whereIn('event_id', $eventIds);
        })->where('ticket_status', 'Used')->count();

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
            ->select('tickets_types.name', DB::raw('SUM(tickets_types.quota - tickets_types.available_stock) as sold'))
            ->groupBy('tickets_types.name')
            ->orderByDesc('sold')
            ->take(5)
            ->get();

        // ── CHARTS: TRANSACTION GRAPH ──
        $days = $period === 'daily' ? 7 : ($period === 'weekly' ? 28 : 90);
        $transactionData = Transaction::whereIn('event_id', $eventIds)
            ->where('transaction_status', 'Success')
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
                    'payment_status' => $tx->transaction_status,
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


    /**
     * List organizer's own events with filters and pagination.
     */
    public function index(Request $request) {
        $organizer = $this->organizer();

        $query = Event::with(['category', 'ticketTypes'])
            ->where('organizer_id', $organizer->id)
            ->where('status', '!=', 'Deactivated');

        // Status filter
        if ($request->filled('status') && $request->status !== 'All') {
            $query->where('status', $request->status);
        }

        // Search filter
        if ($request->filled('search')) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        $query->orderBy('created_at', 'desc');

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
            'filters' => $request->only(['status', 'search', 'per_page']),
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

        // Organizer can only view their own events
        if ($event->organizer_id !== $organizer->id) {
            abort(403, 'You are not authorized to view this event.');
        }

        return Inertia::render('Admin/Events/Show', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'description' => $event->description,
                'banner_image' => $event->banner_image,
                'event_date' => $event->event_date,
                'start_time' => $event->start_time,
                'end_time' => $event->end_time,
                'location' => $event->location,
                'format' => $event->format,
                'total_quota' => $event->total_quota,
                'status' => $event->status,
                'created_at' => $event->created_at,
                'category' => $event->category,
                'organizer' => $event->organizer,
                'organizer_id' => $event->organizer_id,
                'ticket_types' => $event->ticketTypes->map(fn ($tt) => [
                    'id' => $tt->id,
                    'name' => $tt->name,
                    'price' => $tt->price,
                    'quota' => $tt->quota,
                    'available_stock' => $tt->available_stock,
                    'description' => $tt->description,
                ]),
                'promotions' => $event->promotions->map(fn ($p) => [
                    'id' => $p->id,
                    'code' => $p->code,
                    'discount' => $p->discount_amount,
                    'type' => $p->discount_amount >= 100 ? 'fixed' : 'percentage',
                    'valid_until' => $p->end_date,
                    'status' => Carbon::parse($p->end_date)->isPast() ? 'Expired' : 'Active',
                ]),
            ],
            'canEdit' => true,
            'isRoot' => false,
            'isOrganizer' => true,
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

        $event->update($data);

        // Sync ticket types if provided
        if ($ticketTypesData !== null) {
            $existingIds = $event->ticketTypes()->pluck('id')->toArray();
            $incomingIds = array_filter(array_column($ticketTypesData, 'id'));

            // Delete removed ticket types
            $toDelete = array_diff($existingIds, $incomingIds);
            TicketType::whereIn('id', $toDelete)->delete();

            foreach ($ticketTypesData as $tt) {
                if (! empty($tt['id'])) {
                    TicketType::where('id', $tt['id'])->update([
                        'name' => $tt['name'],
                        'price' => $tt['price'],
                        'quota' => $tt['quota'],
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
                    'payment_status' => $tx->transaction_status,
                    'payment_method' => $tx->payment_method,
                    'date' => $tx->created_at->format('d M Y, H:i'),
                ];
            });

        return Inertia::render('Organizer/Transactions/Index', [
            'transactions' => $transactions
        ]);
    }

    public function exportSales()
    {
        $organizerId = auth()->user()->organizer?->id;
        return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\OrganizerSalesExport($organizerId), 'laporan-penjualan.xlsx');
    }
}
