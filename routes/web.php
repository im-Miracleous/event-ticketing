<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

use App\Http\Controllers\EventController;
use App\Http\Controllers\TicketTypeController;
use App\Http\Controllers\ValidationLogController;

Route::middleware(['auth', 'verified', 'role:Organizer'])->prefix('organizer')->name('organizer.')->group(function () {
    Route::get('/', function () {
        return redirect()->route('organizer.dashboard');
    });
    Route::get('/dashboard', [EventController::class, 'index'])->name('dashboard');
    Route::resource('events', EventController::class);
    
    Route::get('/events/{event}/tickets', [TicketTypeController::class, 'index'])->name('events.tickets.index');
    Route::post('/events/{event}/tickets', [TicketTypeController::class, 'store'])->name('events.tickets.store');
    Route::delete('/events/{event}/tickets/{ticketType}', [TicketTypeController::class, 'destroy'])->name('events.tickets.destroy');

    Route::get('/check-in', [ValidationLogController::class, 'index'])->name('check-in');
    Route::post('/check-in', [ValidationLogController::class, 'store'])->name('check-in.store');
});

require __DIR__.'/auth.php';
