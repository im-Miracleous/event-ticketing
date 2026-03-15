<?php
namespace App\Http\Controllers;
use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller {
    public function index() {
        return response()->json(Wishlist::with(['user', 'event'])->get());
    }

    public function store(Request $request) {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'event_id' => 'required|exists:events,id'
        ]);
        $data['status'] = 'Active';

        return response()->json(Wishlist::create($data), 201);
    }

    public function update(Request $request, $user_id, $event_id) {
        $wishlist = Wishlist::where('user_id', $user_id)->where('event_id', $event_id)->firstOrFail();
        $data = $request->validate([
            'status' => 'required|in:Active,Inactive'
        ]);
        $wishlist->update($data);

        return response()->json($wishlist);
    }

    public function toggleStatus($user_id, $event_id) {
        $wishlist = Wishlist::where('user_id', $user_id)->where('event_id', $event_id)->firstOrFail();
        $wishlist->status = ($wishlist->status == 'Active') ? 'Inactive' : 'Active';
        $wishlist->save();
        
        return response()->json($wishlist);
    }
}
