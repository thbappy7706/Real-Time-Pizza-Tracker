<?php

namespace App\Services;

use App\Events\DeliveryAssigned;
use App\Events\DeliveryLocationUpdated;
use App\Models\Delivery;
use App\Models\Order;
use Illuminate\Support\Facades\DB;

class DeliveryService
{
    public function assignDriver(Order $order, int $driverId): Delivery
    {
        return DB::transaction(function () use ($order, $driverId) {
            $delivery = Delivery::create([
                'order_id' => $order->id,
                'driver_id' => $driverId,
                'status' => 'assigned',
                'assigned_at' => now(),
            ]);

            broadcast(new DeliveryAssigned($delivery))->toOthers();

            return $delivery->load(['order', 'driver']);
        });
    }

    public function updateLocation(Delivery $delivery, float $latitude, float $longitude): Delivery
    {
        $delivery->update([
            'current_latitude' => $latitude,
            'current_longitude' => $longitude,
        ]);

        broadcast(new DeliveryLocationUpdated($delivery))->toOthers();

        return $delivery->fresh();
    }

    public function updateDeliveryStatus(Delivery $delivery, string $status): Delivery
    {
        $updateData = ['status' => $status];

        if ($status === 'picked_up') {
            $updateData['picked_up_at'] = now();
        } elseif ($status === 'delivered') {
            $updateData['delivered_at'] = now();
        }

        $delivery->update($updateData);

        return $delivery->fresh();
    }
}
