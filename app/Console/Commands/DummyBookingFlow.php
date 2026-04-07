<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use App\Models\Event;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\Ticket;
use App\Models\TicketType;
use App\Models\Attendee;
use App\Mail\BookingPendingMail;
use App\Mail\ETicketMail;
use Carbon\Carbon;

class DummyBookingFlow extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:dummy-booking-flow';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Simulate a complete ticket booking flow with email notifications.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = '2472039@maranatha.ac.id';

        $this->info("Siapkan data dummy...");

        // Fake Data using Models without saving to DB
        $event = new Event([
            'title' => 'Dummy Event: Music of the Spheres',
            'start_time' => Carbon::now()->addDays(7)->format('Y-m-d H:i:s'),
            'location' => 'Stadion Gelora Bandung Lautan Api'
        ]);

        $ticketType = new TicketType([
            'name' => 'VIP DUMMY'
        ]);

        $transaction = new Transaction([
            'id' => 'TRX-DUMMY-' . rand(1000, 9999),
            'total_amount' => 1500000,
            'status' => 'pending',
            'expires_at' => Carbon::now()->addHours(2)->format('Y-m-d H:i:s')
        ]);
        $transaction->setRelation('event', $event);

        $attendee = new Attendee([
            'name' => 'Dimas Dummy Participant'
        ]);

        $ticket = new Ticket([
            'id' => 'TIX-DUMMY-' . rand(10000, 99999),
            'qr_code' => 'DUMMY-QR-' . uniqid()
        ]);
        $ticket->setRelation('attendee', $attendee);

        $detail = new TransactionDetail([
            'quantity' => 1,
            'subtotal' => 1500000
        ]);
        $detail->setRelation('ticketType', $ticketType);
        $detail->setRelation('tickets', collect([$ticket]));

        $transaction->setRelation('details', collect([$detail]));

        // FORCE mail to sync for this command execution
        config(['mail.default' => 'smtp']); // Pastikan mengirim email beneran
        
        $this->info("1. Mengirim tagihan (pending) ke $email...");
        try {
            Mail::to($email)->send(new BookingPendingMail($transaction));
            $this->info("✅ Email tagihan berhasil terkirim.");
        } catch (\Exception $e) {
            $this->error("❌ Gagal mengirim email tagihan: " . $e->getMessage());
        }

        $this->info("⏳ 2. Simulasi pembayaran (jeda 3 detik)...");
        sleep(3);
        $transaction->status = 'success';
        
        $this->info("3. Mengirim E-Ticket (QR Code) ke $email...");
        try {
            Mail::to($email)->send(new ETicketMail($transaction));
            $this->info("✅ Email E-Ticket berhasil terkirim.");
        } catch (\Exception $e) {
            $this->error("❌ Gagal mengirim email E-ticket: " . $e->getMessage());
        }

        $this->info("🎉 Flow pemesanan dummy berhasil dieksekusi!");
    }
}
