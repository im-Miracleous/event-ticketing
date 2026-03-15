<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AppSetting extends Model
{
    protected $table = 'app_settings';
    protected $fillable = [
        'key',
        'value',
        'type',
        'label',
        'description',
    ];

    /**
     * Retrieve a setting value by key, with an optional fallback.
     *
     * Usage:  AppSetting::get('app_name', 'My App')
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        $setting = static::where('key', $key)->first();
        return $setting?->value ?? $default;
    }

    /**
     * Set (or create) a setting value by key.
     *
     * Usage:  AppSetting::set('app_name', 'Event Hub')
     */
    public static function set(string $key, mixed $value): void
    {
        static::updateOrCreate(
            ['key' => $key],
            ['value' => $value]
        );
    }
}
