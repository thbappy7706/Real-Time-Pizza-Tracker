<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('toppings', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('price', 6, 2)->default(0);
            $table->enum('category', ['meat', 'vegetable', 'cheese', 'sauce', 'other'])->default('other');
            $table->boolean('is_available')->default(true);
            $table->boolean('is_vegetarian')->default(true);
            $table->timestamps();
            $table->softDeletes();
            $table->index('category');
            $table->index('is_available');
        });

        Schema::create('pizza_topping', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pizza_id')->constrained()->cascadeOnDelete();
            $table->foreignId('topping_id')->constrained()->cascadeOnDelete();
            $table->boolean('is_default')->default(true);
            $table->timestamps();
            $table->unique(['pizza_id', 'topping_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pizza_topping');
        Schema::dropIfExists('toppings');
    }
};
