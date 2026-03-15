<?php
namespace App\Http\Controllers;
use App\Models\Attendee;
use Illuminate\Http\Request;

class AttendeeController extends Controller {
    public function store(Request $request) {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:45',
            'phone_number' => 'required|string|max:15',
            'identity_number' => 'nullable|string|max:20',
            'ticket_id' => 'required|exists:tickets,id'
        ]);
        
        return response()->json(Attendee::create($data), 201);
    }
}
