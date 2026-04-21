<?php

namespace App\Http\Middleware;

use App\Models\AppSetting;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'tunnel_status' => function () use ($request) {
                if (!app()->environment('local')) return null;
                $configUrl = config('app.url');
                return [
                    'configured_url' => $configUrl,
                    'is_ngrok' => str_contains($configUrl, 'ngrok'),
                    'current_host' => $request->getHost(),
                    'is_matching' => str_contains($request->getHost(), parse_url($configUrl, PHP_URL_HOST) ?? $configUrl),
                ];
            },
            'currency' => fn () => AppSetting::get('currency', 'IDR'),
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'info' => fn () => $request->session()->get('info'),
                'warning' => fn () => $request->session()->get('warning'),
            ],
        ];
    }
}
