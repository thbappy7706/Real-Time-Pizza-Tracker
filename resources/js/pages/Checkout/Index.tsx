import { Head, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    CreditCard,
    Banknote,
    ShieldCheck,
    Loader2,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import type { CheckoutOrder } from '@/types/pizza';

interface Props {
    order: CheckoutOrder;
    stripe_key: string | null;
}

export default function CheckoutIndex({ order, stripe_key }: Props) {
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'stripe'>('cash');
    const [loading, setLoading] = useState(false);
    const { errors } = usePage().props as any;

    function handleCheckout() {
        setLoading(true);

        const data: any = {
            payment_method: paymentMethod,
        };

        if (paymentMethod === 'stripe') {
            data.payment_method_id = 'pm_card_visa'; // placeholder for demo
        }

        router.post(`/checkout/${order.id}`, data, {
            onFinish: () => setLoading(false),
        });
    }

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'My Orders', href: '/orders' },
                { title: 'Checkout', href: `/checkout/${order.id}` },
            ]}
        >
            <Head title="Checkout" />

            <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
                <Button
                    variant="ghost"
                    className="mb-6 gap-2"
                    onClick={() => window.history.back()}
                >
                    <ArrowLeft className="size-4" />
                    Back
                </Button>

                <div className="mb-8 text-center">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                        <ShieldCheck className="size-4" />
                        Secure Checkout
                    </div>
                    <h1 className="text-3xl font-bold">Complete Your Order</h1>
                    <p className="mt-2 text-muted-foreground">
                        Order #{order.order_number}
                    </p>
                </div>

                {errors?.payment && (
                    <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
                        {errors.payment}
                    </div>
                )}

                <div className="space-y-6">
                    {/* Order Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>${Number(order.subtotal).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tax</span>
                                <span>${Number(order.tax).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Delivery Fee</span>
                                <span>${Number(order.delivery_fee).toFixed(2)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span className="text-primary">${Number(order.total).toFixed(2)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Method */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('cash')}
                                className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${paymentMethod === 'cash'
                                    ? 'border-primary bg-primary/5 shadow-sm'
                                    : 'border-transparent hover:border-muted-foreground/20'
                                    }`}
                            >
                                <div className={`flex size-10 items-center justify-center rounded-lg ${paymentMethod === 'cash' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                    <Banknote className="size-5" />
                                </div>
                                <div>
                                    <span className="font-semibold">Cash on Delivery</span>
                                    <p className="text-xs text-muted-foreground">Pay when your order arrives</p>
                                </div>
                                <div className={`ml-auto size-5 rounded-full border-2 ${paymentMethod === 'cash' ? 'border-primary bg-primary' : 'border-muted-foreground/30'}`}>
                                    {paymentMethod === 'cash' && (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <div className="size-2 rounded-full bg-primary-foreground" />
                                        </div>
                                    )}
                                </div>
                            </button>

                            {stripe_key && (
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod('stripe')}
                                    className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${paymentMethod === 'stripe'
                                        ? 'border-primary bg-primary/5 shadow-sm'
                                        : 'border-transparent hover:border-muted-foreground/20'
                                        }`}
                                >
                                    <div className={`flex size-10 items-center justify-center rounded-lg ${paymentMethod === 'stripe' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                        <CreditCard className="size-5" />
                                    </div>
                                    <div>
                                        <span className="font-semibold">Credit Card</span>
                                        <p className="text-xs text-muted-foreground">Pay securely with Stripe</p>
                                    </div>
                                    <div className={`ml-auto size-5 rounded-full border-2 ${paymentMethod === 'stripe' ? 'border-primary bg-primary' : 'border-muted-foreground/30'}`}>
                                        {paymentMethod === 'stripe' && (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <div className="size-2 rounded-full bg-primary-foreground" />
                                            </div>
                                        )}
                                    </div>
                                </button>
                            )}
                        </CardContent>
                    </Card>

                    <Button
                        size="lg"
                        className="w-full gap-2 text-base"
                        onClick={handleCheckout}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="size-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <ShieldCheck className="size-5" />
                                Pay ${Number(order.total).toFixed(2)}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
