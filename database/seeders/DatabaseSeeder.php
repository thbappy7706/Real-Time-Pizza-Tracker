<?php

namespace Database\Seeders;

use App\Models\Pizza;
use App\Models\Topping;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin User
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@pizza.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone' => '+1234567890',
            'address' => '123 Pizza Street, Food City',
        ]);

        // Create Customer User
        User::create([
            'name' => 'John Customer',
            'email' => 'customer@pizza.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
            'phone' => '+1234567891',
            'address' => '456 Customer Ave, Food City',
            'latitude' => 40.7128,
            'longitude' => -74.0060,
        ]);

        // Create Toppings
        $toppings = [
            // Meats
            ['name' => 'Pepperoni', 'price' => 1.50, 'category' => 'meat', 'is_vegetarian' => false],
            ['name' => 'Italian Sausage', 'price' => 1.75, 'category' => 'meat', 'is_vegetarian' => false],
            ['name' => 'Bacon', 'price' => 2.00, 'category' => 'meat', 'is_vegetarian' => false],
            ['name' => 'Ham', 'price' => 1.50, 'category' => 'meat', 'is_vegetarian' => false],
            ['name' => 'Chicken', 'price' => 2.00, 'category' => 'meat', 'is_vegetarian' => false],

            // Vegetables
            ['name' => 'Mushrooms', 'price' => 1.00, 'category' => 'vegetable', 'is_vegetarian' => true],
            ['name' => 'Bell Peppers', 'price' => 1.00, 'category' => 'vegetable', 'is_vegetarian' => true],
            ['name' => 'Onions', 'price' => 0.75, 'category' => 'vegetable', 'is_vegetarian' => true],
            ['name' => 'Black Olives', 'price' => 1.00, 'category' => 'vegetable', 'is_vegetarian' => true],
            ['name' => 'Tomatoes', 'price' => 1.00, 'category' => 'vegetable', 'is_vegetarian' => true],
            ['name' => 'Spinach', 'price' => 1.25, 'category' => 'vegetable', 'is_vegetarian' => true],
            ['name' => 'Jalapeños', 'price' => 0.75, 'category' => 'vegetable', 'is_vegetarian' => true],

            // Cheese
            ['name' => 'Mozzarella', 'price' => 1.50, 'category' => 'cheese', 'is_vegetarian' => true],
            ['name' => 'Cheddar', 'price' => 1.50, 'category' => 'cheese', 'is_vegetarian' => true],
            ['name' => 'Parmesan', 'price' => 1.75, 'category' => 'cheese', 'is_vegetarian' => true],
            ['name' => 'Feta', 'price' => 2.00, 'category' => 'cheese', 'is_vegetarian' => true],

            // Sauces
            ['name' => 'Tomato Sauce', 'price' => 0.00, 'category' => 'sauce', 'is_vegetarian' => true],
            ['name' => 'BBQ Sauce', 'price' => 0.50, 'category' => 'sauce', 'is_vegetarian' => true],
            ['name' => 'White Sauce', 'price' => 0.75, 'category' => 'sauce', 'is_vegetarian' => true],
        ];

        foreach ($toppings as $topping) {
            Topping::create($topping);
        }

        // Create Pizzas
        $pizzas = [
            [
                'name' => 'Margherita',
                'description' => 'Classic pizza with fresh mozzarella, tomato sauce, and basil',
                'base_price' => 12.99,
                'is_vegetarian' => true,
                'is_featured' => true,
                'preparation_time' => 15,
                'image_url' => 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002',
                'toppings' => [13, 17], // Mozzarella, Tomato Sauce
            ],
            [
                'name' => 'Pepperoni Classic',
                'description' => 'Traditional pepperoni pizza with extra cheese',
                'base_price' => 14.99,
                'is_vegetarian' => false,
                'is_featured' => true,
                'preparation_time' => 15,
                'image_url' => 'https://images.unsplash.com/photo-1628840042765-356cda07504e',
                'toppings' => [1, 13, 17], // Pepperoni, Mozzarella, Tomato Sauce
            ],
            [
                'name' => 'Meat Lovers',
                'description' => 'Loaded with pepperoni, sausage, bacon, and ham',
                'base_price' => 17.99,
                'is_vegetarian' => false,
                'is_featured' => true,
                'preparation_time' => 20,
                'image_url' => 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
                'toppings' => [1, 2, 3, 4, 13, 17], // All meats + cheese + sauce
            ],
            [
                'name' => 'Veggie Supreme',
                'description' => 'Fresh vegetables with mushrooms, peppers, onions, and olives',
                'base_price' => 15.99,
                'is_vegetarian' => true,
                'is_featured' => false,
                'preparation_time' => 18,
                'image_url' => 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f',
                'toppings' => [6, 7, 8, 9, 13, 17], // Veggies + cheese + sauce
            ],
            [
                'name' => 'BBQ Chicken',
                'description' => 'Grilled chicken with BBQ sauce, onions, and cheddar',
                'base_price' => 16.99,
                'is_vegetarian' => false,
                'is_featured' => true,
                'preparation_time' => 20,
                'image_url' => 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
                'toppings' => [5, 8, 14, 18], // Chicken, Onions, Cheddar, BBQ Sauce
            ],
            [
                'name' => 'Hawaiian',
                'description' => 'Ham and pineapple with mozzarella cheese',
                'base_price' => 14.99,
                'is_vegetarian' => false,
                'is_featured' => false,
                'preparation_time' => 15,
                'image_url' => 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
                'toppings' => [4, 13, 17], // Ham, Mozzarella, Tomato Sauce
            ],
        ];

        foreach ($pizzas as $pizzaData) {
            $toppingIds = $pizzaData['toppings'];
            unset($pizzaData['toppings']);

            $pizza = Pizza::create($pizzaData);

            // Attach default toppings
            $pizza->toppings()->attach(
                collect($toppingIds)->mapWithKeys(fn($id) => [$id => ['is_default' => true]])
            );
        }
    }
}
