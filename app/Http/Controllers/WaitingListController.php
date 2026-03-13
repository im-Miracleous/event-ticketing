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
            'waitinglist_id' => 'required|string|unique:waiting_list',
            'waitinglist_status' => 'required|in:Waiting,Confirmed,Cancelled',
            'events_event_id' => 'required',
            'events_event_category_eventcategory_id' => 'required',
            'tickets_types_tickettype_id' => 'required'
        ]);

        $waitingList = WaitingList::create($data);
        return response()->json($waitingList, 201);
    }

    public function update(Request $request, $id) {
        $waitingList = WaitingList::findOrFail($id);
        $data = $request->validate([
            'waitinglist_status' => 'required|in:Waiting,Confirmed,Cancelled'
        ]);

        $waitingList->update($data);
        return response()->json($waitingList);
    }
}
