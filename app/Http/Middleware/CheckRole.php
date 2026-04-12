<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!\Illuminate\Support\Facades\Auth::check() || !in_array(\Illuminate\Support\Facades\Auth::user()->role, $roles)) {
            abort(403, 'Unauthorized action. Required role: ' . implode(' or ', $roles));
        }

        return $next($request);
    }
}
