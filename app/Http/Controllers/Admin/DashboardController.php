<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $stats = [
            'total_orders_today' => Order::whereDate('created_at', today())->count(),
            'active_orders' => Order::active()->count(),
            'total_revenue_today' => Order::whereDate('created_at', today())
                ->whereIn('status', ['delivered'])
                ->sum('total'),
            'total_customers' => User::where('role', 'customer')->count(),
        ];

        $activeOrders = Order::with(['user', 'items.pizza', 'delivery.driver'])->active()->recent()->get()
            ->map(fn ($order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer_name' => $order->user->name,
                'customer_phone' => $order->customer_phone,
                'status' => $order->status->value,
                'status_label' => $order->status->label(),
                'total' => $order->total,
                'items_count' => $order->items->count(),
                'delivery_address' => $order->delivery_address,
                'created_at' => $order->created_at->format('h:i A'),
                'estimated_delivery_time' => $order->estimated_delivery_time?->format('h:i A'),
                'driver_name' => $order->delivery?->driver?->name,
            ]);

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'activeOrders' => $activeOrders,
        ]);
    }
}
