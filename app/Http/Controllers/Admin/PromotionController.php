<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Promotion;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PromotionController extends Controller
{
    /**
     * List all promotions with pagination.
     */
    public function index(Request $request)
    {
        $promotions = Promotion::with('event')
            ->orderByDesc('created_at')
            ->paginate($request->input('per_page', 5))
            ->through(function ($p) {
                $usedCount = $p->transactions_count ?? 0;
                $status = 'Active';
                if (Carbon::parse($p->end_date)->isPast()) {
                    $status = 'Expired';
                } elseif ($usedCount >= $p->quota) {
                    $status = 'Expired';
                }

                return [
                    'id'         => $p->id,
                    'code'       => $p->code,
                    'type'       => $p->discount_amount >= 100 ? 'Fixed' : 'Percentage',
                    'value'      => $p->discount_amount >= 100
                        ? 'Rp' . number_format($p->discount_amount, 0, ',', '.')
                        : $p->discount_amount . '%',
                    'usage'      => $usedCount . ' / ' . $p->quota,
                    'validUntil' => Carbon::parse($p->end_date)->format('M d, Y'),
                    'status'     => $status,
                    'event'      => $p->event->title ?? '—',
                ];
            });

        return Inertia::render('Admin/Promotions/Index', [
            'promotions' => $promotions,
            'filters'    => $request->only(['per_page']),
        ]);
    }

    /**
     * Store a new promotion.
     */
    public function store(Request $request)
    {
        $request->validate([
            'code'            => 'required|string|max:20|unique:promotions,code',
            'discount_amount' => 'required|numeric|min:1',
            'quota'           => 'required|integer|min:1',
            'start_date'      => 'required|date',
            'end_date'        => 'required|date|after:start_date',
            'event_id'        => 'required|exists:events,id',
        ]);

        Promotion::create($request->only('code', 'discount_amount', 'quota', 'start_date', 'end_date', 'event_id'));

        return back()->with('success', 'Promotion created successfully.');
    }

    /**
     * Update a promotion.
     */
    public function update(Request $request, int $id)
    {
        $promotion = Promotion::findOrFail($id);

        $request->validate([
            'code'            => 'required|string|max:20|unique:promotions,code,' . $id,
            'discount_amount' => 'required|numeric|min:1',
            'quota'           => 'required|integer|min:1',
            'start_date'      => 'required|date',
            'end_date'        => 'required|date|after:start_date',
            'event_id'        => 'required|exists:events,id',
        ]);

        $promotion->update($request->only('code', 'discount_amount', 'quota', 'start_date', 'end_date', 'event_id'));

        return back()->with('success', 'Promotion updated successfully.');
    }

    /**
     * Delete a promotion.
     */
    public function destroy(int $id)
    {
        $promotion = Promotion::findOrFail($id);
        $promotion->delete();

        return back()->with('success', 'Promotion deleted successfully.');
    }
}
