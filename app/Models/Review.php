<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'user_id',
        'pizza_id',
        'rating',
        'comment',
        'food_rating',
        'delivery_rating',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'integer',
            'food_rating' => 'integer',
            'delivery_rating' => 'integer',
        ];
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function pizza()
    {
        return $this->belongsTo(Pizza::class);
    }
}
