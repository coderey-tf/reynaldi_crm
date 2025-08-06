<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\DealPipelineController;
use App\Http\Controllers\CustomerController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::prefix('leads')->name('leads.')->controller(LeadController::class)->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::put('/{id}', 'update')->name('update');
        Route::delete('/{id}', 'destroy')->name('destroy');
    });

    Route::prefix('products')->name('products.')->controller(ProductController::class)->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::put('/{id}', 'update')->name('update');
        Route::delete('/{id}', 'destroy')->name('destroy');
    });

    Route::prefix('deal-pipeline')->name('deal-pipeline.')->controller(DealPipelineController::class)->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::put('/{id}', 'update')->name('update');
        Route::delete('/{id}', 'destroy')->name('destroy');
    });

    Route::prefix('customers')->name('customers.')->controller(CustomerController::class)->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::put('/{id}', 'update')->name('update');
        Route::delete('/{id}', 'destroy')->name('destroy');
    });
    Route::get('/report', function () {
        return Inertia::render('report/index');
    })->name('report');
    Route::get('/export-deal-pipeline', [DealPipelineController::class, 'export'])->name('deal-pipeline.export');

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
