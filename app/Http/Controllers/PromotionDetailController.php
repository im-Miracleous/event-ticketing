<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Promotion;
use Inertia\Inertia;
use Illuminate\Support\Carbon;

class PromotionDetailController extends Controller
{
    public function show($code)
    {
        $promotion = Promotion::where('code', $code)
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->firstOrFail();

        return Inertia::render('Events/PromotionDetail', [
            'promotion' => [
                'id' => $promotion->id,
                'code' => $promotion->code,
                'discount_type' => $promotion->discount_type,
                'discount_amount' => $promotion->discount_amount,
                'max_discount_amount' => $promotion->max_discount_amount,
                'min_spending' => $promotion->min_spending,
                'start_date' => Carbon::parse($promotion->start_date)->format('d M Y'),
                'end_date' => Carbon::parse($promotion->end_date)->format('d M Y'),
                'terms_and_conditions' => $promotion->terms_and_conditions,
                'banner_url' => $promotion->banner_path ? asset('storage/' . $promotion->banner_path) : null,
                'event_title' => $promotion->event?->title ?? 'All Events',
            ]
        ]);
    }
}
