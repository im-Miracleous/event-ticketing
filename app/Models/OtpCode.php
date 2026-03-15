<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OtpCode extends Model
{
    protected $fillable = [
        'user_id',
        'code',
        'type',
        'expires_at',
        'used_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'used_at'    => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if this OTP is still valid (not expired, not used).
     */
    public function isValid(): bool
    {
        return $this->used_at === null && $this->expires_at->isFuture();
    }

    /**
     * Mark the OTP as used.
     */
    public function markAsUsed(): void
    {
        $this->update(['used_at' => now()]);
    }

    /**
     * Generate a random 6-digit OTP code for a user.
     */
    public static function generateFor(User $user, string $type = 'email_verification'): self
    {
        // Invalidate all previous OTPs of the same type for this user
        self::where('user_id', $user->id)
            ->where('type', $type)
            ->whereNull('used_at')
            ->update(['used_at' => now()]);

        return self::create([
            'user_id'    => $user->id,
            'code'       => str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT),
            'type'       => $type,
            'expires_at' => now()->addMinutes(10),
        ]);
    }
}
