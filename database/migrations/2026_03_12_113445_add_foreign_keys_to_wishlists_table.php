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
        Schema::table('wishlists', function (Blueprint $table) {
            $table->foreign(['event_id'], 'fk_wishlist_events')->references(['id'])->on('events')->onUpdate('cascade')->onDelete('cascade');
            $table->foreign(['user_id'], 'fk_wishlist_users')->references(['id'])->on('users')->onUpdate('cascade')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('wishlists', function (Blueprint $table) {
            $table->dropForeign('fk_wishlist_events');
            $table->dropForeign('fk_wishlist_users');
        });
    }
};
