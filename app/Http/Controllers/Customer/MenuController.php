<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Pizza;
use App\Models\Topping;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MenuController extends Controller
{
    public function index(Request $request)
    {
        $query = Pizza::with(['defaultToppings'])
            ->available()
            ->withCount('reviews')
            ->withAvg('reviews', 'rating');

        if ($request->has('search')) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        if ($request->has('vegetarian') && $request->vegetarian) {
            $query->where('is_vegetarian', true);
        }

        $pizzas = $query->get()->map(function ($pizza) {
            return [
                'id' => $pizza->id,
                'name' => $pizza->name,
                'description' => $pizza->description,
                'image_url' => $pizza->image_url,
                'base_price' => $pizza->base_price,
                'is_vegetarian' => $pizza->is_vegetarian,
                'is_featured' => $pizza->is_featured,
                'preparation_time' => $pizza->preparation_time,
                'average_rating' => round($pizza->reviews_avg_rating ?? 0, 1),
                'reviews_count' => $pizza->reviews_count,
                'default_toppings' => $pizza->defaultToppings->map(fn ($t) => [
                    'id' => $t->id,
                    'name' => $t->name,
                    'price' => $t->price,
                ]),
            ];
        });

        $toppings = Topping::available()
            ->orderBy('category')
            ->orderBy('name')
            ->get()
            ->groupBy('category')
            ->map(fn ($items) => $items->map(fn ($t) => [
                'id' => $t->id,
                'name' => $t->name,
                'price' => $t->price,
                'category' => $t->category,
                'is_vegetarian' => $t->is_vegetarian,
            ]));

        return Inertia::render('Menu/Index', [
            'pizzas' => $pizzas,
            'toppings' => $toppings,
        ]);
    }

    public function show(Pizza $pizza)
    {
        $pizza->load(['defaultToppings', 'reviews.user'])
            ->loadAvg('reviews', 'rating')
            ->loadCount('reviews');

        return Inertia::render('Menu/Show', [
            'pizza' => [
                'id' => $pizza->id,
                'name' => $pizza->name,
                'description' => $pizza->description,
                'image_url' => $pizza->image_url,
                'base_price' => $pizza->base_price,
                'is_vegetarian' => $pizza->is_vegetarian,
                'preparation_time' => $pizza->preparation_time,
                'average_rating' => round($pizza->reviews_avg_rating ?? 0, 1),
                'reviews_count' => $pizza->reviews_count,
                'default_toppings' => $pizza->defaultToppings,
                'reviews' => $pizza->reviews->map(fn ($r) => [
                    'id' => $r->id,
                    'rating' => $r->rating,
                    'comment' => $r->comment,
                    'user_name' => $r->user->name,
                    'created_at' => $r->created_at->diffForHumans(),
                ]),
            ],
        ]);
    }
}
