<?php

use App\Http\Controllers\Api\AdminCategoryController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CommandeController;
use App\Http\Controllers\Api\PanierController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\StatisticProductController;
use App\Http\Controllers\Api\StatisticsController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\UserStatsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::aliasMiddleware('role', \App\Http\Middleware\RoleMiddleware::class);

/*
|-------------------------------------------------------------------
|  Public
|-------------------------------------------------------------------
*/
Route::post('/login', [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'register']);
Route::post('/email', [UserController::class, 'sendResetLinkEmail'])->name('password.email');
Route::post('/reset', [UserController::class, 'reset'])->name('password.reset');

Route::get('/categories', [CategoryController::class, 'all']);
Route::get('/categories/{id}', [CategoryController::class, 'detailled']);

Route::prefix('panier')->group(function () {
    Route::get('/', [PanierController::class, 'index']);
    Route::post('/', [PanierController::class, 'store']);
    Route::put('/{id}', [PanierController::class, 'update']);
    Route::put('/size/{id}', [PanierController::class, 'updateSize']);
    Route::delete('/{id}', [PanierController::class, 'destroy']);
    Route::post('/clear', [PanierController::class, 'clear']);
    Route::post('/commande', [PanierController::class, 'command']);
});

Route::get('/produits/{id}', [ProductController::class, 'show']);
Route::get('/produits', [ProductController::class, 'index']);
Route::get('/categories/{category}/{id}/{product}', [ProductController::class, 'showWithRelated']);
/*
|------------------------------------------------------------------
| Admin seulement
|------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum','role:admin'])->group(function () {

    /**
     * Gestion des utilisateurs
     */
    Route::prefix('/users')->group(function () {
        Route::get('/stats', [UserStatsController::class, 'stats']);
        Route::get('/table', [UserStatsController::class, 'index']);
        Route::get('/categories', [UserStatsController::class, 'categories']);
        Route::put('/{id}', [UserStatsController::class, 'update']);
        Route::delete('/{id}', [UserStatsController::class, 'destroy']);
    });

    Route::prefix('/statistics')->group(function () {
        Route::get('/', [StatisticsController::class, 'index']);
        Route::get('/categories', [StatisticsController::class, 'categories']);
        Route::get('/monthly-sales', [StatisticsController::class, 'monthlySales']);
        Route::get('/category-sales', [StatisticsController::class, 'categorySales']);
    });

    Route::prefix('/products')->group(function() {
        Route::get('/table', [StatisticProductController::class, 'index']);
        Route::post('/add', [StatisticProductController::class, 'store']);
        Route::get('/stats', [StatisticProductController::class, 'stats']);
        Route::get('/categories', [StatisticProductController::class, 'categories']);
        Route::put('/update/{id}', [StatisticProductController::class, 'update']);
        Route::delete('/destroy/{id}', [StatisticProductController::class, 'destroy']);
    });

    Route::prefix('/commands')->group(function() {
        Route::get('/stats', [CommandeController::class, 'stats']);
        Route::get('/table', [CommandeController::class, 'index']);
        Route::get('/categories', [CommandeController::class, 'categories']);
        Route::put('/{id}', [CommandeController::class, 'update']);
        Route::delete('/{id}', [CommandeController::class, 'destroy']);
    });

    
    Route::prefix('/categorie')->group(function() {
        Route::post('/add', [AdminCategoryController::class, 'add']);
        Route::get('/stats', [AdminCategoryController::class, 'stats']);
        Route::get('/categories', [AdminCategoryController::class, 'index']);
        Route::put('/update/{id}', [AdminCategoryController::class, 'update']);
        Route::delete('/delete/{id}', [AdminCategoryController::class, 'destroy']);
    });
});

Route::middleware('auth:api')->post('/logout', [UserController::class, 'logout'])->name('api.logout');
