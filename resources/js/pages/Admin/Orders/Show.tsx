import { Head, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    CreditCard,
    Mail,
    MapPin,
    MessageSquare,
    Phone,
    Truck,
    User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { OrderStatusBadge } from '@/components/order-status-badge';
import AppLayout from '@/layouts/app-layout';
import type { AdminOrderDetail, Driver } from '@/types/pizza';
import { useState } from 'react';

interface Props {
    order: AdminOrderDetail;
    drivers: Driver[];
}

const NEXT_STATUSES: Record<string, { value: string; label: string }[]> = {
    pending: [{ value: 'accepted', label: 'Accept' }, { value: 'rejected', label: 'Reject' }],
    placed: [{ value: 'accepted', label: 'Accept' }, { value: 'rejected', label: 'Reject' }],
    accepted: [{ value: 'preparing', label: 'Start Preparing' }],
    preparing: [{ value: 'baking', label: 'Start Baking' }],
    baking: [{ value: 'out_for_delivery', label: 'Out for Delivery' }],
    out_for_delivery: [{ value: 'delivered', label: 'Mark Delivered' }],
};

export default function AdminOrderShow({ order, drivers }: Props) {
    const [rejectReason, setRejectReason] = useState('');
    const [showReject, setShowReject] = useState(false);

    const statusForm = useForm({ status: '', reason: '' });
    const driverForm = useForm({ driver_id: '' });

    const availableStatuses = NEXT_STATUSES[order.status] || [];

    function handleStatusUpdate(status: string) {
        if (status === 'rejected') {
            setShowReject(true);
            return;
        }
        router.patch(`/admin/orders/${order.id}/status`, { status }, { preserveScroll: true });
    }

    function handleReject() {
        router.patch(`/admin/orders/${order.id}/status`, {
            status: 'rejected',
            reason: rejectReason,
        }, { preserveScroll: true });
    }

    function handleAssignDriver(driverId: string) {
        router.post(`/admin/orders/${order.id}/assign-driver`, {
            driver_id: parseInt(driverId),
        }, { preserveScroll: true });
    }

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Admin', href: '/admin/dashboard' },
                { title: 'Orders', href: '/admin/orders' },
                { title: `#${order.order_number}`, href: `/admin/orders/${order.id}` },
            ]}
        >
            <Head title={`Admin - Order #${order.order_number}`} />

            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
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
                        <p className="mt-1 text-sm text-muted-foreground">{order.created_at}</p>
                    </div>
                    <OrderStatusBadge
                        status={order.status}
                        label={order.status_label}
                        className="text-sm px-4 py-1.5"
                    />
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left: Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Status Actions */}
                        {availableStatuses.length > 0 && (
                            <Card className="border-primary/20 bg-primary/5">
                                <CardHeader>
                                    <CardTitle className="text-base">Update Status</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {showReject ? (
                                        <div className="space-y-3">
                                            <Label>Rejection Reason</Label>
                                            <Textarea
                                                value={rejectReason}
                                                onChange={(e) => setRejectReason(e.target.value)}
                                                placeholder="Enter reason for rejection..."
                                                rows={2}
                                            />
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="destructive"
                                                    onClick={handleReject}
                                                    disabled={!rejectReason.trim()}
                                                >
                                                    Confirm Rejection
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => setShowReject(false)}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {availableStatuses.map((s) => (
                                                <Button
                                                    key={s.value}
                                                    variant={s.value === 'rejected' ? 'destructive' : 'default'}
                                                    onClick={() => handleStatusUpdate(s.value)}
                                                    className="gap-1.5"
                                                >
                                                    {s.label}
                                                </Button>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Driver Assignment */}
                        {!['delivered', 'cancelled', 'rejected'].includes(order.status) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <Truck className="size-4" />
                                        Assign Driver
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-3">
                                        <Select
                                            onValueChange={handleAssignDriver}
                                            defaultValue={order.delivery?.driver_id?.toString() || ''}
                                        >
                                            <SelectTrigger className="w-64">
                                                <SelectValue placeholder="Select a driver" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {drivers.map((driver) => (
                                                    <SelectItem key={driver.id} value={driver.id.toString()}>
                                                        {driver.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {order.delivery?.driver_name && (
                                            <span className="text-sm text-muted-foreground">
                                                Currently: <strong>{order.delivery.driver_name}</strong>
                                            </span>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Order Items */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Order Items</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
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
                    </div>

                    {/* Right: Customer & Summary */}
                    <div className="space-y-6">
                        {/* Customer Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <User className="size-4" />
                                    Customer
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <User className="size-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">{order.customer_name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="size-4 text-muted-foreground" />
                                    <span className="text-sm">{order.customer_email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="size-4 text-muted-foreground" />
                                    <span className="text-sm">{order.customer_phone}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <MapPin className="mt-0.5 size-4 text-muted-foreground shrink-0" />
                                    <span className="text-sm">{order.delivery_address}</span>
                                </div>
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
                                <CardContent className="space-y-2 text-sm">
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
                                <CardTitle className="text-base">Order Total</CardTitle>
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
