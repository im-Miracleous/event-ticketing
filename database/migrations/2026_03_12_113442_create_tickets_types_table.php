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
        Schema::create('tickets_types', function (Blueprint $table) {
            $table->id();
            $table->string('name', 45);
            $table->decimal('price', 10);
            $table->integer('quota');
            $table->integer('available_stock');
            $table->unsignedBigInteger('event_id')->index('fk_tickets_types_events_idx');
            $table->timestamp('created_at')->nullable()->useCurrent();
            $table->timestamp('updated_at')->useCurrentOnUpdate()->nullable()->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets_types');
    }
};
