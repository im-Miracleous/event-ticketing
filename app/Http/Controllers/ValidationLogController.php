<?php

namespace App\Http\Controllers;

use App\Models\ValidationLog;
use App\Models\Event;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ValidationLogController extends Controller
{
    public function index(Request $request)
    {
        $organizerId = Auth::user()->organizer?->id;
        $eventIds = Event::where('organizer_id', $organizerId)->pluck('id');

        // Recent scan history (last 15 logs)
        $history = ValidationLog::with(['ticket.detail.event', 'ticket.detail.ticketType'])
            ->whereIn('ticket_id', Ticket::whereHas('detail', function($q) use ($eventIds) {
                $q->whereIn('event_id', $eventIds);
            })->pluck('id'))
            ->orderByDesc('created_at')
            ->take(15)
            ->get()
            ->map(function($log) {
                return [
                    'id' => $log->id,
                    'ticket_id' => $log->ticket->id,
                    'event_name' => $log->ticket->detail->event->title ?? 'N/A',
                    'ticket_type' => $log->ticket->detail->ticketType->name ?? 'N/A',
                    'result' => $log->result,
                    'time' => $log->created_at->format('H:i:s'),
                ];
            });

        // Current overall check-in status
        $stats = [
            'total_sold' => Ticket::whereHas('detail', function($q) use ($eventIds) {
                $q->whereIn('event_id', $eventIds);
            })->count(),
            'checked_in' => Ticket::whereHas('detail', function($q) use ($eventIds) {
                $q->whereIn('event_id', $eventIds);
            })->where('status', 'Used')->count(),
        ];

        return Inertia::render('Organizer/CheckIn', [
            'history' => $history,
            'stats' => $stats
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        $organizerId = Auth::user()->organizer?->id;
        
        // Find ticket by QR code or ID and ensure it belongs to the organizer
        $ticket = Ticket::with(['detail.event', 'detail.ticketType'])
            ->where(function($q) use ($request) {
                $q->where('id', $request->code)->orWhere('qr_code', $request->code);
            })
            ->whereHas('detail.event', function($q) use ($organizerId) {
                $q->where('organizer_id', $organizerId);
            })
            ->first();

        if (!$ticket) {
            return redirect()->back()->with('error', 'Tiket tidak ditemukan atau bukan milik event Anda.');
        }

        if ($ticket->status === 'Used') {
            ValidationLog::create([
                'ticket_id' => $ticket->id,
                'result' => 'Already Used',
                'device_info' => $request->userAgent()
            ]);
            return redirect()->back()->with('error', 'Tiket sudah pernah digunakan (Check-in Gagal).');
        }

        // Mark as Used
        $ticket->update([
            'status' => 'Used',
            'validated_at' => now(),
        ]);

        ValidationLog::create([
            'ticket_id' => $ticket->id,
            'result' => 'Success',
            'device_info' => $request->userAgent()
        ]);

        return redirect()->back()->with('success', 'Check-in BERHASIL! Selamat menikmati acara.');
    }
}
