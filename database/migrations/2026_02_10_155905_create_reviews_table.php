<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('pizza_id')->nullable()->constrained()->nullOnDelete();
            $table->integer('rating')->unsigned();
            $table->text('comment')->nullable();
            $table->integer('food_rating')->unsigned()->nullable();
            $table->integer('delivery_rating')->unsigned()->nullable();
            $table->timestamps();

            $table->index('order_id');
            $table->index('user_id');
            $table->index('pizza_id');
            $table->index('rating');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
