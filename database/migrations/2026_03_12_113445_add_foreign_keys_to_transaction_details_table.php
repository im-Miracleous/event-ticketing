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
        Schema::table('transaction_details', function (Blueprint $table) {
            $table->foreign(['ticket_type_id'], 'fk_details_ticketstypes')->references(['id'])->on('tickets_types')->onUpdate('cascade')->onDelete('restrict');
            $table->foreign(['transaction_id'], 'fk_details_trx')->references(['id'])->on('transactions')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transaction_details', function (Blueprint $table) {
            $table->dropForeign('fk_details_ticketstypes');
            $table->dropForeign('fk_details_trx');
        });
    }
};
