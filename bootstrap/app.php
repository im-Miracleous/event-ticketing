<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'role' => \App\Http\Middleware\CheckRole::class,
        ]);
        
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->validateCsrfTokens(except: [
            'doku/notification',
            'checkout/*/result',
        ]);

        $middleware->trustProxies(at: '*');


        // Redirect authenticated users away from guest-only pages (login, register)
        // to their role-specific dashboard
        $middleware->redirectGuestsTo(fn (Request $request) => route('login'));
        $middleware->redirectUsersTo(function (Request $request) {
            $user = $request->user();
            if ($user) {
                if (in_array($user->role, ['Root', 'Admin'])) {
                    return route('admin.dashboard');
                }
                if ($user->role === 'Organizer') {
                    return route('organizer.dashboard');
                }
            }
            return route('dashboard');
        });
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->respond(function (\Symfony\Component\HttpFoundation\Response $response, \Throwable $exception, Request $request) {
            // Only intercept HTTP exceptions with standard error status codes
            if ($exception instanceof HttpExceptionInterface) {
                $status = $exception->getStatusCode();

                if (in_array($status, [400, 401, 403, 404, 408, 419, 429, 500, 502, 503]) && !app()->environment('testing')) {
                    return Inertia::render('Error', ['status' => $status])
                        ->toResponse($request)
                        ->setStatusCode($status);
                }
            }

            // For 500-level errors that are NOT HttpExceptions (unexpected errors),
            // render the error page in production only
            if (!app()->environment(['local', 'testing']) && $response->getStatusCode() >= 500) {
                return Inertia::render('Error', ['status' => 500])
                    ->toResponse($request)
                    ->setStatusCode(500);
            }

            return $response;
        });
    })->create();
