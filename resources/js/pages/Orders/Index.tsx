import { Head, Link, router } from '@inertiajs/react';
import { Package, Eye, XCircle, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { OrderStatusBadge } from '@/components/order-status-badge';
import { PaginationNav } from '@/components/pagination-nav';
import AppLayout from '@/layouts/app-layout';
import type { OrderListItem, Paginated } from '@/types/pizza';

interface Props {
    orders: Paginated<OrderListItem>;
}

export default function OrdersIndex({ orders }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'My Orders', href: '/orders' }]}>
            <Head title="My Orders" />

            <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">My Orders</h1>
                        <p className="mt-1 text-muted-foreground">
                            Track and manage your pizza orders
                        </p>
                    </div>
                    <Button asChild className="gap-2">
                        <Link href="/menu">
                            <ShoppingBag className="size-4" />
                            Order Now
                        </Link>
                    </Button>
                </div>

                {orders.data.length === 0 ? (
                    <div className="rounded-xl border-2 border-dashed p-12 text-center">
                        <Package className="mx-auto mb-4 size-12 text-muted-foreground/50" />
                        <h3 className="text-lg font-semibold">No orders yet</h3>
                        <p className="mt-1 text-muted-foreground">
                            Visit our menu to place your first order!
                        </p>
                        <Button asChild className="mt-4">
                            <Link href="/menu">Browse Menu</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.data.map((order) => (
                            <Card key={order.id} className="transition-all hover:shadow-md">
                                <CardContent className="p-5">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-bold text-lg">#{order.order_number}</h3>
                                                <OrderStatusBadge
                                                    status={order.status}
                                                    label={order.status_label}
                                                />
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {order.items_count} item{order.items_count !== 1 ? 's' : ''} • {order.created_at}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className="text-xl font-bold text-primary">
                                                ${Number(order.total).toFixed(2)}
                                            </span>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" asChild className="gap-1.5">
                                                    <Link href={`/orders/${order.id}`}>
                                                        <Eye className="size-3.5" />
                                                        View
                                                    </Link>
                                                </Button>
                                                {order.can_cancel && (
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        className="gap-1.5"
                                                        onClick={() => {
                                                            if (confirm('Are you sure you want to cancel this order?')) {
                                                                router.post(`/orders/${order.id}/cancel`);
                                                            }
                                                        }}
                                                    >
                                                        <XCircle className="size-3.5" />
                                                        Cancel
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        <PaginationNav links={orders.links} />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
