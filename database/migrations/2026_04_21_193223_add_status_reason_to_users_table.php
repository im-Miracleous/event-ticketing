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
        // 1. Add status_reason column to users table
        Schema::table('users', function (Blueprint $table) {
            $table->string('status_reason')->nullable()->after('status');
        });

        // 2. Make user_id nullable on transactions so we can detach banned/deleted users
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign('fk_trx_users');
            $table->char('user_id', 36)->nullable()->change();
            $table->foreign(['user_id'], 'fk_trx_users')
                  ->references(['id'])
                  ->on('users')
                  ->onUpdate('cascade')
                  ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign('fk_trx_users');
            $table->char('user_id', 36)->nullable(false)->change();
            $table->foreign(['user_id'], 'fk_trx_users')
                  ->references(['id'])
                  ->on('users')
                  ->onUpdate('cascade')
                  ->onDelete('restrict');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('status_reason');
        });
    }
};
