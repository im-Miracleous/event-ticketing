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
        Schema::create('tickets', function (Blueprint $table) {
            $table->string('id', 50)->primary();
            $table->string('qr_code');
            $table->enum('ticket_status', ['Issued', 'Scanned', 'Cancelled', 'Expired']);
            $table->timestamp('issued_at');
            $table->timestamp('validated_at')->nullable();
            $table->unsignedBigInteger('transaction_detail_id')->index('fk_tickets_details_idx');
            $table->unsignedBigInteger('ticket_type_id')->index('fk_tickets_types_idx');
            $table->timestamp('created_at')->nullable()->useCurrent();
            $table->timestamp('updated_at')->useCurrentOnUpdate()->nullable()->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
