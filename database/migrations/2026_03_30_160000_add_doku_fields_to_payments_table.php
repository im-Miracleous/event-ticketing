<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->string('doku_invoice_number', 100)->nullable()->after('transaction_time');
            $table->string('doku_payment_url', 500)->nullable()->after('doku_invoice_number');
            $table->string('doku_va_number', 100)->nullable()->after('doku_payment_url');
            $table->string('doku_channel', 50)->nullable()->after('doku_va_number');
            $table->json('doku_raw_response')->nullable()->after('doku_channel');
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn([
                'doku_invoice_number',
                'doku_payment_url',
                'doku_va_number',
                'doku_channel',
                'doku_raw_response',
            ]);
        });
    }
};
