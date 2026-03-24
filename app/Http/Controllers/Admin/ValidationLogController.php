<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ValidationLog;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ValidationLogController extends Controller
{
    /**
     * List all validation logs with optional type filter.
     */
    public function index(Request $request)
    {
        $query = ValidationLog::with('ticket');

        if ($request->filled('type') && $request->type !== 'All') {
            // Map frontend filter types to result column values
            $typeMap = [
                'ticket_scan' => ['Valid', 'Invalid', 'Already Used'],
                'system'      => ['Expired'],
            ];

            if (isset($typeMap[$request->type])) {
                $query->whereIn('result', $typeMap[$request->type]);
            }
        }

        $logs = $query->orderByDesc('validation_time')
            ->paginate($request->input('per_page', 10))
            ->through(fn($log) => [
                'id'          => $log->id,
                'type'        => in_array($log->result, ['Valid', 'Invalid', 'Already Used']) ? 'ticket_scan' : 'system',
                'description' => $log->ticket
                    ? "Ticket #{$log->ticket->id} — {$log->result}"
                    : $log->result,
                'user'        => 'System',
                'ip'          => '—',
                'timestamp'   => $log->validation_time
                    ? Carbon::parse($log->validation_time)->format('M d, Y H:i:s')
                    : '—',
            ]);

        return Inertia::render('Admin/Logs/Index', [
            'logs'    => $logs,
            'filters' => $request->only(['type', 'per_page']),
        ]);
    }
}
