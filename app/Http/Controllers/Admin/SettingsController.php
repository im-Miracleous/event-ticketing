<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AppSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class SettingsController extends Controller
{
    /**
     * Display the system settings page (Root only).
     */
    public function index()
    {
        $user = Auth::user();

        if ($user->role !== 'Root') {
            abort(403, 'Only Root users can access system settings.');
        }

        $settings = AppSetting::all()->keyBy('key')->map(fn ($s) => $s->value);

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update system settings.
     */
    public function update(Request $request)
    {
        $user = Auth::user();

        if ($user->role !== 'Root') {
            abort(403, 'Only Root users can modify system settings.');
        }

        $allowedKeys = [
            'app_name', 'app_tagline', 'contact_email',
            'currency', 'maintenance_mode', 'allow_registration',
            'social_facebook', 'social_instagram', 'social_twitter',
            'payment_gateway', 'payment_mode', 'payment_api_key',
            'platform_fee',
        ];

        foreach ($request->only($allowedKeys) as $key => $value) {
            AppSetting::set($key, $value);
        }

        return back()->with('success', 'Settings saved successfully.');
    }

    /**
     * Verify password before revealing the API key.
     */
    public function verifyPassword(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $user = Auth::user();

        if (! Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'The password is incorrect.'], 422);
        }

        $apiKey = AppSetting::get('payment_api_key', '');

        return response()->json(['api_key' => $apiKey]);
    }
}
