<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

        // Weekly performance data for chart
        $weeklyData = collect();
        for ($i = 6; $i >= 0; $i--) {
            $date = today()->subDays($i);
            $dayOrders = Order::whereDate('created_at', $date);
            
            $weeklyData->push([
                'name' => $date->format('D'),
                'orders' => $dayOrders->count(),
                'revenue' => (float) $dayOrders->whereIn('status', ['delivered'])->sum('total'),
            ]);
        }

        // Order status distribution
        $statusDistribution = Order::select('status', DB::raw('count(*) as count'))
            ->where('created_at', '>=', today()->subDays(30))
            ->groupBy('status')
            ->get()
            ->map(fn ($item) => [
                'status' => ucfirst(str_replace('_', ' ', $item->status->value)),
                'count' => $item->count,
            ]);

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'activeOrders' => $activeOrders,
            'weeklyData' => $weeklyData,
            'statusDistribution' => $statusDistribution,
        ]);
    }
}
