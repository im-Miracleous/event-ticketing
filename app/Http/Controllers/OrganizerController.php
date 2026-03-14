<?php
namespace App\Http\Controllers;
use App\Models\Organizer;
use Illuminate\Http\Request;

class OrganizerController extends Controller {
    public function index() {
        return response()->json(Organizer::with('user')->get());
    }

    public function store(Request $request) {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'required|string',
            'logo' => 'nullable|string',
            'bank_account' => 'required|string|max:45',
            'user_id' => 'required|exists:users,id'
        ]);
        $data['status'] = 'Active';

        return response()->json(Organizer::create($data), 201);
    }

    public function update(Request $request, $id) {
        $organizer = Organizer::findOrFail($id);
        $data = $request->validate([
            'name' => 'string|max:100',
            'description' => 'string',
            'bank_account' => 'string|max:45'
        ]);
        $organizer->update($data);

        return response()->json($organizer);
    }

    public function toggleStatus($id) {
        $organizer = Organizer::findOrFail($id);
        $organizer->status = ($organizer->status == 'Active') ? 'Inactive' : 'Active';
        $organizer->save();
        
        return response()->json($organizer);
    }
}
