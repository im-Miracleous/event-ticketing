<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Disable FK checks to allow PK modification
        Schema::disableForeignKeyConstraints();

        Schema::table('wishlists', function (Blueprint $table) {
            $table->dropPrimary(['user_id', 'event_id']);
        });

        Schema::table('wishlists', function (Blueprint $table) {
            $table->bigIncrements('id')->first();
            $table->timestamps();
            $table->unique(['user_id', 'event_id']);
        });

        Schema::enableForeignKeyConstraints();
    }

    public function down(): void
    {
        Schema::disableForeignKeyConstraints();

        Schema::table('wishlists', function (Blueprint $table) {
            $table->dropUnique(['user_id', 'event_id']);
            $table->dropColumn(['id', 'created_at', 'updated_at']);
        });

        Schema::table('wishlists', function (Blueprint $table) {
            $table->primary(['user_id', 'event_id']);
        });

        Schema::enableForeignKeyConstraints();
    }
};
