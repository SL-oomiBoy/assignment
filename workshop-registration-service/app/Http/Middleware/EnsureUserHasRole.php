<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(401, 'Unauthenticated.');
        }

        // Support both comma-separated in single string and variadic arguments (e.g. role:manager,staff)
        $allowedRoles = [];
        foreach ($roles as $role) {
            $parts = explode(',', $role);
            foreach ($parts as $p) {
                $trimmed = trim($p);
                if ($trimmed !== '') {
                    $allowedRoles[] = $trimmed;
                }
            }
        }

        if (! in_array($user->role, $allowedRoles, true)) {
            abort(403, "Forbidden: User role '{$user->role}' is not authorized to perform this action.");
        }

        return $next($request);
    }
}
