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
        Schema::table('tickets', function (Blueprint $table) {
            $table->foreign(['transaction_detail_id'], 'fk_tickets_details')->references(['id'])->on('transaction_details')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign(['ticket_type_id'], 'fk_tickets_types')->references(['id'])->on('tickets_types')->onUpdate('cascade')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropForeign('fk_tickets_details');
            $table->dropForeign('fk_tickets_types');
        });
    }
};
