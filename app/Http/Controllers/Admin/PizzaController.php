<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pizza;
use App\Models\Topping;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PizzaController extends Controller
{
    public function index()
    {
        $pizzas = Pizza::withCount('reviews')
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Pizzas/Index', [
            'pizzas' => $pizzas->through(fn ($pizza) => [
                'id' => $pizza->id,
                'name' => $pizza->name,
                'base_price' => $pizza->base_price,
                'is_available' => $pizza->is_available,
                'is_featured' => $pizza->is_featured,
                'reviews_count' => $pizza->reviews_count,
            ]),
        ]);
    }

    public function create()
    {
        $toppings = Topping::available()->get(['id', 'name', 'category']);

        return Inertia::render('Admin/Pizzas/Create', [
            'toppings' => $toppings,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'image_url' => 'nullable|url',
            'base_price' => 'required|numeric|min:0',
            'is_vegetarian' => 'boolean',
            'is_featured' => 'boolean',
            'preparation_time' => 'required|integer|min:1',
            'default_toppings' => 'nullable|array',
            'default_toppings.*' => 'exists:toppings,id',
        ]);

        $pizza = Pizza::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'image_url' => $validated['image_url'] ?? null,
            'base_price' => $validated['base_price'],
            'is_vegetarian' => $validated['is_vegetarian'] ?? false,
            'is_featured' => $validated['is_featured'] ?? false,
            'preparation_time' => $validated['preparation_time'],
        ]);

        if (! empty($validated['default_toppings'])) {
            $pizza->toppings()->attach(
                collect($validated['default_toppings'])->mapWithKeys(
                    fn ($id) => [$id => ['is_default' => true]]
                )
            );
        }

        return redirect()
            ->route('admin.pizzas.index')
            ->with('success', 'Pizza created successfully.');
    }

    public function edit(Pizza $pizza)
    {
        $pizza->load('toppings');
        $toppings = Topping::available()->get(['id', 'name', 'category']);

        return Inertia::render('Admin/Pizzas/Edit', [
            'pizza' => [
                'id' => $pizza->id,
                'name' => $pizza->name,
                'description' => $pizza->description,
                'image_url' => $pizza->image_url,
                'base_price' => $pizza->base_price,
                'is_vegetarian' => $pizza->is_vegetarian,
                'is_featured' => $pizza->is_featured,
                'is_available' => $pizza->is_available,
                'preparation_time' => $pizza->preparation_time,
                'default_toppings' => $pizza->toppings->pluck('id'),
            ],
            'toppings' => $toppings,
        ]);
    }

    public function update(Request $request, Pizza $pizza)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'image_url' => 'nullable|url',
            'base_price' => 'required|numeric|min:0',
            'is_vegetarian' => 'boolean',
            'is_featured' => 'boolean',
            'is_available' => 'boolean',
            'preparation_time' => 'required|integer|min:1',
            'default_toppings' => 'nullable|array',
        ]);

        $pizza->update($validated);

        if (isset($validated['default_toppings'])) {
            $pizza->toppings()->sync(
                collect($validated['default_toppings'])->mapWithKeys(
                    fn ($id) => [$id => ['is_default' => true]]
                )
            );
        }

        return redirect()
            ->route('admin.pizzas.index')
            ->with('success', 'Pizza updated successfully.');
    }

    public function destroy(Pizza $pizza)
    {
        $pizza->delete();

        return back()->with('success', 'Pizza deleted successfully.');
    }
}
