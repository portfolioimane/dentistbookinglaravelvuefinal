<?php
namespace App\Http\Controllers\Api\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    public function latestFeaturedReviews()
    {
        // Retrieve the latest 3 featured reviews, including the associated service and user
        $reviews = Review::where('featured', true)
            ->latest()
            ->with(['service', 'user']) // Load the related service and user models
            ->take(3) // Limit the results to 3 reviews
            ->get();

        return response()->json($reviews);
    }
    public function index()
    {
        // Fetch all reviews with their related user and service
        $reviews = Review::with(['user', 'service'])->get();

        // Return reviews as a JSON response
        return response()->json($reviews);
    }

    /**
     * Store a review for a service.
     */
public function store(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'serviceId' => 'required|exists:services,id',
            'stars' => 'required|integer|min:1|max:5',
            'content' => 'nullable|string',
            'avatar' => 'nullable|image|mimes:jpeg,png,gif|max:2048', // Validate image file
        ]);

        // Get the logged-in user's ID
        $userId = auth()->id();

        // Prepare review data
        $reviewData = [
            'user_id' => $userId,
            'service_id' => $request->serviceId,
            'stars' => $request->stars,
            'content' => $request->content,
        ];

        // If an avatar is uploaded, handle the file storage
        if ($request->hasFile('avatar')) {
            // Check if there is an existing avatar and delete it
            $existingReview = Review::where('user_id', $userId)
                                    ->where('service_id', $request->serviceId)
                                    ->first();

            if ($existingReview && $existingReview->avatar) {
                // Delete the existing avatar from storage
                Storage::delete($existingReview->avatar);
            }

            // Store the new avatar and add the file path to the review data
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            $reviewData['avatar'] = $avatarPath;
        }

        // Create a new review in the database
        $review = Review::create($reviewData);

        // Return the review data as a response (or return success message)
        return response()->json([
            'message' => 'Review submitted successfully!',
            'review' => $review,
        ], 201);
    }
    /**
     * Toggle the featured status of a review.
     */
    public function toggleFeatured($reviewId)
    {
        $review = Review::find($reviewId);

        if (!$review) {
            return response()->json(['message' => 'Review not found.'], 404);
        }

        $review->featured = !$review->featured;
        $review->save();

        return response()->json(['message' => 'Review featured status updated.', 'featured' => $review->featured]);
    }

    /**
     * Delete a review.
     */
    public function destroy($reviewId)
    {
        // Find the review by ID
        $review = Review::find($reviewId);

        if (!$review) {
            return response()->json(['message' => 'Review not found.'], 404);
        }

        // If the review has an avatar, delete the file from storage
        if ($review->avatar) {
            Storage::disk('public')->delete($review->avatar);
            Log::debug('Deleted avatar: ' . $review->avatar); // Log avatar deletion
        }

        // Delete the review
        $review->delete();

        return response()->json(['message' => 'Review deleted successfully.']);
    }
}
