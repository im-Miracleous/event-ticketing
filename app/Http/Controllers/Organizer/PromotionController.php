<?php

namespace App\Http\Controllers\Organizer;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Promotion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PromotionController extends Controller
{
    /**
     * Display a listing of the promotions for the current organizer's events.
     */
    public function index()
    {
        $organizerId = auth()->user()->organizer?->id ?? 0;
        
        // Fetch promotions only for events owned by this organizer
        $promotions = Promotion::whereHas('event', function($query) use ($organizerId) {
            $query->where('organizer_id', $organizerId);
        })->with('event')->latest()->get();

        // Also fetch active events so the Organizer can select which event a new promo applies to
        $events = Event::where('organizer_id', $organizerId)->where('status', 'Active')->get(['id', 'title']);

        return Inertia::render('Organizer/Promotions/Index', [
            'promotions' => $promotions,
            'events' => $events,
        ]);
    }

    /**
     * Store a newly created promotion in storage.
     */
    public function store(Request $request)
    {
        $organizerId = auth()->user()->organizer?->id ?? 0;

        $request->validate([
            'event_id' => [
                'required',
                'exists:events,id',
                function ($attribute, $value, $fail) use ($organizerId) {
                    $event = Event::find($value);
                    if (!$event || $event->organizer_id !== $organizerId) {
                        $fail('Acara tersebut tidak valid atau bukan milik Anda.');
                    }
                },
            ],
            'code' => 'required|string|max:20|unique:promotions,code',
            'discount_amount' => 'required|integer|min:1',
            'quota' => 'required|integer|min:1',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        Promotion::create($request->all());

        return redirect()->route('organizer.promotions.index')->with('success', 'Kode Promo berhasil ditambahkan!');
    }

    /**
     * Update the specified promotion in storage.
     */
    public function update(Request $request, string $id)
    {
        $organizerId = auth()->user()->organizer?->id ?? 0;
        
        $promotion = Promotion::whereHas('event', function($q) use ($organizerId) {
            $q->where('organizer_id', $organizerId);
        })->findOrFail($id);

        $request->validate([
            'code' => 'required|string|max:20|unique:promotions,code,'.$id,
            'discount_amount' => 'required|integer|min:1',
            'quota' => 'required|integer|min:1',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $promotion->update($request->only(['code', 'discount_amount', 'quota', 'start_date', 'end_date']));

        return redirect()->route('organizer.promotions.index')->with('success', 'Kode Promo berhasil diperbarui!');
    }

    /**
     * Remove the specified promotion from storage.
     */
    public function destroy(string $id)
    {
        $organizerId = auth()->user()->organizer?->id ?? 0;

        $promotion = Promotion::whereHas('event', function($q) use ($organizerId) {
            $q->where('organizer_id', $organizerId);
        })->findOrFail($id);

        $promotion->delete();

        return redirect()->route('organizer.promotions.index')->with('success', 'Kode Promo berhasil dihapus!');
    }
}
