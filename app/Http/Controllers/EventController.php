<?php
namespace App\Http\Controllers;
use App\Models\Event;
use App\Models\EventCategory;
use App\Models\Organizer;
use App\Models\TicketType;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EventController extends Controller {

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
}
