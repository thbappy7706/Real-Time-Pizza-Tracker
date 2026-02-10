<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Stripe\PaymentIntent;
use Stripe\Stripe;

class CheckoutController extends Controller
{
    public function __construct(
        private OrderService $orderService
    ) {}

    public function show(Order $order)
    {
        $this->authorize('view', $order);

        return Inertia::render('Checkout/Index', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'total' => $order->total,
                'subtotal' => $order->subtotal,
                'tax' => $order->tax,
                'delivery_fee' => $order->delivery_fee,
            ],
            'stripe_key' => config('services.stripe.key'),
        ]);
    }

    public function process(Request $request, Order $order)
    {
        $this->authorize('update', $order);

        $validated = $request->validate([
            'payment_method' => 'required|in:stripe,cash',
            'payment_method_id' => 'required_if:payment_method,stripe',
        ]);

        try {
            $paymentData = [
                'method' => $validated['payment_method'],
            ];

            if ($validated['payment_method'] === 'stripe') {
                Stripe::setApiKey(config('services.stripe.secret'));

                $intent = PaymentIntent::create([
                    'amount' => $order->total * 100, // Convert to cents
                    'currency' => 'usd',
                    'payment_method' => $validated['payment_method_id'],
                    'confirmation_method' => 'manual',
                    'confirm' => true,
                    'return_url' => route('orders.show', $order),
                ]);

                $paymentData['transaction_id'] = $intent->id;
                $paymentData['details'] = [
                    'payment_intent_id' => $intent->id,
                    'status' => $intent->status,
                ];
            } else {
                $paymentData['transaction_id'] = 'CASH-'.uniqid();
            }

            $order = $this->orderService->placeOrder($order, $paymentData);

            return redirect()
                ->route('orders.show', $order)
                ->with('success', 'Order placed successfully!');

        } catch (\Exception $e) {
            return back()->withErrors(['payment' => $e->getMessage()]);
        }
    }
}
