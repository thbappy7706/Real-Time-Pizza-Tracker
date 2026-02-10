import { Head, Link, router } from '@inertiajs/react';
import {
    Clock,
    Leaf,
    Search,
    Star,
    Sparkles,
    Pizza as PizzaIcon,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import type { Pizza, Topping } from '@/types/pizza';

interface Props {
    pizzas: Pizza[];
    toppings: Record<string, Topping[]>;
}

export default function MenuIndex({ pizzas }: Props) {
    const [search, setSearch] = useState('');
    const [vegOnly, setVegOnly] = useState(false);

    const filtered = pizzas.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesVeg = !vegOnly || p.is_vegetarian;
        return matchesSearch && matchesVeg;
    });

    const featured = filtered.filter((p) => p.is_featured);
    const regular = filtered.filter((p) => !p.is_featured);

    return (
        <AppLayout breadcrumbs={[{ title: 'Menu', href: '/menu' }]}>
            <Head title="Menu" />

            <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
                {/* Hero Header */}
                <div className="mb-10 text-center">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                        <PizzaIcon className="size-4" />
                        Fresh from the oven
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                        Our <span className="text-primary">Menu</span>
                    </h1>
                    <p className="mt-3 text-muted-foreground text-lg">
                        Handcrafted pizzas made with love and the freshest ingredients
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search pizzas..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Button
                        variant={vegOnly ? 'default' : 'outline'}
                        onClick={() => setVegOnly(!vegOnly)}
                        className="gap-2"
                    >
                        <Leaf className="size-4" />
                        Vegetarian
                    </Button>
                </div>

                {/* Featured Section */}
                {featured.length > 0 && (
                    <div className="mb-10">
                        <div className="mb-5 flex items-center gap-2">
                            <Sparkles className="size-5 text-yellow-500" />
                            <h2 className="text-2xl font-bold">Featured</h2>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {featured.map((pizza) => (
                                <PizzaCard key={pizza.id} pizza={pizza} featured />
                            ))}
                        </div>
                    </div>
                )}

                {/* All Pizzas */}
                <div>
                    <h2 className="mb-5 text-2xl font-bold">
                        {featured.length > 0 ? 'All Pizzas' : 'Our Pizzas'}
                    </h2>
                    {regular.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {regular.map((pizza) => (
                                <PizzaCard key={pizza.id} pizza={pizza} />
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="rounded-xl border-2 border-dashed p-12 text-center">
                            <PizzaIcon className="mx-auto mb-4 size-12 text-muted-foreground/50" />
                            <h3 className="text-lg font-semibold">No pizzas found</h3>
                            <p className="mt-1 text-muted-foreground">
                                Try adjusting your search or filters
                            </p>
                        </div>
                    ) : null}
                </div>
            </div>
        </AppLayout>
    );
}

function PizzaCard({ pizza, featured = false }: { pizza: Pizza; featured?: boolean }) {
    return (
        <Link href={`/menu/${pizza.id}`} className="group block">
            <Card
                className={`overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${featured ? 'ring-2 ring-primary/20' : ''}`}
            >
                {/* Image area */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
                    {pizza.image_url ? (
                        <img
                            src={pizza.image_url}
                            alt={pizza.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <PizzaIcon className="size-20 text-primary/20" />
                        </div>
                    )}
                    {featured && (
                        <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-yellow-500 px-2.5 py-1 text-xs font-bold text-white shadow-md">
                            <Sparkles className="size-3" />
                            Featured
                        </div>
                    )}
                    {pizza.is_vegetarian && (
                        <div className="absolute right-3 top-3 rounded-full bg-emerald-500 p-1.5 shadow-md">
                            <Leaf className="size-3.5 text-white" />
                        </div>
                    )}
                </div>

                <CardContent className="p-5">
                    <div className="mb-2 flex items-start justify-between gap-2">
                        <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                            {pizza.name}
                        </h3>
                        <span className="shrink-0 rounded-lg bg-primary px-3 py-1 text-sm font-bold text-primary-foreground">
                            ${Number(pizza.base_price).toFixed(2)}
                        </span>
                    </div>

                    <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                        {pizza.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">
                                {pizza.average_rating > 0
                                    ? pizza.average_rating.toFixed(1)
                                    : 'New'}
                            </span>
                            {pizza.reviews_count > 0 && (
                                <span>({pizza.reviews_count})</span>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="size-3.5" />
                            <span>{pizza.preparation_time} min</span>
                        </div>
                    </div>

                    {pizza.default_toppings.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                            {pizza.default_toppings.slice(0, 3).map((t) => (
                                <span
                                    key={t.id}
                                    className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                                >
                                    {t.name}
                                </span>
                            ))}
                            {pizza.default_toppings.length > 3 && (
                                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                                    +{pizza.default_toppings.length - 3} more
                                </span>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </Link>
    );
}
