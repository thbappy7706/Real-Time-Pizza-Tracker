import { Head, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    Clock,
    MapPin,
    Phone,
    Star,
    Truck,
    User,
    XCircle,
    CreditCard,
    MessageSquare,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { OrderStatusBadge } from '@/components/order-status-badge';
import AppLayout from '@/layouts/app-layout';
import type { OrderDetail } from '@/types/pizza';

interface Props {
    order: OrderDetail;
}

const PROGRESS_STEPS = [
    { key: 'placed', label: 'Placed' },
    { key: 'accepted', label: 'Accepted' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'baking', label: 'Baking' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' },
];

export default function OrderShow({ order }: Props) {
    const [showReview, setShowReview] = useState(false);
    const reviewForm = useForm({
        rating: 5,
        comment: '',
        food_rating: 5,
        delivery_rating: 5,
    });

    const isCancelled = order.status === 'cancelled' || order.status === 'rejected';
    const currentStepIndex = PROGRESS_STEPS.findIndex((s) => s.key === order.status);

    function submitReview(e: React.FormEvent) {
        e.preventDefault();
        reviewForm.post(`/orders/${order.id}/review`, {
            onSuccess: () => setShowReview(false),
        });
    }

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'My Orders', href: '/orders' },
                { title: `#${order.order_number}`, href: `/orders/${order.id}` },
            ]}
        >
            <Head title={`Order #${order.order_number}`} />

            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <Button
                    variant="ghost"
                    className="mb-6 gap-2"
                    onClick={() => window.history.back()}
                >
                    <ArrowLeft className="size-4" />
                    Back to Orders
                </Button>

                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Order #{order.order_number}</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Placed on {order.created_at}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <OrderStatusBadge status={order.status} label={order.status_label} className="text-sm px-3 py-1" />
                        {order.can_cancel && (
                            <Button
                                variant="destructive"
                                size="sm"
                                className="gap-1.5"
                                onClick={() => {
                                    if (confirm('Cancel this order?')) {
                                        router.post(`/orders/${order.id}/cancel`);
                                    }
                                }}
                            >
                                <XCircle className="size-4" />
                                Cancel Order
                            </Button>
                        )}
                    </div>
                </div>

                {/* Progress Tracker */}
                {!isCancelled && (
                    <Card className="mb-6">
                        <CardContent className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="font-semibold">Order Progress</h3>
                                {order.estimated_delivery_time && (
                                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Clock className="size-3.5" />
                                        ETA: {order.estimated_delivery_time}
                                    </span>
                                )}
                            </div>
                            <Progress value={order.progress_percentage} className="mb-4 h-2" />
                            <div className="flex justify-between">
                                {PROGRESS_STEPS.map((step, i) => (
                                    <div
                                        key={step.key}
                                        className={`flex flex-col items-center gap-1 ${i <= currentStepIndex ? 'text-primary' : 'text-muted-foreground/40'}`}
                                    >
                                        <div
                                            className={`flex size-7 items-center justify-center rounded-full text-xs font-bold ${i <= currentStepIndex
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted text-muted-foreground'
                                                }`}
                                        >
                                            {i < currentStepIndex ? <Check className="size-3.5" /> : i + 1}
                                        </div>
                                        <span className="hidden text-[10px] font-medium sm:block">{step.label}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left: Items & Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Items */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Order Items</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {order.items.map((item, i) => (
                                    <div key={i} className="flex items-start justify-between gap-4 rounded-lg border p-4">
                                        <div className="space-y-1">
                                            <h4 className="font-semibold">{item.pizza_name}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {item.size} • {item.crust} crust • Qty: {item.quantity}
                                            </p>
                                            {item.selected_toppings && item.selected_toppings.length > 0 && (
                                                <p className="text-xs text-muted-foreground">
                                                    Toppings: {item.selected_toppings.join(', ')}
                                                </p>
                                            )}
                                        </div>
                                        <span className="shrink-0 font-bold">${Number(item.item_total).toFixed(2)}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Special Instructions */}
                        {order.special_instructions && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <MessageSquare className="size-4" />
                                        Special Instructions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{order.special_instructions}</p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Review Form */}
                        {order.can_review && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Leave a Review</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {!showReview ? (
                                        <Button onClick={() => setShowReview(true)} className="gap-2">
                                            <Star className="size-4" />
                                            Write a Review
                                        </Button>
                                    ) : (
                                        <form onSubmit={submitReview} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>Overall Rating</Label>
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map((r) => (
                                                        <button
                                                            key={r}
                                                            type="button"
                                                            onClick={() => reviewForm.setData('rating', r)}
                                                            className="focus:outline-none"
                                                        >
                                                            <Star
                                                                className={`size-7 transition-colors ${r <= reviewForm.data.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30 hover:text-yellow-300'}`}
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Food Rating</Label>
                                                    <div className="flex gap-1">
                                                        {[1, 2, 3, 4, 5].map((r) => (
                                                            <button
                                                                key={r}
                                                                type="button"
                                                                onClick={() => reviewForm.setData('food_rating', r)}
                                                                className="focus:outline-none"
                                                            >
                                                                <Star
                                                                    className={`size-5 transition-colors ${r <= reviewForm.data.food_rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`}
                                                                />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Delivery Rating</Label>
                                                    <div className="flex gap-1">
                                                        {[1, 2, 3, 4, 5].map((r) => (
                                                            <button
                                                                key={r}
                                                                type="button"
                                                                onClick={() => reviewForm.setData('delivery_rating', r)}
                                                                className="focus:outline-none"
                                                            >
                                                                <Star
                                                                    className={`size-5 transition-colors ${r <= reviewForm.data.delivery_rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`}
                                                                />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Comment</Label>
                                                <Textarea
                                                    value={reviewForm.data.comment}
                                                    onChange={(e) => reviewForm.setData('comment', e.target.value)}
                                                    placeholder="Tell us about your experience..."
                                                    rows={3}
                                                />
                                            </div>

                                            <div className="flex gap-2">
                                                <Button type="submit" disabled={reviewForm.processing}>
                                                    Submit Review
                                                </Button>
                                                <Button type="button" variant="ghost" onClick={() => setShowReview(false)}>
                                                    Cancel
                                                </Button>
                                            </div>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right: Summary */}
                    <div className="space-y-6">
                        {/* Delivery Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Delivery Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-start gap-2">
                                    <MapPin className="mt-0.5 size-4 text-muted-foreground shrink-0" />
                                    <span className="text-sm">{order.delivery_address}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="size-4 text-muted-foreground" />
                                    <span className="text-sm">{order.customer_phone}</span>
                                </div>
                                {order.delivery?.driver_name && (
                                    <div className="flex items-center gap-2">
                                        <Truck className="size-4 text-muted-foreground" />
                                        <span className="text-sm">{order.delivery.driver_name}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Payment */}
                        {order.payment && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <CreditCard className="size-4" />
                                        Payment
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Method</span>
                                        <span className="capitalize font-medium">{order.payment.method}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Status</span>
                                        <span className="capitalize font-medium">{order.payment.status}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Price Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
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
                                <div className="flex justify-between text-base font-bold">
                                    <span>Total</span>
                                    <span className="text-primary">${Number(order.total).toFixed(2)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
