import { Head, Link, usePage } from '@inertiajs/react';
import { useEchoPresence } from '@laravel/echo-react';
import {
    Activity,
    Bell,
    DollarSign,
    Eye,
    Package,
    ShoppingCart,
    TrendingUp,
    Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { playNotificationSoundDoubleBeep } from '@/utils/notification-sound';
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

interface ChartData {
    name: string;
    orders: number;
    revenue: number;
}

interface StatusDistribution {
    status: string;
    count: number;
}

interface Props {
    stats: DashboardStats;
    activeOrders: ActiveOrder[];
    weeklyData: ChartData[];
    statusDistribution: StatusDistribution[];
}

export default function AdminDashboard({
    stats: initialStats,
    activeOrders: initialActiveOrders,
    weeklyData: initialWeeklyData,
    statusDistribution: initialStatusDistribution,
}: Props) {
    const { auth } = usePage().props as any;

    // State for real-time updates
    const [stats, setStats] = useState(initialStats);
    const [activeOrders, setActiveOrders] = useState(initialActiveOrders);
    const [weeklyData, setWeeklyData] = useState(initialWeeklyData);
    const [statusDistribution, setStatusDistribution] = useState(initialStatusDistribution);

    // Listen for new orders on admin.dashboard presence channel
    const { channel } = useEchoPresence('admin.dashboard');

    useEffect(() => {
        const ch = channel();
        if (!ch) {
            console.warn('⚠️ Admin dashboard channel not available');
            return;
        }

        console.log('✅ Admin dashboard subscribed to presence channel');

        const handleOrderPlaced = (event: any) => {
            console.log('🍕 NEW ORDER EVENT RECEIVED:', event);

            // Play notification sound
            playNotificationSoundDoubleBeep();

            // Show toast notification
            toast.success('🍕 New Order Received!', {
                description: `Order #${event.order.order_number} from ${event.order.customer_name} - $${Number(event.order.total).toFixed(2)}`,
                action: {
                    label: 'View',
                    onClick: () => {
                        window.location.href = `/admin/orders/${event.order.id}`;
                    },
                },
                duration: 8000,
            });

            // Update stats
            setStats(prev => ({
                ...prev,
                total_orders_today: prev.total_orders_today + 1,
                active_orders: prev.active_orders + 1,
            }));

            // Add new order to active orders list
            setActiveOrders(prev => [{
                id: event.order.id,
                order_number: event.order.order_number,
                customer_name: event.order.customer_name,
                customer_phone: '',
                status: event.order.status,
                status_label: 'Placed',
                total: event.order.total,
                items_count: event.order.items_count,
                delivery_address: '',
                created_at: 'Just now',
                estimated_delivery_time: null,
                driver_name: null,
            }, ...prev]);

            // Update weekly data (today's data)
            setWeeklyData(prev => {
                const updated = [...prev];
                const todayIndex = updated.length - 1; // Last item is today
                if (updated[todayIndex]) {
                    updated[todayIndex] = {
                        ...updated[todayIndex],
                        orders: updated[todayIndex].orders + 1,
                    };
                }
                return updated;
            });

            // Update status distribution
            setStatusDistribution(prev => {
                const placedIndex = prev.findIndex(s => s.status === 'Placed');
                if (placedIndex >= 0) {
                    const updated = [...prev];
                    updated[placedIndex] = {
                        ...updated[placedIndex],
                        count: updated[placedIndex].count + 1,
                    };
                    return updated;
                } else {
                    return [...prev, { status: 'Placed', count: 1 }];
                }
            });
        };

        const handleStatusUpdated = (event: any) => {
            console.log('📦 STATUS UPDATE EVENT RECEIVED:', event);

            toast.info('📦 Order Status Updated', {
                description: `Order #${event.order_number} is now ${event.status_label}`,
                duration: 5000,
            });

            // Update active orders list
            setActiveOrders(prev =>
                prev.map(order =>
                    order.id === event.order_id
                        ? {
                            ...order,
                            status: event.status,
                            status_label: event.status_label,
                            estimated_delivery_time: event.estimated_delivery_time ? new Date(event.estimated_delivery_time).toLocaleTimeString() : null,
                        }
                        : order
                ).filter(order => {
                    // Remove from active orders if delivered or cancelled
                    return !['delivered', 'cancelled', 'rejected'].includes(order.status);
                })
            );

            // Update active orders count
            setStats(prev => ({
                ...prev,
                active_orders: prev.active_orders + (['delivered', 'cancelled', 'rejected'].includes(event.status) ? -1 : 0),
                total_revenue_today: prev.total_revenue_today + (event.status === 'delivered' ? parseFloat(event.order_total || 0) : 0),
            }));

            // Update status distribution
            setStatusDistribution(prev => {
                const updated = [...prev];

                // Decrease previous status count
                const prevStatusIndex = updated.findIndex(s =>
                    s.status.toLowerCase().replace(/\s/g, '_') === event.previous_status
                );
                if (prevStatusIndex >= 0 && updated[prevStatusIndex].count > 0) {
                    updated[prevStatusIndex] = {
                        ...updated[prevStatusIndex],
                        count: updated[prevStatusIndex].count - 1,
                    };
                }

                // Increase new status count
                const newStatusLabel = event.status_label.replace(/_/g, ' ');
                const newStatusIndex = updated.findIndex(s => s.status === newStatusLabel);
                if (newStatusIndex >= 0) {
                    updated[newStatusIndex] = {
                        ...updated[newStatusIndex],
                        count: updated[newStatusIndex].count + 1,
                    };
                } else {
                    updated.push({ status: newStatusLabel, count: 1 });
                }

                return updated.filter(s => s.count > 0);
            });
        };

        console.log('👂 Listening for .order.placed and .order.status.updated events...');
        ch.listen('.order.placed', handleOrderPlaced);
        ch.listen('.order.status.updated', handleStatusUpdated);

        return () => {
            console.log('🔇 Unsubscribing from admin.dashboard');
            ch.stopListening('.order.placed');
            ch.stopListening('.order.status.updated');
        };
    }, [channel]);

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
        <AppLayout
            breadcrumbs={[
                { title: 'Admin', href: '/admin/dashboard' },
                { title: 'Dashboard', href: '/admin/dashboard' },
            ]}
        >
            <Head title="Admin Dashboard" />

            <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="mt-1 text-muted-foreground">
                            Overview of your pizza business
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Bell className="size-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                            Real-time notifications enabled
                        </span>
                    </div>
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

                {/* Charts Row */}
                <div className="mb-8 grid gap-6 lg:grid-cols-2">
                    {/* Weekly Revenue & Orders Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="size-5" />
                                Weekly Performance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={weeklyData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis
                                        dataKey="name"
                                        className="text-xs"
                                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                    />
                                    <YAxis
                                        className="text-xs"
                                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px',
                                        }}
                                    />
                                    <Legend />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#10b981"
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                        name="Revenue ($)"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="orders"
                                        stroke="#3b82f6"
                                        fillOpacity={1}
                                        fill="url(#colorOrders)"
                                        name="Orders"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Order Status Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="size-5" />
                                Order Status Distribution
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={statusDistribution}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis
                                        dataKey="status"
                                        className="text-xs"
                                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                    />
                                    <YAxis
                                        className="text-xs"
                                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px',
                                        }}
                                    />
                                    <Bar
                                        dataKey="count"
                                        fill="#f97316"
                                        radius={[8, 8, 0, 0]}
                                        name="Orders"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Active Orders */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="size-5" />
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
                                                <TableCell className="font-bold">
                                                    #{order.order_number}
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <span className="font-medium">
                                                            {order.customer_name}
                                                        </span>
                                                        <p className="text-xs text-muted-foreground">
                                                            {order.customer_phone}
                                                        </p>
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
                                                        <span className="text-muted-foreground">
                                                            Unassigned
                                                        </span>
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
