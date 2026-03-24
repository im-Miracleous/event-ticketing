<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\Auth\OtpVerificationController;
use App\Http\Controllers\Auth\OtpPasswordResetController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('register', [AuthController::class, 'showRegister'])
        ->name('register');

    Route::post('register', [AuthController::class, 'register']);

    Route::get('login', [AuthController::class, 'showLogin'])
        ->name('login');

    Route::post('login', [AuthController::class, 'login']);

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    // OTP Password Reset
    Route::get('otp-password', [OtpPasswordResetController::class, 'show'])
        ->name('otp.password');
    Route::post('otp-password', [OtpPasswordResetController::class, 'verify']);
    Route::post('otp-password/resend', [OtpPasswordResetController::class, 'resend'])
        ->name('otp.password.resend');


    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');

    // OTP Registration Verification
    Route::get('otp-verify', [OtpVerificationController::class, 'show'])
        ->name('otp.verify');
    Route::post('otp-verify', [OtpVerificationController::class, 'verify'])
        ->name('otp.verify.submit');
    Route::post('otp-verify/resend', [OtpVerificationController::class, 'resend'])
        ->name('otp.resend');
});

Route::middleware('auth')->group(function () {
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::put('password', [PasswordController::class, 'update'])->name('password.update');

    Route::post('logout', [AuthController::class, 'logout'])
        ->name('logout');
});
