<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// General Controllers
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EventCatalogController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\MyTicketsController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\WaitingListController;
use App\Http\Controllers\DokuNotificationController;
use App\Http\Controllers\TicketTypeController;
use App\Http\Controllers\ValidationLogController;

// Organizer Controllers
use App\Http\Controllers\Organizer\AttendeeController as OrganizerAttendeeController;
use App\Http\Controllers\Organizer\EarningController as OrganizerEarningController;
use App\Http\Controllers\Organizer\PromotionController as OrganizerPromotionController;

// Admin Controllers
use App\Http\Controllers\Admin;

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

    return redirect()->route('events.index');
})->middleware(['auth'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/events', [EventCatalogController::class, 'index'])->name('events.index');
    Route::get('/search', [SearchController::class, 'index'])->name('search.index');

    // Checkout & Booking
    Route::get('/events/{event}/checkout', [CheckoutController::class, 'show'])->name('checkout.show');
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
    Route::get('/checkout/{transactionId}/payment', [CheckoutController::class, 'payment'])->name('checkout.payment');
    Route::post('/checkout/{transactionId}/confirm', [CheckoutController::class, 'confirmPayment'])->name('checkout.confirm');
    Route::post('/checkout/{transactionId}/cancel', [CheckoutController::class, 'cancel'])->name('checkout.cancel');
    Route::get('/checkout/{transactionId}/result', [CheckoutController::class, 'result'])->name('checkout.result');

    // My Tickets
    Route::get('/my-tickets', [MyTicketsController::class, 'index'])->name('tickets.my');

    // Saved Events (Wishlist)
    Route::get('/saved-events', [WishlistController::class, 'index'])->name('wishlists.index');
    Route::post('/saved-events/toggle', [WishlistController::class, 'toggle'])->name('wishlists.toggle');
    Route::get('/saved-events/check', [WishlistController::class, 'check'])->name('wishlists.check');

    // Waiting List
    Route::get('/waiting-list', [WaitingListController::class, 'index'])->name('waiting-list.index');
    Route::post('/waiting-list', [WaitingListController::class, 'store'])->name('waiting-list.store');
    Route::post('/waiting-list/{id}/cancel', [WaitingListController::class, 'cancel'])->name('waiting-list.cancel');

    // Account Settings (Profile)
    Route::get('/settings', [ProfileController::class, 'edit'])->name('settings.edit');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// DOKU Payment Notification Webhook (no auth, CSRF-exempt)
Route::post('/doku/notification', [DokuNotificationController::class, 'handle'])
    ->name('doku.notification');

// ─── Organizer Routes ───────────────────
Route::middleware(['auth', 'verified', 'role:Organizer'])->prefix('organizer')->name('organizer.')->group(function () {
    Route::get('/', function () {
        return redirect()->route('organizer.dashboard');
    });
    
    Route::get('/dashboard', [EventController::class, 'dashboard'])->name('dashboard');
    Route::get('/export-sales', [EventController::class, 'exportSales'])->name('export-sales');

    // Organizer Event CRUD
    Route::get('/events', [EventController::class, 'index'])->name('events.index');
    Route::get('/events/create', [EventController::class, 'create'])->name('events.create');
    Route::post('/events', [EventController::class, 'store'])->name('events.store');
    Route::get('/events/{event}', [EventController::class, 'show'])->name('events.show');
    Route::get('/events/{event}/edit', [EventController::class, 'edit'])->name('events.edit');
    Route::put('/events/{event}', [EventController::class, 'update'])->name('events.update');
    Route::patch('/events/{event}/status', [EventController::class, 'updateStatus'])->name('events.updateStatus');

    Route::get('/transactions', [EventController::class, 'transactions'])->name('transactions.index');
    
    // Promotions
    Route::resource('promotions', OrganizerPromotionController::class)->except(['create', 'show', 'edit']);

    // Attendees
    Route::get('/attendees', [OrganizerAttendeeController::class, 'index'])->name('attendees.index');

    // Earnings Ledger
    Route::get('/earnings', [OrganizerEarningController::class, 'index'])->name('earnings.index');

    // Tickets
    Route::get('/events/{event}/tickets', [TicketTypeController::class, 'index'])->name('events.tickets.index');
    Route::post('/events/{event}/tickets', [TicketTypeController::class, 'store'])->name('events.tickets.store');
    Route::delete('/events/{event}/tickets/{ticketType}', [TicketTypeController::class, 'destroy'])->name('events.tickets.destroy');

    // Check-In (QR Scanner)
    Route::get('/check-in', [ValidationLogController::class, 'index'])->name('check-in');
    Route::post('/check-in', [ValidationLogController::class, 'store'])->name('check-in.store');
});

// ─── Admin Routes ───────────────────
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard
    Route::get('/dashboard', [Admin\DashboardController::class, 'index'])->name('dashboard');

    // Events
    Route::patch('/events/{event}/status', [Admin\EventController::class, 'updateStatus'])->name('events.updateStatus');
    Route::patch('/events/{event}/restore', [Admin\EventController::class, 'restore'])->name('events.restore');
    Route::delete('/events/{event}/force-delete', [Admin\EventController::class, 'forceDelete'])->name('events.forceDelete');
    Route::get('/events/archive', [Admin\EventController::class, 'archive'])->name('events.archive');
    Route::resource('events', Admin\EventController::class);

    // Categories
    Route::get('/categories', [Admin\CategoryController::class, 'index'])->name('categories.index');
    Route::get('/categories/{id}', [Admin\CategoryController::class, 'show'])->name('categories.show');
    Route::post('/categories', [Admin\CategoryController::class, 'store'])->name('categories.store');
    Route::put('/categories/{id}', [Admin\CategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{id}', [Admin\CategoryController::class, 'destroy'])->name('categories.destroy');

    // Users
    Route::get('/users', [Admin\UserController::class, 'index'])->name('users.index');
    Route::post('/users', [Admin\UserController::class, 'store'])->name('users.store');
    Route::get('/users/{id}', [Admin\UserController::class, 'show'])->name('users.show');
    Route::put('/users/{id}', [Admin\UserController::class, 'update'])->name('users.update');
    Route::patch('/users/{id}/role', [Admin\UserController::class, 'updateRole'])->name('users.updateRole');
    Route::patch('/users/{id}/status', [Admin\UserController::class, 'updateStatus'])->name('users.updateStatus');
    Route::delete('/users/{id}', [Admin\UserController::class, 'destroy'])->name('users.destroy');

    // Finance
    Route::get('/finance', [Admin\FinanceController::class, 'index'])->name('finance.index');

    // Promotions
    Route::get('/promotions', [Admin\PromotionController::class, 'index'])->name('promotions.index');
    Route::post('/promotions', [Admin\PromotionController::class, 'store'])->name('promotions.store');
    Route::get('/promotions/{id}', [Admin\PromotionController::class, 'show'])->name('promotions.show');
    Route::put('/promotions/{id}', [Admin\PromotionController::class, 'update'])->name('promotions.update');
    Route::delete('/promotions/{id}', [Admin\PromotionController::class, 'destroy'])->name('promotions.destroy');

    // Validation Logs
    Route::get('/validation-logs', [Admin\ValidationLogController::class, 'index'])->name('validation.index');

    // Settings
    Route::get('/settings', [Admin\SettingsController::class, 'index'])->name('settings.index');
    Route::put('/settings', [Admin\SettingsController::class, 'update'])->name('settings.update');
    Route::post('/settings/verify-password', [Admin\SettingsController::class, 'verifyPassword'])->name('settings.verifyPassword');
});

require __DIR__.'/auth.php';