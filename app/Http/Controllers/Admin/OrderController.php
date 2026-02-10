<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Services\DeliveryService;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function __construct(
        private OrderService $orderService,
        private DeliveryService $deliveryService
    ) {}

    public function index(Request $request)
    {
        $query = Order::with(['user', 'items.pizza', 'delivery.driver'])
            ->recent();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $orders = $query->paginate(20);

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders->through(fn ($order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer_name' => $order->user->name,
                'status' => $order->status->value,
                'status_label' => $order->status->label(),
                'total' => $order->total,
                'items_count' => $order->items->count(),
                'created_at' => $order->created_at->format('M d, Y h:i A'),
            ]),
        ]);
    }

    public function show(Order $order)
    {
        $order->load(['user', 'items.pizza', 'payment', 'delivery.driver']);

        $drivers = User::where('role', 'admin')->get(['id', 'name']);

        return Inertia::render('Admin/Orders/Show', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer_name' => $order->user->name,
                'customer_phone' => $order->customer_phone,
                'customer_email' => $order->user->email,
                'status' => $order->status->value,
                'status_label' => $order->status->label(),
                'subtotal' => $order->subtotal,
                'tax' => $order->tax,
                'delivery_fee' => $order->delivery_fee,
                'total' => $order->total,
                'delivery_address' => $order->delivery_address,
                'special_instructions' => $order->special_instructions,
                'created_at' => $order->created_at->format('M d, Y h:i A'),
                'items' => $order->items->map(fn ($item) => [
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
                ] : null,
                'delivery' => $order->delivery ? [
                    'driver_id' => $order->delivery->driver_id,
                    'driver_name' => $order->delivery->driver?->name,
                    'status' => $order->delivery->status,
                ] : null,
            ],
            'drivers' => $drivers,
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:accepted,preparing,baking,out_for_delivery,delivered,rejected',
            'reason' => 'required_if:status,rejected',
        ]);

        $this->orderService->updateStatus(
            $order,
            OrderStatus::from($validated['status']),
            $validated['reason'] ?? null
        );

        return back()->with('success', 'Order status updated successfully.');
    }

    public function assignDriver(Request $request, Order $order)
    {
        $validated = $request->validate([
            'driver_id' => 'required|exists:users,id',
        ]);

        $this->deliveryService->assignDriver($order, $validated['driver_id']);

        return back()->with('success', 'Driver assigned successfully.');
    }
}
