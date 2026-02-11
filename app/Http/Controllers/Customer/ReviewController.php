<?php

namespace App\Http\Controllers\Customer;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ReviewController extends Controller
{
    public function store(Request $request, Order $order)
    {
        $this->authorize('view', $order);

        // Check if order is delivered
        if ($order->status !== OrderStatus::DELIVERED) {
            return back()->withErrors(['review' => 'You can only review delivered orders.']);
        }

        // Check if already reviewed
        if ($order->review) {
            return back()->withErrors(['review' => 'You have already reviewed this order.']);
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:500',
            'food_rating' => 'nullable|integer|min:1|max:5',
            'delivery_rating' => 'nullable|integer|min:1|max:5',
        ]);

        try {
            $review = Review::create([
                'order_id' => $order->id,
                'user_id' => $request->user()->id,
                'pizza_id' => $order->items->first()?->pizza_id,
                'rating' => $validated['rating'],
                'comment' => $validated['comment'] ?? null,
                'food_rating' => $validated['food_rating'] ?? null,
                'delivery_rating' => $validated['delivery_rating'] ?? null,
            ]);

            Log::info('Review created', [
                'review_id' => $review->id,
                'order_id' => $order->id,
                'user_id' => $request->user()->id,
            ]);

            return back()->with('success', 'Thank you for your review!');
        } catch (\Exception $e) {
            Log::error('Failed to create review', [
                'error' => $e->getMessage(),
                'order_id' => $order->id,
                'user_id' => $request->user()->id,
            ]);

            return back()->withErrors(['review' => 'Failed to submit review. Please try again.']);
        }
    }
}
