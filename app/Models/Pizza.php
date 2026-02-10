<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pizza extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'image_url',
        'base_price',
        'is_available',
        'is_vegetarian',
        'is_featured',
        'preparation_time',
    ];

    protected function casts(): array
    {
        return [
            'base_price' => 'decimal:2',
            'is_available' => 'boolean',
            'is_vegetarian' => 'boolean',
            'is_featured' => 'boolean',
            'preparation_time' => 'integer',
        ];
    }

    // Relationships
    public function toppings()
    {
        return $this->belongsToMany(Topping::class)
            ->withPivot('is_default')
            ->withTimestamps();
    }

    public function defaultToppings()
    {
        return $this->belongsToMany(Topping::class)
            ->wherePivot('is_default', true)
            ->withTimestamps();
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    // Scopes
    public function scopeAvailable($query)
    {
        return $query->where('is_available', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    // Accessors
    public function getAverageRatingAttribute()
    {
        return $this->reviews()->avg('rating') ?? 0;
    }
}
