<?php
namespace App\Http\Controllers;
use App\Models\Event;
use Illuminate\Http\Request;

use Inertia\Inertia;

class EventController extends Controller {
    public function dashboard() {
        return Inertia::render('Organizer/Dashboard', [
            // Can pass stats here later
        ]);
    }

    public function index() {
        return Inertia::render('Organizer/Events/Index', [
            'events' => Event::with(['category'])->where('organizer_id', auth()->user()->organizer?->id ?? 0)->get()
        ]);
    }
}
