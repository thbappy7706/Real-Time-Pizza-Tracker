<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Events\OrderPlaced;
use App\Events\OrderStatusUpdated;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function createOrder(array $data, int $userId): Order
    {
        return DB::transaction(function () use ($data, $userId) {
            // Calculate totals
            $subtotal = 0;
            foreach ($data['items'] as $item) {
                $subtotal += $item['item_total'];
            }

            $tax = $subtotal * 0.08; // 8% tax
            $deliveryFee = 5.00;
            $total = $subtotal + $tax + $deliveryFee;

            // Create order
            $order = Order::create([
                'user_id' => $userId,
                'status' => OrderStatus::PENDING,
                'subtotal' => $subtotal,
                'tax' => $tax,
                'delivery_fee' => $deliveryFee,
                'total' => $total,
                'delivery_address' => $data['delivery_address'],
                'delivery_latitude' => $data['delivery_latitude'] ?? null,
                'delivery_longitude' => $data['delivery_longitude'] ?? null,
                'customer_phone' => $data['customer_phone'],
                'special_instructions' => $data['special_instructions'] ?? null,
            ]);

            // Create order items
            foreach ($data['items'] as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'pizza_id' => $item['pizza_id'],
                    'quantity' => $item['quantity'],
                    'size' => $item['size'],
                    'crust' => $item['crust'],
                    'base_price' => $item['base_price'],
                    'size_price' => $item['size_price'],
                    'crust_price' => $item['crust_price'],
                    'toppings_price' => $item['toppings_price'],
                    'item_total' => $item['item_total'],
                    'selected_toppings' => $item['selected_toppings'] ?? [],
                ]);
            }

            return $order->load(['items.pizza', 'user']);
        });
    }

    public function placeOrder(Order $order, array $paymentData): Order
    {
        return DB::transaction(function () use ($order, $paymentData) {
            // Create payment
            $payment = Payment::create([
                'order_id' => $order->id,
                'payment_method' => $paymentData['method'],
                'transaction_id' => $paymentData['transaction_id'] ?? null,
                'amount' => $order->total,
                'status' => 'completed',
                'payment_details' => $paymentData['details'] ?? null,
                'paid_at' => now(),
            ]);

            // Update order status
            $order->update([
                'status' => OrderStatus::PLACED,
            ]);

            // Broadcast event
            broadcast(new OrderPlaced($order))->toOthers();

            return $order->fresh(['items.pizza', 'user', 'payment']);
        });
    }

    public function updateStatus(Order $order, OrderStatus $newStatus, ?string $reason = null): Order
    {
        $previousStatus = $order->status->value;

        $updateData = ['status' => $newStatus];

        if ($newStatus === OrderStatus::ACCEPTED) {
            $updateData['accepted_at'] = now();
            $updateData['estimated_delivery_time'] = now()->addMinutes(30);
        } elseif ($newStatus === OrderStatus::DELIVERED) {
            $updateData['delivered_at'] = now();
        } elseif ($newStatus === OrderStatus::REJECTED) {
            $updateData['rejection_reason'] = $reason;
        }

        $order->update($updateData);

        // Broadcast event
        broadcast(new OrderStatusUpdated($order, $previousStatus))->toOthers();

        return $order->fresh();
    }

    public function cancelOrder(Order $order, ?string $reason = null): Order
    {
        if (!$order->canBeCancelled()) {
            throw new \Exception('Order cannot be cancelled at this stage.');
        }

        return $this->updateStatus($order, OrderStatus::CANCELLED, $reason);
    }

    public function calculateItemTotal(array $itemData): float
    {
        $basePrice = $itemData['base_price'];
        $sizeMultiplier = OrderItem::getSizeMultiplier($itemData['size']);
        $crustPrice = OrderItem::getCrustPrice($itemData['crust']);
        
        $toppingsPrice = 0;
        if (!empty($itemData['selected_toppings'])) {
            foreach ($itemData['selected_toppings'] as $topping) {
                $toppingsPrice += $topping['price'];
            }
        }

        $itemTotal = ($basePrice * $sizeMultiplier) + $crustPrice + $toppingsPrice;
        
        return round($itemTotal * $itemData['quantity'], 2);
    }
}
