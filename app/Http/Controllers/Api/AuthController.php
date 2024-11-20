<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth; // Ensure Auth is imported
use Illuminate\Support\Facades\Storage; // Add this for file storage

class AuthController extends Controller
{

       public function getUser(Request $request)
    {
        return response()->json([
            'user' => Auth::user(), // Return the authenticated user
        ]);
    }

    public function register(Request $request)
    {
        // Log the incoming request data
        Log::info('Registration attempt', ['request' => $request->all()]);

        // Validate user input
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            // Remove the role from the validation rules
            // 'role' => 'required|string|in:admin,customer', // Commented out or removed
        ]);

        if ($validator->fails()) {
            Log::warning('Validation failed', ['errors' => $validator->errors()]);
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Create user
        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                // Set default role to 'customer' if not specified
                'role' => 'customer', // Default role
            ]);

            Log::info('User created successfully', ['user_id' => $user->id]);
        } catch (\Exception $e) {
            Log::error('User creation failed', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'User registration failed'], 500);
        }

        // Do not generate token here, instead, return user details
        return response()->json(['user' => $user], 201);
    }

    public function login(Request $request)
    {
        // Validate user input
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check credentials
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Generate token
        $token = $user->createToken('API Token')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token]);
    }

public function updateProfile(Request $request)
{
    $user = Auth::user(); // Get the authenticated user
    Log::debug('Updating profile for user ID: ' . $user->id); // Log user ID

    // Validate the input data
    $validatedData = $request->validate([
        'name' => 'nullable|string|max:255', // Allow name to be optional (nullable)
        'email' => 'nullable|email|unique:users,email,' . $user->id, // Email is nullable but must be unique
        'phone' => 'nullable|string|max:15',
        'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Image validation for avatar
        'password' => 'nullable|string|min:6|confirmed', // Password confirmation validation
    ]);

    // Check if the user has uploaded a new avatar file
    if ($request->hasFile('avatar')) {
        Log::debug('Avatar file uploaded'); // Log file upload event

        // Delete the old avatar if it exists
        if ($user->avatar) {
            Storage::delete('public/' . $user->avatar); // Delete old avatar
            Log::debug('Deleted old avatar: ' . $user->avatar); // Log file deletion
        }

        // Save the new avatar file
        $avatarPath = $request->file('avatar')->store('avatars', 'public');
        $validatedData['avatar'] = $avatarPath; // Store the new avatar path
    }

    // Check if the password is being updated and hash it
    if ($request->filled('password')) {
        $validatedData['password'] = bcrypt($request->password); // Hash the password before saving
    }

    // Update the user profile
    try {
        $user->update($validatedData); // Update user information
        Log::debug('Profile updated for user ID: ' . $user->id); // Log successful update
        return response()->json(['message' => 'Profile updated successfully']);
    } catch (\Exception $e) {
        Log::error('Failed to update profile', ['error' => $e->getMessage()]);
        return response()->json(['error' => 'Failed to update profile', 'details' => $e->getMessage()], 500);
    }
}



}
