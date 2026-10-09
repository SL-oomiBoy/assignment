<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\WorkshopController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

// Redirect root to dashboard or login
Route::get('/', function (Request $request) {
    if ($request->user()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
});

// Role-aware dashboard dispatcher
Route::get('/dashboard', function (Request $request) {
    if ($request->user()->isAdmin()) {
        return redirect()->route('admin.users.index');
    }
    return redirect()->route('workshops.index');
})->middleware(['auth'])->name('dashboard');

// Admin-only Routes (User Management)
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('users', UserController::class)->only(['index', 'store', 'update', 'destroy']);
});

// Operations Routes (Manager & Staff)
Route::middleware(['auth', 'role:manager,staff'])->group(function () {
    // Manager-only workshop creation and edits (Must precede {workshop} wildcard)
    Route::middleware('role:manager')->group(function () {
        Route::get('/workshops/create', [WorkshopController::class, 'create'])->name('workshops.create');
        Route::post('/workshops', [WorkshopController::class, 'store'])->name('workshops.store');
        Route::get('/workshops/{workshop}/edit', [WorkshopController::class, 'edit'])->name('workshops.edit');
        Route::put('/workshops/{workshop}', [WorkshopController::class, 'update'])->name('workshops.update');
    });

    // Workshop listing and details (Manager & Staff)
    Route::get('/workshops', [WorkshopController::class, 'index'])->name('workshops.index');
    Route::get('/workshops/{workshop}', [WorkshopController::class, 'show'])->name('workshops.show');

    // Registrations (Manager & Staff)
    Route::post('/workshops/{workshop}/registrations', [RegistrationController::class, 'store'])->name('registrations.store');
    Route::post('/registrations/{registration}/cancel', [RegistrationController::class, 'cancel'])->name('registrations.cancel');
});

// Profile Settings
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
