<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EventCatalogController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth'])->name('dashboard');


Route::middleware('auth')->group(function () {
    Route::get('/', [App\Http\Controllers\EventCatalogController::class, 'index'])->name('home');
    Route::get('/events', [App\Http\Controllers\EventCatalogController::class, 'index'])->name('events.index');

    // Checkout & Booking
    Route::get('/events/{event}/checkout', [App\Http\Controllers\CheckoutController::class, 'show'])->name('checkout.show');
    Route::post('/checkout', [App\Http\Controllers\CheckoutController::class, 'store'])->name('checkout.store');
    Route::get('/checkout/{transactionId}/payment', [App\Http\Controllers\CheckoutController::class, 'payment'])->name('checkout.payment');
    Route::post('/checkout/{transactionId}/confirm', [App\Http\Controllers\CheckoutController::class, 'confirmPayment'])->name('checkout.confirm');
    Route::post('/checkout/{transactionId}/cancel', [App\Http\Controllers\CheckoutController::class, 'cancel'])->name('checkout.cancel');
    Route::get('/checkout/{transactionId}/result', [App\Http\Controllers\CheckoutController::class, 'result'])->name('checkout.result');

    // My Tickets
    Route::get('/my-tickets', [App\Http\Controllers\MyTicketsController::class, 'index'])->name('tickets.my');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


require __DIR__.'/auth.php';
