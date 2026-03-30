<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('otp_codes', function (Blueprint $table) {
            $table->id();
            $table->char('user_id', 36)->index('fk_otp_users_idx');
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->string('email')->nullable();
            $table->string('code', 6);
            $table->enum('type', ['email_verification', 'password_reset'])->default('email_verification');
            $table->timestamp('expires_at');
            $table->timestamp('used_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('otp_codes');
    }
};
