import { Head, Link, router } from '@inertiajs/react';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { PaginationNav } from '@/components/pagination-nav';
import AppLayout from '@/layouts/app-layout';
import type { AdminPizzaListItem, Paginated } from '@/types/pizza';

interface Props {
    pizzas: Paginated<AdminPizzaListItem>;
}

export default function AdminPizzasIndex({ pizzas }: Props) {
    function handleDelete(id: number, name: string) {
        if (confirm(`Are you sure you want to delete "${name}"?`)) {
            router.delete(`/admin/pizzas/${id}`);
        }
    }

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Admin', href: '/admin/dashboard' },
                { title: 'Pizzas', href: '/admin/pizzas' },
            ]}
        >
            <Head title="Admin - Pizzas" />

            <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Pizzas</h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage your pizza menu
                        </p>
                    </div>
                    <Button asChild className="gap-2">
                        <Link href="/admin/pizzas/create">
                            <Plus className="size-4" />
                            Add Pizza
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Available</TableHead>
                                        <TableHead>Featured</TableHead>
                                        <TableHead>Reviews</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pizzas.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                                                No pizzas found. Create your first pizza!
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        pizzas.data.map((pizza) => (
                                            <TableRow key={pizza.id}>
                                                <TableCell className="font-bold">{pizza.name}</TableCell>
                                                <TableCell className="font-semibold">
                                                    ${Number(pizza.base_price).toFixed(2)}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={pizza.is_available ? 'default' : 'secondary'}>
                                                        {pizza.is_available ? 'Yes' : 'No'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {pizza.is_featured && (
                                                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 border-yellow-300 dark:text-yellow-400 dark:border-yellow-700">
                                                            ⭐ Featured
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {pizza.reviews_count}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button variant="ghost" size="sm" asChild>
                                                            <Link href={`/admin/pizzas/${pizza.id}/edit`}>
                                                                <Edit className="size-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-destructive hover:text-destructive"
                                                            onClick={() => handleDelete(pizza.id, pizza.name)}
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                <PaginationNav links={pizzas.links} />
            </div>
        </AppLayout>
    );
}
