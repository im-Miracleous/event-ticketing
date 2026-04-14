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
        $query = Promotion::with('event')->withCount('transactions');

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
                    'type'       => ucfirst($p->discount_type),
                    'value'      => $p->discount_type === 'fixed'
                        ? 'Rp' . number_format($p->discount_amount, 0, ',', '.')
                        : $p->discount_amount . '%',
                    'usage'      => $usedCount . ' / ' . $p->quota,
                    'validUntil' => Carbon::parse($p->end_date)->format('M d, Y'),
                    'status'     => $status,
                    'event'      => $p->event->title ?? 'All Events',
                    'event_id'   => $p->event_id ?? '',
                    'discount_type' => $p->discount_type,
                    'discount_amount' => $p->discount_amount,
                    'max_discount_amount' => $p->max_discount_amount,
                    'min_spending' => $p->min_spending,
                    'start_date' => Carbon::parse($p->start_date)->format('Y-m-d'),
                    'end_date' => Carbon::parse($p->end_date)->format('Y-m-d'),
                    'terms_and_conditions' => $p->terms_and_conditions,
                    'banner_url' => $p->banner_path ? asset('storage/' . $p->banner_path) : null,
                ];
            });

        return Inertia::render('Admin/Promotions/Index', [
            'promotions' => $promotions,
            'events'     => \App\Models\Event::where('status', 'Active')->get(['id', 'title']),
            'filters'    => $request->only(['per_page', 'search', 'sort', 'direction', 'valid_from', 'valid_to']),
        ]);
    }

    /**
     * Display the specified promotion.
     */
    public function show(int $id)
    {
        $promotion = Promotion::withCount('transactions')
            ->with('event')
            ->findOrFail($id);

        return Inertia::render('Admin/Promotions/Show', [
            'promotion' => [
                'id'                  => $promotion->id,
                'code'                => $promotion->code,
                'discount_type'       => $promotion->discount_type,
                'discount_amount'     => $promotion->discount_amount,
                'max_discount_amount' => $promotion->max_discount_amount,
                'min_spending'        => $promotion->min_spending,
                'quota'               => $promotion->quota,
                'used_count'          => $promotion->transactions_count,
                'start_date'          => Carbon::parse($promotion->start_date)->format('M d, Y'),
                'end_date'            => Carbon::parse($promotion->end_date)->format('M d, Y'),
                'event'               => $promotion->event?->title ?? 'All Events',
                'event_id'            => $promotion->event_id,
                'terms_and_conditions' => $promotion->terms_and_conditions,
                'banner_url'          => $promotion->banner_path ? asset('storage/' . $promotion->banner_path) : null,
                'created_at'          => $promotion->created_at->format('M d, Y H:i'),
                'status'              => Carbon::parse($promotion->end_date)->isPast() ? 'Expired' : 'Active',
            ]
        ]);
    }

    /**
     * Store a new promotion.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'code'                => 'required|unique:promotions,code',
            'discount_type'       => 'required|in:fixed,percentage',
            'discount_amount'     => 'required|numeric|min:0',
            'max_discount_amount' => 'nullable|numeric|min:0',
            'min_spending'        => 'nullable|numeric|min:0',
            'quota'               => 'required|integer|min:1',
            'start_date'          => 'required|date',
            'end_date'            => 'required|date|after_or_equal:start_date',
            'event_id'            => 'nullable|exists:events,id',
            'terms_and_conditions' => 'nullable|string',
            'banner'              => 'nullable|image|max:2048',
        ]);

        $data['event_id'] = $request->input('event_id') ?: null;

        if ($request->hasFile('banner')) {
            $data['banner_path'] = $request->file('banner')->store('promotions', 'public');
        }

        Promotion::create($data);

        return redirect()->route('admin.promotions.index')->with('success', 'Promotion created successfully.');
    }

    /**
     * Update a promotion.
     */
    public function update(Request $request, int $id)
    {
        $promotion = Promotion::findOrFail($id);
        $data = $request->validate([
            'code'                => 'required|unique:promotions,code,' . $id,
            'discount_type'       => 'required|in:fixed,percentage',
            'discount_amount'     => 'required|numeric|min:0',
            'max_discount_amount' => 'nullable|numeric|min:0',
            'min_spending'        => 'nullable|numeric|min:0',
            'quota'               => 'required|integer|min:1',
            'start_date'          => 'required|date',
            'end_date'            => 'required|date|after_or_equal:start_date',
            'event_id'            => 'nullable|exists:events,id',
            'terms_and_conditions' => 'nullable|string',
            'banner'              => 'nullable|image|max:2048',
        ]);

        $data['event_id'] = $request->input('event_id') ?: null;

        if ($request->hasFile('banner')) {
            // Delete old banner if exists
            if ($promotion->banner_path) {
                \Storage::disk('public')->delete($promotion->banner_path);
            }
            $data['banner_path'] = $request->file('banner')->store('promotions', 'public');
        }

        $promotion->update($data);

        return redirect()->route('admin.promotions.index')->with('success', 'Promotion updated successfully.');
    }

    public function updateTerms(Request $request, int $id)
    {
        $promotion = Promotion::findOrFail($id);
        $data = $request->validate([
            'terms_and_conditions' => 'nullable|string',
        ]);

        $promotion->update($data);

        return back()->with('success', 'Terms updated successfully.');
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
