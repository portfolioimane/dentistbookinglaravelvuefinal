<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Frontend\HomeController;
use App\Http\Controllers\Api\Frontend\ServiceController;
use App\Http\Controllers\Api\Frontend\AppointmentController;
use App\Http\Controllers\Api\Frontend\PaypalController;
use App\Http\Controllers\Api\Frontend\ContentController;
use App\Http\Controllers\Api\Frontend\ReviewController;


use App\Http\Controllers\Api\Backend\ServiceController as BackendServiceController;
use App\Http\Controllers\Api\Backend\AppointmentController as BackendAppointmentController;
use App\Http\Controllers\Api\Backend\BusinessHourController;
use App\Http\Controllers\Api\Backend\ContentBlockController as BackendContentBlockController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Backend\PatientController;




use App\Http\Controllers\Api\Frontend\ResetPasswordController;

// In routes/web.php
Route::post('/password/email', [ResetPasswordController::class, 'sendResetLinkEmail'])->name('password.email');
Route::post('password/reset', [ResetPasswordController::class, 'reset']);


Route::get('/latest-featured-reviews', [ReviewController::class, 'latestFeaturedReviews']);

Route::get('content/hero', [ContentController::class, 'hero']);
Route::get('content/about', [ContentController::class, 'about']);
Route::get('content/consultation', [ContentController::class, 'consultation']);
Route::get('content/logo', [ContentController::class, 'logo']);


Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'getUser']);
// Public Auth Routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Protected Routes (admin access)
Route::middleware('auth:sanctum')->group(function () {
    // Services
    Route::apiResource('services', BackendServiceController::class);
    Route::get('/patients', [PatientController::class, 'getPatientsWithConfirmedAppointments']);
    // Appointments
    Route::get('appointments', [BackendAppointmentController::class, 'index']); // Get all appointments
    Route::get('appointments/{id}', [BackendAppointmentController::class, 'show']); // Get single appointment
    Route::put('appointments/{id}', [BackendAppointmentController::class, 'update']); // Update appointment
    Route::delete('appointments/{id}', [BackendAppointmentController::class, 'destroy']); // Delete appointment
    // routes/api.php (Backend routes)
Route::get('appointments/{id}', [BackendAppointmentController::class, 'show']);


    // Business Hours
    Route::apiResource('business-hours', BusinessHourController::class);
     
     Route::get('/content/herosection', [BackendContentBlockController::class, 'getHeroSection']);
Route::get('/content/consultationsection', [BackendContentBlockController::class, 'getConsultation']);
Route::get('/content/aboutsection', [BackendContentBlockController::class, 'getAbout']);
Route::get('/content/logosection', [BackendContentBlockController::class, 'getLogo']);

      Route::post('/content/herosection', [BackendContentBlockController::class, 'updateHeroSection']);
    Route::post('/content/consultationsection', [BackendContentBlockController::class, 'updateConsultation']);
    Route::post('/content/aboutsection', [BackendContentBlockController::class, 'updateAbout']);
    Route::post('/content/logosection', [BackendContentBlockController::class, 'updateLogo']);
Route::get('/reviews', [ReviewController::class, 'index']);
Route::post('reviews/{reviewId}/toggle-featured', [ReviewController::class, 'toggleFeatured']);
Route::delete('reviews/{reviewId}', [ReviewController::class, 'destroy']);

});


// Frontend routes (public access for customers/guests)
Route::get('/', [HomeController::class, 'index']); // Home page
Route::get('/services', [ServiceController::class, 'index']); // List all services
Route::get('/available-slots', [AppointmentController::class, 'getAvailableSlots']); // Get available time slots
Route::post('/appointments', [AppointmentController::class, 'store']); // Book an appointment

Route::middleware('auth:sanctum')->group(function () {

// Fetch user-specific appointments
Route::get('/myappointments', [AppointmentController::class, 'getUserAppointments']);

Route::get('/appointments/{id}', [AppointmentController::class, 'show']);
Route::patch('/appointments/{id}/confirm', [AppointmentController::class, 'confirm']);
Route::patch('/appointments/{id}/update-status', [AppointmentController::class, 'updateStatus']);
// In routes/api.php
Route::post('/appointments/confirm-paypal', [PaypalController::class, 'confirmPaypalPayment']);

Route::get('password/reset/{token}', [ResetPasswordController::class, 'showResetForm'])->name('password.reset');

Route::post('appointments/cancel', [AppointmentController::class, 'cancel']);
// In routes/web.php

Route::put('/user', [AuthController::class, 'updateProfile']);


Route::post('reviews', [ReviewController::class, 'store']);

});