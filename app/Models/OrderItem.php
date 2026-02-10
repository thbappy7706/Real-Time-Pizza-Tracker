<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'pizza_id',
        'quantity',
        'size',
        'crust',
        'base_price',
        'size_price',
        'crust_price',
        'toppings_price',
        'item_total',
        'selected_toppings',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'base_price' => 'decimal:2',
            'size_price' => 'decimal:2',
            'crust_price' => 'decimal:2',
            'toppings_price' => 'decimal:2',
            'item_total' => 'decimal:2',
            'selected_toppings' => 'array',
        ];
    }

    // Relationships
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function pizza()
    {
        return $this->belongsTo(Pizza::class);
    }

    // Size Multipliers
    public static function getSizeMultiplier(string $size): float
    {
        return match($size) {
            'small' => 0.8,
            'medium' => 1.0,
            'large' => 1.3,
            'extra_large' => 1.6,
            default => 1.0,
        };
    }

    // Crust Prices
    public static function getCrustPrice(string $crust): float
    {
        return match($crust) {
            'thin' => 0,
            'regular' => 0,
            'thick' => 2.00,
            'stuffed' => 3.50,
            default => 0,
        };
    }
}
