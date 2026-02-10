<?php

namespace App\Events;

use App\Models\Delivery;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DeliveryLocationUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Delivery $delivery
    ) {}

    public function broadcastOn(): array
    {
        return [
            new Channel('orders.'.$this->delivery->order_id),
            new Channel('users.'.$this->delivery->order->user_id),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'delivery_id' => $this->delivery->id,
            'order_id' => $this->delivery->order_id,
            'latitude' => $this->delivery->current_latitude,
            'longitude' => $this->delivery->current_longitude,
            'status' => $this->delivery->status,
            'driver_name' => $this->delivery->driver?->name,
            'updated_at' => $this->delivery->updated_at->toIso8601String(),
        ];
    }

    public function broadcastAs(): string
    {
        return 'delivery.location.updated';
    }
}
