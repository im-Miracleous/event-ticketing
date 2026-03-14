<?php
namespace App\Http\Controllers;
use App\Models\WaitingList;
use Illuminate\Http\Request;

class WaitingListController extends Controller {
    public function store(Request $request) {
        $data = $request->validate([
            'status' => 'required|in:Waiting,Confirmed,Cancelled',
            'event_id' => 'required|exists:events,id',
            'ticket_type_id' => 'required|exists:tickets_types,id',
            'user_id' => 'required|exists:users,id'
        ]);
        return response()->json(WaitingList::create($data), 201);
    }

    public function update(Request $request, $id) {
        $list = WaitingList::findOrFail($id);
        $data = $request->validate([
            'status' => 'required|in:Waiting,Confirmed,Cancelled'
        ]);
        $list->update($data);
        return response()->json($list);
    }

    public function toggleStatus($id) {
        $list = WaitingList::findOrFail($id);
        $list->status = 'Cancelled';
        $list->save();
        return response()->json($list);
    }
}
