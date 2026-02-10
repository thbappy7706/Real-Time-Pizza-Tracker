import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    DollarSign,
    Eye,
    Package,
    ShoppingCart,
    TrendingUp,
    Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { OrderStatusBadge } from '@/components/order-status-badge';
import AppLayout from '@/layouts/app-layout';
import type { ActiveOrder, DashboardStats } from '@/types/pizza';

interface Props {
    stats: DashboardStats;
    activeOrders: ActiveOrder[];
}

export default function AdminDashboard({ stats, activeOrders }: Props) {
    const statCards = [
        {
            title: 'Orders Today',
            value: stats.total_orders_today,
            icon: ShoppingCart,
            color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400',
        },
        {
            title: 'Active Orders',
            value: stats.active_orders,
            icon: Activity,
            color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400',
        },
        {
            title: 'Revenue Today',
            value: `$${Number(stats.total_revenue_today).toFixed(2)}`,
            icon: DollarSign,
            color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400',
        },
        {
            title: 'Total Customers',
            value: stats.total_customers,
            icon: Users,
            color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400',
        },
    ];

    return (
        <AppLayout breadcrumbs={[{ title: 'Admin', href: '/admin/dashboard' }, { title: 'Dashboard', href: '/admin/dashboard' }]}>
            <Head title="Admin Dashboard" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="mt-1 text-muted-foreground">
                        Overview of your pizza business
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat) => (
                        <Card key={stat.title} className="transition-all hover:shadow-md">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            {stat.title}
                                        </p>
                                        <p className="mt-2 text-3xl font-bold tracking-tight">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div className={`rounded-xl p-3 ${stat.color}`}>
                                        <stat.icon className="size-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Active Orders */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="size-5" />
                            Active Orders
                        </CardTitle>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/admin/orders">View All</Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {activeOrders.length === 0 ? (
                            <div className="rounded-lg border-2 border-dashed p-8 text-center">
                                <Package className="mx-auto mb-3 size-10 text-muted-foreground/50" />
                                <p className="text-muted-foreground">No active orders right now</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Order</TableHead>
                                            <TableHead>Customer</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Items</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Time</TableHead>
                                            <TableHead>Driver</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {activeOrders.map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-bold">#{order.order_number}</TableCell>
                                                <TableCell>
                                                    <div>
                                                        <span className="font-medium">{order.customer_name}</span>
                                                        <p className="text-xs text-muted-foreground">{order.customer_phone}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <OrderStatusBadge
                                                        status={order.status}
                                                        label={order.status_label}
                                                    />
                                                </TableCell>
                                                <TableCell>{order.items_count}</TableCell>
                                                <TableCell className="font-semibold">
                                                    ${Number(order.total).toFixed(2)}
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {order.created_at}
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {order.driver_name || (
                                                        <span className="text-muted-foreground">Unassigned</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/admin/orders/${order.id}`}>
                                                            <Eye className="size-4" />
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
