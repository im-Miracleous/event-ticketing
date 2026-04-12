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
        // Correct relation chain: ticket -> detail (TransactionDetail) -> transaction -> event
        $ticketIds = Ticket::whereHas('detail.transaction', function ($q) use ($eventIds) {
            $q->whereIn('event_id', $eventIds);
        })->pluck('id');

        $history = ValidationLog::with(['ticket.detail.transaction.event', 'ticket.detail.ticketType'])
            ->whereIn('ticket_id', $ticketIds)
            ->orderByDesc('created_at')
            ->take(15)
            ->get()
            ->map(function ($log) {
                return [
                    'id'          => $log->id,
                    'ticket_id'   => $log->ticket->id ?? 'N/A',
                    'event_name'  => $log->ticket?->detail?->transaction?->event?->title ?? 'N/A',
                    'ticket_type' => $log->ticket?->detail?->ticketType?->name ?? 'N/A',
                    'result'      => $log->result,
                    'time'        => $log->created_at->format('H:i:s'),
                ];
            });

        // Current overall check-in status — use ticket_status (actual DB column name)
        $stats = [
            'total_sold' => Ticket::whereHas('detail.transaction', function ($q) use ($eventIds) {
                $q->whereIn('event_id', $eventIds);
            })->count(),
            'checked_in' => Ticket::whereHas('detail.transaction', function ($q) use ($eventIds) {
                $q->whereIn('event_id', $eventIds);
            })->where('ticket_status', 'Scanned')->count(),
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

        // Find ticket by QR code or ID
        // Relation chain: Ticket -> detail (TransactionDetail) -> transaction (Transaction) -> event (Event)
        $ticket = Ticket::with(['detail.transaction.event', 'detail.ticketType'])
            ->where(function ($q) use ($request) {
                $q->where('id', $request->code)->orWhere('qr_code', $request->code);
            })
            ->whereHas('detail.transaction.event', function ($q) use ($organizerId) {
                $q->where('organizer_id', $organizerId);
            })
            ->first();

        if (!$ticket) {
            // Cannot log with null ticket_id due to FK constraint — just return error
            return redirect()->back()->with('error', 'Tiket tidak ditemukan atau bukan milik event Anda.');
        }

        // DB column is ticket_status, enum values: Issued | Scanned | Cancelled | Expired
        if ($ticket->ticket_status === 'Scanned') {
            ValidationLog::create([
                'ticket_id'       => $ticket->id,
                'validation_time' => now(),
                'result'          => 'Already Scanned',
            ]);
            return redirect()->back()->with('error', 'Tiket sudah pernah digunakan (Check-in Gagal).');
        }

        if ($ticket->ticket_status === 'Cancelled' || $ticket->ticket_status === 'Expired') {
            ValidationLog::create([
                'ticket_id'       => $ticket->id,
                'validation_time' => now(),
                'result'          => 'Expired',
            ]);
            return redirect()->back()->with('error', 'Tiket ' . strtolower($ticket->ticket_status) . ' dan tidak dapat digunakan.');
        }

        // Mark as Scanned
        $ticket->update([
            'ticket_status' => 'Scanned',
            'validated_at'  => now(),
        ]);

        ValidationLog::create([
            'ticket_id'       => $ticket->id,
            'validation_time' => now(),
            'result'          => 'Valid',
        ]);

        return redirect()->back()->with('success', 'Check-in BERHASIL! Selamat menikmati acara.');
    }
}
