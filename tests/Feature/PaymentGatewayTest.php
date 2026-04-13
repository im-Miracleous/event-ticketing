<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Event;
use App\Models\EventCategory;
use App\Models\Organizer;
use App\Models\TicketType;
use App\Models\Transaction;
use App\Models\Payment;
use App\Models\Ticket;
use App\Models\Attendee;
use App\Models\TransactionDetail;
use App\Services\DokuService;
use App\Mail\ETicketMail;
use App\Mail\BookingPendingMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Mockery\MockInterface;
use Tests\TestCase;

class PaymentGatewayTest extends TestCase
{
    private User $user;
    private Event $event;
    private TicketType $ticketType;

    protected function setUp(): void
    {
        parent::setUp();

        // Use global helper to create event
        $this->event = createEvent(['title' => 'Payment Test Event']);
        
        $this->ticketType = TicketType::create([
            'name' => 'Early Bird',
            'price' => 100000,
            'available_stock' => 50,
            'quota' => 50,
            'event_id' => $this->event->id,
        ]);
    }

    /**
     * Test initiating a checkout with DOKU enabled.
     */
    public function test_user_can_initiate_checkout_with_doku(): void
    {
        Mail::fake();

        config(['doku.client_id' => 'CLIENT_ID']);
        config(['doku.secret_key' => 'SECRET_KEY']);
        config(['doku.base_url' => 'https://api-sandbox.doku.com']);

        $this->mock(DokuService::class, function (MockInterface $mock) {
            $mock->shouldReceive('createVirtualAccount')
                ->once()
                ->andReturn([
                    'response' => [
                        'payment' => [
                            'url' => 'https://sandbox.doku.com/checkout/123',
                            'virtual_account_number' => '1234567890'
                        ]
                    ]
                ]);
        });

        $payload = [
            'event_id' => $this->event->id,
            'items' => [
                ['ticket_type_id' => $this->ticketType->id, 'quantity' => 2]
            ],
            'attendees' => [
                ['name' => 'Attendee 1', 'email' => 'a1@example.com'],
                ['name' => 'Attendee 2', 'email' => 'a2@example.com'],
            ],
        ];

        // Accessing acting user for database assertions
        $this->actingAsUser();
        $user = auth()->user();

        $response = $this->post('/checkout', $payload, ['X-Inertia' => 'true']);

        $response->assertStatus(409);
        $response->assertHeader('X-Inertia-Location', 'https://sandbox.doku.com/checkout/123');

        $this->assertDatabaseHas('transactions', [
            'user_id' => $user->id,
            'event_id' => $this->event->id,
            'transaction_status' => 'Pending',
        ]);

        $this->assertDatabaseHas('tickets_types', [
            'id' => $this->ticketType->id,
            'available_stock' => 48,
        ]);

        Mail::assertSent(BookingPendingMail::class);
    }

    /**
     * Test DOKU success notification updates transaction and activates tickets.
     */
    public function test_doku_webhook_success_updates_transaction_and_activates_tickets(): void
    {
        Mail::fake();

        $this->actingAsUser();
        $user = auth()->user();

        $invoiceNumber = 'TRX-' . strtoupper(Str::random(12));

        $payment = Payment::create([
            'payment_method' => 'Transfer',
            'payment_status' => 'Pending',
            'doku_invoice_number' => $invoiceNumber,
            'transaction_time' => now(),
        ]);

        $transaction = Transaction::create([
            'id' => $invoiceNumber,
            'total_amount' => 100000,
            'transaction_status' => 'Pending',
            'user_id' => $user->id,
            'payment_id' => $payment->id,
            'event_id' => $this->event->id,
            'expires_at' => now()->addHour(),
        ]);

        $detail = TransactionDetail::create([
            'subtotal' => 100000,
            'quantity' => 1,
            'transaction_id' => $transaction->id,
            'ticket_type_id' => $this->ticketType->id,
        ]);

        $ticket = Ticket::create([
            'id' => 'TKT-' . strtoupper(Str::random(12)),
            'qr_code' => Str::uuid()->toString(),
            'ticket_status' => 'Pending',
            'issued_at' => now(),
            'transaction_detail_id' => $detail->id,
            'ticket_type_id' => $this->ticketType->id,
        ]);

        $this->mock(DokuService::class, function (MockInterface $mock) {
            $mock->shouldReceive('verifyNotification')->once()->andReturn(true);
        });

        $payload = [
            'order' => ['invoice_number' => $invoiceNumber],
            'transaction' => ['status' => 'SUCCESS'],
        ];

        $response = $this->postJson('/doku/notification', $payload);

        $response->assertOk();
        $this->assertDatabaseHas('transactions', ['id' => $invoiceNumber, 'transaction_status' => 'Success']);
        $this->assertDatabaseHas('tickets', ['id' => $ticket->id, 'ticket_status' => 'Valid']);

        Mail::assertSent(ETicketMail::class);
    }

    /**
     * Test DOKU failure notification cancels transaction and restores stock.
     */
    public function test_doku_webhook_failure_cancels_transaction_and_restores_stock(): void
    {
        $this->actingAsUser();
        $user = auth()->user();

        $invoiceNumber = 'TRX-' . strtoupper(Str::random(12));

        $payment = Payment::create([
            'payment_method' => 'Transfer',
            'payment_status' => 'Pending',
            'doku_invoice_number' => $invoiceNumber,
            'transaction_time' => now(),
        ]);

        $transaction = Transaction::create([
            'id' => $invoiceNumber,
            'total_amount' => 100000,
            'transaction_status' => 'Pending',
            'user_id' => $user->id,
            'payment_id' => $payment->id,
            'event_id' => $this->event->id,
        ]);

        TransactionDetail::create([
            'subtotal' => 100000,
            'quantity' => 2,
            'transaction_id' => $transaction->id,
            'ticket_type_id' => $this->ticketType->id,
        ]);

        $this->ticketType->decrement('available_stock', 2);

        $this->mock(DokuService::class, function (MockInterface $mock) {
            $mock->shouldReceive('verifyNotification')->once()->andReturn(true);
        });

        $payload = [
            'order' => ['invoice_number' => $invoiceNumber],
            'transaction' => ['status' => 'FAILED'],
        ];

        $response = $this->postJson('/doku/notification', $payload);

        $response->assertOk();
        $this->assertDatabaseHas('transactions', ['id' => $invoiceNumber, 'transaction_status' => 'Failed']);
        $this->assertDatabaseHas('tickets_types', ['id' => $this->ticketType->id, 'available_stock' => 50]);
    }

    /**
     * Test manual payment confirmation.
     */
    public function test_user_can_manually_confirm_payment(): void
    {
        Mail::fake();

        $this->actingAsUser();
        $user = auth()->user();

        $payment = Payment::create([
            'payment_method' => 'Transfer',
            'payment_status' => 'Pending',
            'transaction_time' => now(),
        ]);

        $transactionId = 'TRX-' . strtoupper(Str::random(12));
        $transaction = Transaction::create([
            'id' => $transactionId,
            'total_amount' => 100000,
            'transaction_status' => 'Pending',
            'user_id' => $user->id,
            'payment_id' => $payment->id,
            'event_id' => $this->event->id,
            'expires_at' => now()->addHour(),
        ]);

        $detail = TransactionDetail::create([
            'subtotal' => 100000,
            'quantity' => 1,
            'transaction_id' => $transactionId,
            'ticket_type_id' => $this->ticketType->id,
        ]);

        $ticket = Ticket::create([
            'id' => 'TKT-' . strtoupper(Str::random(12)),
            'qr_code' => Str::uuid()->toString(),
            'ticket_status' => 'Pending',
            'issued_at' => now(),
            'transaction_detail_id' => $detail->id,
            'ticket_type_id' => $this->ticketType->id,
        ]);

        $response = $this->post("/checkout/{$transactionId}/confirm", [
            'payment_method' => 'E-Wallet',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('transactions', ['id' => $transactionId, 'transaction_status' => 'Success']);
        $this->assertDatabaseHas('tickets', ['id' => $ticket->id, 'ticket_status' => 'Valid']);

        Mail::assertSent(ETicketMail::class);
    }
}
