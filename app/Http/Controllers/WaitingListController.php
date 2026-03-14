<?php
namespace App\Http\Controllers;

use App\Models\WaitingList;
use Illuminate\Http\Request;

class WaitingListController extends Controller {
    public function index() {
        return response()->json(WaitingList::with(['event', 'ticketType'])->get());
    }

    public function store(Request $request) {
        $data = $request->validate([
            'status' => 'required|in:Waiting,Confirmed,Cancelled',
            'event_id' => 'required',
            'ticket_type_id' => 'required',
            'user_id' => 'required'
        ]);

        $waitingList = WaitingList::create($data);
        return response()->json($waitingList, 201);
    }

    public function update(Request $request, $id) {
        $waitingList = WaitingList::findOrFail($id);
        $data = $request->validate([
            'status' => 'required|in:Waiting,Confirmed,Cancelled'
        ]);

        $waitingList->update($data);
        return response()->json($waitingList);
    }
}
