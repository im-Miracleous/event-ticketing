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
                
                // Try to reach the local ngrok API to see if the process is actually running
                $isProcessRunning = false;
                $actualUrl = null;
                try {
                    $ctx = stream_context_create(['http' => ['timeout' => 1.0]]);
                    $apiResponse = @file_get_contents('http://127.0.0.1:4040/api/tunnels', false, $ctx);
                    if ($apiResponse) {
                        $isProcessRunning = true;
                        $decoded = json_decode($apiResponse, true);
                        $actualUrl = $decoded['tunnels'][0]['public_url'] ?? null;
                    }
                } catch (\Exception $e) {}

                return [
                    'configured_url' => $configUrl,
                    'is_ngrok' => str_contains($configUrl, 'ngrok'),
                    'current_host' => $request->getHost(),
                    'is_matching' => str_contains($request->getHost(), parse_url($configUrl, PHP_URL_HOST) ?? $configUrl),
                    'process_running' => $isProcessRunning,
                    'actual_url' => $actualUrl,
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
