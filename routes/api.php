<?php

use App\Http\Controllers\EventCategoryController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\TicketTypeController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\TransactionDetailController;
use App\Http\Controllers\ValidationLogController;
use App\Http\Controllers\WaitingListController;
use Illuminate\Support\Facades\Route;

Route::apiResource('event-categories', EventCategoryController::class)->only(['index', 'store', 'update']);
Route::apiResource('events', EventController::class)->only(['index', 'store', 'update']);
Route::patch('events/{id}/toggle-status', [EventController::class, 'toggleStatus']);
Route::apiResource('payments', PaymentController::class)->only(['index', 'store', 'update']);
Route::get('tickets', [TicketController::class, 'index']);
Route::post('tickets/generate/{transaction_id}', [TicketController::class, 'generateTicket']);
Route::patch('tickets/{id}', [TicketController::class, 'update']);
Route::apiResource('ticket-types', TicketTypeController::class)->only(['index', 'store', 'update']);
Route::apiResource('transactions', TransactionController::class)->only(['index', 'store', 'update']);
Route::apiResource('transaction-details', TransactionDetailController::class)->only(['index', 'store', 'update']);
Route::apiResource('validation-logs', ValidationLogController::class)->only(['index', 'store', 'update']);
Route::apiResource('waiting-list', WaitingListController::class)->only(['index', 'store', 'update']);
