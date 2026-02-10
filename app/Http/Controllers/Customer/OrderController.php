<?php

namespace App\Http\Controllers\Customer;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function __construct(
        private OrderService $orderService
    ) {}

    public function index(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with(['items.pizza', 'payment', 'delivery'])
            ->recent()
            ->paginate(10);

        return Inertia::render('Orders/Index', [
            'orders' => $orders->through(fn ($order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status->value,
                'status_label' => $order->status->label(),
                'total' => $order->total,
                'items_count' => $order->items->count(),
                'created_at' => $order->created_at->format('M d, Y h:i A'),
                'can_cancel' => $order->canBeCancelled(),
            ]),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.pizza_id' => 'required|exists:pizzas,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.size' => 'required|in:small,medium,large,extra_large',
            'items.*.crust' => 'required|in:thin,regular,thick,stuffed',
            'items.*.base_price' => 'required|numeric',
            'items.*.size_price' => 'required|numeric',
            'items.*.crust_price' => 'required|numeric',
            'items.*.toppings_price' => 'required|numeric',
            'items.*.item_total' => 'required|numeric',
            'items.*.selected_toppings' => 'nullable|array',
            'delivery_address' => 'required|string',
            'delivery_latitude' => 'nullable|numeric',
            'delivery_longitude' => 'nullable|numeric',
            'customer_phone' => 'required|string',
            'special_instructions' => 'nullable|string',
        ]);

        $order = $this->orderService->createOrder($validated, $request->user()->id);

        return redirect()->route('checkout', $order);
    }

    public function show(Order $order)
    {
        $this->authorize('view', $order);

        $order->load(['items.pizza', 'payment', 'delivery.driver', 'review']);

        return Inertia::render('Orders/Show', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status->value,
                'status_label' => $order->status->label(),
                'progress_percentage' => $order->getProgressPercentage(),
                'subtotal' => $order->subtotal,
                'tax' => $order->tax,
                'delivery_fee' => $order->delivery_fee,
                'total' => $order->total,
                'delivery_address' => $order->delivery_address,
                'customer_phone' => $order->customer_phone,
                'special_instructions' => $order->special_instructions,
                'estimated_delivery_time' => $order->estimated_delivery_time?->format('h:i A'),
                'created_at' => $order->created_at->format('M d, Y h:i A'),
                'items' => $order->items->map(fn ($item) => [
                    'id' => $item->id,
                    'pizza_name' => $item->pizza->name,
                    'quantity' => $item->quantity,
                    'size' => $item->size,
                    'crust' => $item->crust,
                    'item_total' => $item->item_total,
                    'selected_toppings' => $item->selected_toppings,
                ]),
                'payment' => $order->payment ? [
                    'method' => $order->payment->payment_method,
                    'status' => $order->payment->status,
                    'amount' => $order->payment->amount,
                ] : null,
                'delivery' => $order->delivery ? [
                    'status' => $order->delivery->status,
                    'driver_name' => $order->delivery->driver?->name,
                    'driver_phone' => $order->delivery->driver?->phone,
                    'current_latitude' => $order->delivery->current_latitude,
                    'current_longitude' => $order->delivery->current_longitude,
                ] : null,
                'can_cancel' => $order->canBeCancelled(),
                'can_review' => $order->status === OrderStatus::DELIVERED && ! $order->review,
            ],
        ]);
    }

    public function cancel(Order $order)
    {
        $this->authorize('update', $order);

        $this->orderService->cancelOrder($order, 'Cancelled by customer');

        return back()->with('success', 'Order cancelled successfully.');
    }
}
