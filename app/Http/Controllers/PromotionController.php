<?php
namespace App\Http\Controllers;
use App\Models\Promotion;
use Illuminate\Http\Request;

class PromotionController extends Controller {
    public function store(Request $request) {
        $data = $request->validate([
            'code' => 'required|string|max:20|unique:promotions',
            'discount_amount' => 'required|numeric',
            'quota' => 'required|integer',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'event_id' => 'required|exists:events,id'
        ]);

        return response()->json(Promotion::create($data), 201);
    }

    public function update(Request $request, $id) {
        $promo = Promotion::findOrFail($id);
        $data = $request->validate([
            'discount_amount' => 'numeric',
            'quota' => 'integer',
            'end_date' => 'date'
        ]);
        $promo->update($data);

        return response()->json($promo);
    }

    public function toggleStatus($id) {
        $promo = Promotion::findOrFail($id);
        $promo->quota = 0;
        $promo->save();
        
        return response()->json($promo);
    }
}
