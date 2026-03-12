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
        Schema::table('transactions', function (Blueprint $table) {
            $table->foreign(['event_id'], 'fk_trx_events')->references(['id'])->on('events')->onUpdate('cascade')->onDelete('restrict');
            $table->foreign(['payment_id'], 'fk_trx_payments')->references(['id'])->on('payments')->onUpdate('cascade')->onDelete('restrict');
            $table->foreign(['promotion_id'], 'fk_trx_promotions')->references(['id'])->on('promotions')->onUpdate('cascade')->onDelete('set null');
            $table->foreign(['user_id'], 'fk_trx_users')->references(['id'])->on('users')->onUpdate('cascade')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign('fk_trx_events');
            $table->dropForeign('fk_trx_payments');
            $table->dropForeign('fk_trx_promotions');
            $table->dropForeign('fk_trx_users');
        });
    }
};
