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
            'validation_time' => 'required|date_format:Y-m-d H:i:s',
            'result' => 'required|in:Valid,Invalid,Expired,Already Used',
            'ticket_id' => 'required|exists:tickets,id'
        ]);

        return response()->json(ValidationLog::create($data), 201);
    }

    public function update(Request $request, $id) {
        $log = ValidationLog::findOrFail($id);
        $data = $request->validate([
            'result' => 'required|in:Valid,Invalid,Expired,Already Used'
        ]);
        $log->update($data);

        return response()->json($log);
    }

    public function toggleStatus($id) {
        $log = ValidationLog::findOrFail($id);
        $log->result = ($log->result == 'Valid') ? 'Invalid' : 'Valid';
        $log->save();
        
        return response()->json($log);
    }
}
