<?php

namespace App\Enums;

enum OrderStatus: string
{
    case PENDING = 'pending';
    case PLACED = 'placed';
    case ACCEPTED = 'accepted';
    case PREPARING = 'preparing';
    case BAKING = 'baking';
    case OUT_FOR_DELIVERY = 'out_for_delivery';
    case DELIVERED = 'delivered';
    case CANCELLED = 'cancelled';
    case REJECTED = 'rejected';

    public function label(): string
    {
        return match($this) {
            self::PENDING => 'Pending',
            self::PLACED => 'Placed',
            self::ACCEPTED => 'Accepted',
            self::PREPARING => 'Preparing',
            self::BAKING => 'Baking',
            self::OUT_FOR_DELIVERY => 'Out for Delivery',
            self::DELIVERED => 'Delivered',
            self::CANCELLED => 'Cancelled',
            self::REJECTED => 'Rejected',
        };
    }

    public function color(): string
    {
        return match($this) {
            self::PENDING => 'gray',
            self::PLACED => 'blue',
            self::ACCEPTED => 'indigo',
            self::PREPARING => 'yellow',
            self::BAKING => 'orange',
            self::OUT_FOR_DELIVERY => 'purple',
            self::DELIVERED => 'green',
            self::CANCELLED => 'red',
            self::REJECTED => 'red',
        };
    }

    public static function getProgressSteps(): array
    {
        return [
            self::PLACED,
            self::ACCEPTED,
            self::PREPARING,
            self::BAKING,
            self::OUT_FOR_DELIVERY,
            self::DELIVERED,
        ];
    }
}
