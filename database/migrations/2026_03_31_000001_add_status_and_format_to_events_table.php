<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            if (!Schema::hasColumn('events', 'status')) {
                $table->enum('status', ['Draft', 'Active', 'Cancelled', 'Completed'])
                      ->default('Draft')
                      ->after('organizer_id');
            }
            if (!Schema::hasColumn('events', 'format')) {
                $table->enum('format', ['Online', 'Offline'])
                      ->default('Offline')
                      ->after('location');
            }
        });

        // Fix column lengths - title/description too short for realistic data
        Schema::table('events', function (Blueprint $table) {
            $table->string('title', 255)->change();
            $table->text('description')->change();
            $table->string('banner_image')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            if (Schema::hasColumn('events', 'status')) {
                $table->dropColumn('status');
            }
            if (Schema::hasColumn('events', 'format')) {
                $table->dropColumn('format');
            }
            $table->string('title', 45)->change();
            $table->string('description', 200)->change();
            $table->string('banner_image')->change();
        });
    }
};
