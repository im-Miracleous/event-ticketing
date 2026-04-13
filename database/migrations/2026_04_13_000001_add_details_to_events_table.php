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
        Schema::table('events', function (Blueprint $table) {
            $table->json('faq')->nullable()->after('location');
            $table->text('rules_policies')->nullable()->after('faq');
            $table->text('contact_info')->nullable()->after('rules_policies');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn(['faq', 'rules_policies', 'contact_info']);
        });
    }
};
