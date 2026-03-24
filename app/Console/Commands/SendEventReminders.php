<?php

namespace App\Console\Commands;

use App\Models\Event;
use App\Models\Transaction;
use App\Mail\EventReminderMail;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class SendEventReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reminders:send-event';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send H-1 reminder emails to event attendees';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $tomorrow = Carbon::tomorrow();

        $events = Event::whereDate('start_time', $tomorrow)->get();
        if ($events->isEmpty()) {
            $this->info('No events found for tomorrow.');
            return;
        }

        $sentCount = 0;

        foreach ($events as $event) {
            $transactions = Transaction::where('event_id', $event->id)
                ->where('transaction_status', 'Success')
                ->with('user')
                ->get();

            // Pluck all unique users from these transactions
            $users = $transactions->pluck('user')->unique('id');

            foreach ($users as $user) {
                if ($user && $user->email) {
                    Mail::to($user->email)->send(new EventReminderMail($event, $user));
                    $sentCount++;
                }
            }
        }

        $this->info("Successfully sent $sentCount reminder emails for " . $events->count() . " events.");
    }
}
