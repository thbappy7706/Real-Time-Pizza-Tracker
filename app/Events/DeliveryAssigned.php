<?php

namespace App\Events;

use App\Models\Delivery;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DeliveryAssigned implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Delivery $delivery
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PresenceChannel('admin.dashboard'),
            new Channel('orders.'.$this->delivery->order_id),
            new Channel('users.'.$this->delivery->order->user_id),
            new Channel('drivers.'.$this->delivery->driver_id),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'delivery_id' => $this->delivery->id,
            'order_id' => $this->delivery->order_id,
            'order_number' => $this->delivery->order->order_number,
            'driver_id' => $this->delivery->driver_id,
            'driver_name' => $this->delivery->driver->name,
            'driver_phone' => $this->delivery->driver->phone,
            'status' => $this->delivery->status,
            'assigned_at' => $this->delivery->assigned_at->toIso8601String(),
        ];
    }

    public function broadcastAs(): string
    {
        return 'delivery.assigned';
    }
}
