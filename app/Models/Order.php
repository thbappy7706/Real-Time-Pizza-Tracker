<?php

namespace App\Models;

use App\Enums\OrderStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'order_number',
        'user_id',
        'status',
        'subtotal',
        'tax',
        'delivery_fee',
        'total',
        'delivery_address',
        'delivery_latitude',
        'delivery_longitude',
        'customer_phone',
        'special_instructions',
        'estimated_delivery_time',
        'accepted_at',
        'delivered_at',
        'rejection_reason',
    ];

    protected function casts(): array
    {
        return [
            'status' => OrderStatus::class,
            'subtotal' => 'decimal:2',
            'tax' => 'decimal:2',
            'delivery_fee' => 'decimal:2',
            'total' => 'decimal:2',
            'delivery_latitude' => 'decimal:8',
            'delivery_longitude' => 'decimal:8',
            'estimated_delivery_time' => 'datetime',
            'accepted_at' => 'datetime',
            'delivered_at' => 'datetime',
        ];
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            $order->order_number = 'ORD-' . strtoupper(uniqid());
        });
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    public function delivery()
    {
        return $this->hasOne(Delivery::class);
    }

    public function review()
    {
        return $this->hasOne(Review::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->whereNotIn('status', [
            OrderStatus::DELIVERED->value,
            OrderStatus::CANCELLED->value,
            OrderStatus::REJECTED->value,
        ]);
    }

    public function scopeRecent($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    // Helper Methods
    public function canBeCancelled(): bool
    {
        return in_array($this->status, [
            OrderStatus::PENDING,
            OrderStatus::PLACED,
        ]);
    }

    public function isInProgress(): bool
    {
        return in_array($this->status, [
            OrderStatus::PLACED,
            OrderStatus::ACCEPTED,
            OrderStatus::PREPARING,
            OrderStatus::BAKING,
            OrderStatus::OUT_FOR_DELIVERY,
        ]);
    }

    public function getProgressPercentage(): int
    {
        $steps = OrderStatus::getProgressSteps();
        $currentIndex = array_search($this->status, $steps);
        
        if ($currentIndex === false) {
            return 0;
        }

        return (int) (($currentIndex / (count($steps) - 1)) * 100);
    }
}
