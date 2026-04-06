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
        $query = Promotion::with('event');

        // Search
        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('code', 'like', "%{$s}%")
                  ->orWhereHas('event', fn ($eq) => $eq->where('title', 'like', "%{$s}%"));
            });
        }

        // Status filter (computed, so we filter after fetch — or approximate via date)
        // Date range on end_date
        if ($request->filled('valid_from')) {
            $query->whereDate('end_date', '>=', $request->valid_from);
        }
        if ($request->filled('valid_to')) {
            $query->whereDate('end_date', '<=', $request->valid_to);
        }

        // Dynamic sorting
        $sortMap = [
            'code'       => 'code',
            'event'      => 'event',
            'value'      => 'discount_amount',
            'usage'      => 'quota',
            'validUntil' => 'end_date',
            'status'     => 'end_date',
        ];
        $sortCol = $sortMap[$request->input('sort')] ?? 'created_at';
        $sortDir = $request->input('direction', 'desc') === 'asc' ? 'asc' : 'desc';

        if ($sortCol === 'event') {
            $query->leftJoin('events', 'promotions.event_id', '=', 'events.id')
                  ->orderBy('events.title', $sortDir)
                  ->select('promotions.*');
        } else {
            $query->orderBy($sortCol, $sortDir);
        }

        $promotions = $query
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
            'filters'    => $request->only(['per_page', 'search', 'sort', 'direction', 'valid_from', 'valid_to']),
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
