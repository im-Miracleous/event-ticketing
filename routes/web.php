<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EventCatalogController;
use App\Http\Controllers\Admin;
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
})->middleware('guest');

Route::get('/dashboard', function () {
    $user = auth()->user();
    
    if (in_array($user->role, ['Root', 'Admin'])) {
        return redirect()->route('admin.dashboard');
    }

    if ($user->role === 'Organizer') {
        return redirect()->route('organizer.dashboard');
    }

    return Inertia::render('Dashboard');
})->middleware(['auth'])->name('dashboard');


Route::middleware('auth')->group(function () {
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

use App\Http\Controllers\EventController;
use App\Http\Controllers\TicketTypeController;
use App\Http\Controllers\ValidationLogController;

Route::middleware(['auth', 'verified', 'role:Organizer'])->prefix('organizer')->name('organizer.')->group(function () {
    Route::get('/', function () {
        return redirect()->route('organizer.dashboard');
    });
    Route::get('/dashboard', [EventController::class, 'dashboard'])->name('dashboard');
    Route::get('/export-sales', [EventController::class, 'exportSales'])->name('export-sales');
    Route::get('/events', [EventController::class, 'index'])->name('events.index');
    
    // Promotions
    Route::resource('promotions', \App\Http\Controllers\Organizer\PromotionController::class)->except(['create', 'show', 'edit']);
    
    // Attendees
    Route::get('/attendees', [\App\Http\Controllers\Organizer\AttendeeController::class, 'index'])->name('attendees.index');
    
    // Earnings Ledger
    Route::get('/earnings', [\App\Http\Controllers\Organizer\EarningController::class, 'index'])->name('earnings.index');
    
    Route::get('/events/{event}/tickets', [TicketTypeController::class, 'index'])->name('events.tickets.index');
    Route::post('/events/{event}/tickets', [TicketTypeController::class, 'store'])->name('events.tickets.store');
    Route::delete('/events/{event}/tickets/{ticketType}', [TicketTypeController::class, 'destroy'])->name('events.tickets.destroy');

    Route::get('/check-in', [ValidationLogController::class, 'index'])->name('check-in');
    Route::post('/check-in', [ValidationLogController::class, 'store'])->name('check-in.store');
});


// ─── Admin Routes (middleware to be refined later) ───────────────────
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard
    Route::get('/dashboard', [Admin\DashboardController::class, 'index'])->name('dashboard');

    // Events
    Route::patch('/events/{event}/status', [Admin\EventController::class, 'updateStatus'])->name('events.updateStatus');
    Route::resource('events', Admin\EventController::class);

    // Categories
    Route::get('/categories', [Admin\CategoryController::class, 'index'])->name('categories.index');
    Route::post('/categories', [Admin\CategoryController::class, 'store'])->name('categories.store');
    Route::put('/categories/{id}', [Admin\CategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{id}', [Admin\CategoryController::class, 'destroy'])->name('categories.destroy');

    // Users
    Route::get('/users', [Admin\UserController::class, 'index'])->name('users.index');
    Route::patch('/users/{id}/role', [Admin\UserController::class, 'updateRole'])->name('users.updateRole');
    Route::patch('/users/{id}/status', [Admin\UserController::class, 'updateStatus'])->name('users.updateStatus');
    Route::delete('/users/{id}', [Admin\UserController::class, 'destroy'])->name('users.destroy');

    // Finance
    Route::get('/finance', [Admin\FinanceController::class, 'index'])->name('finance.index');

    // Promotions
    Route::get('/promotions', [Admin\PromotionController::class, 'index'])->name('promotions.index');
    Route::post('/promotions', [Admin\PromotionController::class, 'store'])->name('promotions.store');
    Route::put('/promotions/{id}', [Admin\PromotionController::class, 'update'])->name('promotions.update');
    Route::delete('/promotions/{id}', [Admin\PromotionController::class, 'destroy'])->name('promotions.destroy');

    // Validation Logs
    Route::get('/validation-logs', [Admin\ValidationLogController::class, 'index'])->name('validation.index');

    // ROOT-only route (middleware to be added in a separate commit)
    Route::get('/settings', function () {
        return Inertia::render('Admin/Settings/Index');
    })->name('settings.index');
});


require __DIR__.'/auth.php';
