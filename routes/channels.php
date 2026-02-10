<?php

use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

// Admin Dashboard - Presence Channel
Broadcast::channel('admin.dashboard', function (User $user) {
    if ($user->isAdmin()) {
        return [
            'id' => $user->id,
            'name' => $user->name,
        ];
    }
});

// User-specific notifications
Broadcast::channel('users.{userId}', function (User $user, int $userId) {
    return (int) $user->id === (int) $userId;
});

// Order tracking - Private Channel
Broadcast::channel('orders.{orderId}', function (User $user, int $orderId) {
    $order = Order::find($orderId);

    return $order && ($user->id === $order->user_id || $user->isAdmin());
});

// Driver-specific channel
Broadcast::channel('drivers.{driverId}', function (User $user, int $driverId) {
    return (int) $user->id === (int) $driverId && $user->isAdmin();
});
