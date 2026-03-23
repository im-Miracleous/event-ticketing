<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OtpCode extends Model
{
    protected $fillable = [
        'user_id',
        'email',
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
     * Generate a random 6-digit OTP code.
     * Can be associated with an existing User or an unregistered email string.
     */
    public static function generateFor(User|string $recipient, string $type = 'email_verification'): self
    {
        $userId = $recipient instanceof User ? $recipient->id : null;
        $email = $recipient instanceof User ? $recipient->email : $recipient;

        // Invalidate all previous OTPs of the same type for this recipient
        $query = self::where('type', $type)->whereNull('used_at');
        if ($userId) {
            $query->where('user_id', $userId);
        } else {
            $query->where('email', $email);
        }
        $query->update(['used_at' => now()]);

        return self::create([
            'user_id'    => $userId,
            'email'      => $email,
            'code'       => str_pad((string)random_int(0, 999999), 6, '0', STR_PAD_LEFT),
            'type'       => $type,
            'expires_at' => now()->addMinutes(10),
        ]);
    }
}
