<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderStatusUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Order $order,
        public string $previousStatus
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PresenceChannel('admin.dashboard'),
            new \Illuminate\Broadcasting\PrivateChannel('orders.'.$this->order->id),
            new \Illuminate\Broadcasting\PrivateChannel('users.'.$this->order->user_id),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'order_id' => $this->order->id,
            'order_number' => $this->order->order_number,
            'status' => $this->order->status->value,
            'previous_status' => $this->previousStatus,
            'status_label' => $this->order->status->label(),
            'progress_percentage' => $this->order->getProgressPercentage(),
            'estimated_delivery_time' => $this->order->estimated_delivery_time?->toIso8601String(),
            'updated_at' => $this->order->updated_at->toIso8601String(),
        ];
    }

    public function broadcastAs(): string
    {
        return 'order.status.updated';
    }
}
