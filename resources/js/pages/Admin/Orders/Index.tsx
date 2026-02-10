import { Head, Link, router } from '@inertiajs/react';
import { Eye, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { OrderStatusBadge } from '@/components/order-status-badge';
import { PaginationNav } from '@/components/pagination-nav';
import AppLayout from '@/layouts/app-layout';
import type { AdminOrderListItem, Paginated } from '@/types/pizza';

interface Props {
    orders: Paginated<AdminOrderListItem>;
}

const STATUS_OPTIONS = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'placed', label: 'Placed' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'baking', label: 'Baking' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'rejected', label: 'Rejected' },
];

export default function AdminOrdersIndex({ orders }: Props) {
    function filterByStatus(status: string) {
        if (status === 'all') {
            router.get('/admin/orders');
        } else {
            router.get('/admin/orders', { status }, { preserveState: true });
        }
    }

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Admin', href: '/admin/dashboard' },
                { title: 'Orders', href: '/admin/orders' },
            ]}
        >
            <Head title="Admin - Orders" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Orders</h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage all customer orders
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="size-4 text-muted-foreground" />
                        <Select onValueChange={filterByStatus} defaultValue="all">
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUS_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order #</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Items</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                                                No orders found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        orders.data.map((order) => (
                                            <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50">
                                                <TableCell className="font-bold">
                                                    #{order.order_number}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {order.customer_name}
                                                </TableCell>
                                                <TableCell>
                                                    <OrderStatusBadge
                                                        status={order.status}
                                                        label={order.status_label}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {order.items_count}
                                                </TableCell>
                                                <TableCell className="font-semibold">
                                                    ${Number(order.total).toFixed(2)}
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {order.created_at}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm" asChild className="gap-1.5">
                                                        <Link href={`/admin/orders/${order.id}`}>
                                                            <Eye className="size-4" />
                                                            View
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <PaginationNav links={orders.links} />
            </div>
        </AppLayout>
    );
}
