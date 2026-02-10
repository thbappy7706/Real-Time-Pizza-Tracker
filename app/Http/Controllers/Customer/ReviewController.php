<?php

namespace App\Http\Controllers\Customer;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request, Order $order)
    {
        $this->authorize('view', $order);

        if ($order->status !== OrderStatus::DELIVERED) {
            return back()->withErrors(['review' => 'You can only review delivered orders.']);
        }

        if ($order->review) {
            return back()->withErrors(['review' => 'You have already reviewed this order.']);
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:500',
            'food_rating' => 'nullable|integer|min:1|max:5',
            'delivery_rating' => 'nullable|integer|min:1|max:5',
        ]);

        Review::create([
            'order_id' => $order->id,
            'user_id' => $request->user()->id,
            'pizza_id' => $order->items->first()?->pizza_id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? null,
            'food_rating' => $validated['food_rating'] ?? null,
            'delivery_rating' => $validated['delivery_rating'] ?? null,
        ]);

        return back()->with('success', 'Thank you for your review!');
    }
}
