<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Transaction;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // ── KPI Statistics ──────────────────────────────────────
        $totalUsers   = User::count();
        $activeEvents = Event::where('status', 'Active')->count();
        $ticketSales  = Transaction::where('transaction_status', 'Success')->sum('total_amount');
        $platformFee  = $ticketSales * 0.20; // 20% platform fee

        // ── Recent Activity (latest 6 system events) ───────────
        $recentActivities = collect();

        // New users (last 7 days)
        $newUsers = User::where('created_at', '>=', now()->subDays(7))
            ->orderByDesc('created_at')
            ->limit(3)
            ->get()
            ->map(fn($u) => [
                'id'      => $u->id,
                'action'  => 'New user registered',
                'subject' => $u->name,
                'time'    => $u->created_at->diffForHumans(),
                'color'   => 'bg-emerald-500',
            ]);
        $recentActivities = $recentActivities->merge($newUsers);

        // Recent events (last 7 days)
        $newEvents = Event::where('created_at', '>=', now()->subDays(7))
            ->orderByDesc('created_at')
            ->limit(3)
            ->get()
            ->map(fn($e) => [
                'id'      => $e->id,
                'action'  => 'Event created',
                'subject' => $e->title,
                'time'    => $e->created_at->diffForHumans(),
                'color'   => 'bg-primary-500',
            ]);
        $recentActivities = $recentActivities->merge($newEvents);

        // Recent transactions (last 7 days)
        $recentTxns = Transaction::with('user', 'event')
            ->where('created_at', '>=', now()->subDays(7))
            ->orderByDesc('created_at')
            ->limit(3)
            ->get()
            ->map(fn($t) => [
                'id'      => $t->id,
                'action'  => 'Ticket purchased',
                'subject' => ($t->event->title ?? 'Unknown') . ' — ' . ($t->user->name ?? 'Unknown'),
                'time'    => $t->created_at->diffForHumans(),
                'color'   => 'bg-amber-500',
            ]);
        $recentActivities = $recentActivities->merge($recentTxns);

        $recentActivities = $recentActivities
            ->sortByDesc(fn($item) => $item['time'])
            ->take(6)
            ->values();

        // ── Upcoming Events ─────────────────────────────────────
        $upcomingEvents = Event::with('ticketTypes')
            ->where('event_date', '>=', now())
            ->orderBy('event_date')
            ->limit(5)
            ->get()
            ->map(fn($e) => [
                'id'      => $e->id,
                'name'    => $e->title,
                'date'    => $e->event_date ? \Carbon\Carbon::parse($e->event_date)->format('M d, Y') : '—',
                'tickets' => $e->ticketTypes->sum('quota') > 0
                    ? ($e->ticketTypes->sum('quota') - $e->ticketTypes->sum('available_stock')) . ' / ' . $e->ticketTypes->sum('quota')
                    : '0 / ' . $e->total_quota,
                'status'  => $e->status ?? 'Active',
            ]);

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                ['title' => 'Total Users',      'value' => number_format($totalUsers)],
                ['title' => 'Active Events',    'value' => number_format($activeEvents)],
                ['title' => 'Ticket Sales',     'value' => 'Rp' . number_format($ticketSales, 0, ',', '.')],
                ['title' => 'Platform Revenue', 'value' => 'Rp' . number_format($platformFee, 0, ',', '.')],
            ],
            'recentActivities' => $recentActivities,
            'upcomingEvents'   => $upcomingEvents,
        ]);
    }
}
