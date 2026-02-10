<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Delivery extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'driver_id',
        'status',
        'current_latitude',
        'current_longitude',
        'assigned_at',
        'picked_up_at',
        'delivered_at',
        'delivery_notes',
    ];

    protected function casts(): array
    {
        return [
            'current_latitude' => 'decimal:8',
            'current_longitude' => 'decimal:8',
            'assigned_at' => 'datetime',
            'picked_up_at' => 'datetime',
            'delivered_at' => 'datetime',
        ];
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }
}
