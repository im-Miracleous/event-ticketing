<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EventCatalogController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/', [App\Http\Controllers\EventCatalogController::class, 'index'])->name('home');
    Route::get('/events', [App\Http\Controllers\EventCatalogController::class, 'index'])->name('events.index');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
