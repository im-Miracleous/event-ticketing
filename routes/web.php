<?php

use App\Http\Controllers\ProfileController;
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
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// ─── Admin Routes (middleware to be refined later) ───────────────────
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard
    Route::get('/dashboard', [Admin\DashboardController::class, 'index'])->name('dashboard');

    // Events
    Route::get('/events', [Admin\EventController::class, 'index'])->name('events.index');
    Route::patch('/events/{id}/status', [Admin\EventController::class, 'updateStatus'])->name('events.updateStatus');
    Route::delete('/events/{id}', [Admin\EventController::class, 'destroy'])->name('events.destroy');

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
