<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderPlaced implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Order $order
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PresenceChannel('admin.dashboard'),
            new Channel('orders.' . $this->order->id),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'order' => [
                'id' => $this->order->id,
                'order_number' => $this->order->order_number,
                'customer_name' => $this->order->user->name,
                'total' => $this->order->total,
                'status' => $this->order->status->value,
                'created_at' => $this->order->created_at->toIso8601String(),
                'items_count' => $this->order->items->count(),
            ],
            'message' => 'New order received!',
        ];
    }

    public function broadcastAs(): string
    {
        return 'order.placed';
    }
}
