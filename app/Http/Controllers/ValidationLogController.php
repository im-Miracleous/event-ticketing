<?php
namespace App\Http\Controllers;

use App\Models\ValidationLog;
use Illuminate\Http\Request;

class ValidationLogController extends Controller {
    public function index() {
        return response()->json(ValidationLog::with('ticket')->get());
    }

    public function store(Request $request) {
        $data = $request->validate([
            'validationlog_id' => 'required|string|unique:validation_logs',
            'validation_time' => 'required|date',
            'result' => 'required|in:Valid,Invalid,Expired,Already Used',
            'tickets_ticket_id' => 'required'
        ]);

        $log = ValidationLog::create($data);
        return response()->json($log, 201);
    }

    public function update(Request $request, $id) {
        $log = ValidationLog::findOrFail($id);
        $data = $request->validate([
            'result' => 'required|in:Valid,Invalid,Expired,Already Used'
        ]);

        $log->update($data);
        return response()->json($log);
    }
}
