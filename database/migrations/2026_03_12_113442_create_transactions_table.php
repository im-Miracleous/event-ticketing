<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->string('id', 50)->primary();
            $table->decimal('total_amount', 10);
            $table->enum('transaction_status', ['Pending', 'Success', 'Failed']);
            $table->char('user_id', 36)->index('fk_trx_users_idx');
            $table->unsignedBigInteger('payment_id')->index('fk_trx_payments_idx');
            $table->char('event_id', 36)->index('fk_trx_events_idx');
            $table->unsignedBigInteger('promotion_id')->nullable()->index('fk_trx_promotions_idx');
            $table->timestamp('transaction_date')->nullable();
            $table->timestamp('created_at')->nullable()->useCurrent();
            $table->timestamp('updated_at')->useCurrentOnUpdate()->nullable()->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
