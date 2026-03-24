<?php
namespace App\Http\Controllers;
use App\Models\ValidationLog;
use Illuminate\Http\Request;

use App\Models\Ticket;
use Inertia\Inertia;

class ValidationLogController extends Controller {
    public function index() {
        return Inertia::render('Organizer/CheckIn');
    }

    public function store(Request $request) {
        $request->validate([
            'code' => 'required|string'
        ]);

        $ticket = Ticket::where('id', $request->code)->orWhere('qr_code', $request->code)->first();

        if (!$ticket) {
            return redirect()->back()->withErrors(['code' => 'Tiket tidak ditemukan / Invalid.']);
        }

        if ($ticket->ticket_status === 'Used') {
            ValidationLog::create([
                'validation_time' => now(),
                'result' => 'Already Used',
                'ticket_id' => $ticket->id
            ]);
            return redirect()->back()->withErrors(['code' => 'Tiket sudah digunakan sebelumnya.']);
        }

        if ($ticket->ticket_status !== 'Active') {
            ValidationLog::create([
                'validation_time' => now(),
                'result' => 'Invalid',
                'ticket_id' => $ticket->id
            ]);
            return redirect()->back()->withErrors(['code' => 'Status tiket tidak valid: ' . $ticket->ticket_status]);
        }

        // Valid
        $ticket->ticket_status = 'Used';
        $ticket->validated_at = now();
        $ticket->save();

        ValidationLog::create([
            'validation_time' => now(),
            'result' => 'Valid',
            'ticket_id' => $ticket->id
        ]);

        return redirect()->back()->with('success', 'Tiket Valid! Check-in berhasil untuk kode: ' . $request->code);
    }
}
