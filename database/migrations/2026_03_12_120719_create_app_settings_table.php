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
        Schema::create('app_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key', 100)->unique()->comment('Setting key, e.g. app_name, app_logo');
            $table->text('value')->nullable()->comment('Setting value');
            $table->string('type', 20)->default('text')->comment('Value type: text, image, boolean, json');
            $table->string('label', 150)->comment('Human-readable label shown in admin panel');
            $table->text('description')->nullable()->comment('Optional description of what this setting does');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('app_settings');
    }
};
