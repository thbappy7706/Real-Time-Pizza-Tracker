import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { AdminPizzaEdit, Topping } from '@/types/pizza';

interface Props {
    pizza: AdminPizzaEdit;
    toppings: Topping[];
}

export default function AdminPizzasEdit({ pizza, toppings }: Props) {
    const form = useForm({
        name: pizza.name,
        description: pizza.description,
        base_price: String(pizza.base_price),
        preparation_time: String(pizza.preparation_time),
        is_vegetarian: pizza.is_vegetarian,
        is_featured: pizza.is_featured,
        is_available: pizza.is_available,
        image_url: pizza.image_url || '',
        default_toppings: pizza.default_toppings || [],
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.put(`/admin/pizzas/${pizza.id}`);
    }

    function toggleTopping(id: number) {
        const selected = form.data.default_toppings.includes(id)
            ? form.data.default_toppings.filter((t) => t !== id)
            : [...form.data.default_toppings, id];
        form.setData('default_toppings', selected);
    }

    // Group toppings by category
    const toppingsByCategory = toppings.reduce<Record<string, Topping[]>>((acc, t) => {
        const cat = t.category || 'Other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(t);
        return acc;
    }, {});

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Admin', href: '/admin/dashboard' },
                { title: 'Pizzas', href: '/admin/pizzas' },
                { title: 'Edit', href: `/admin/pizzas/${pizza.id}/edit` },
            ]}
        >
            <Head title={`Edit - ${pizza.name}`} />

            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
                <Button
                    variant="ghost"
                    className="mb-6 gap-2"
                    onClick={() => window.history.back()}
                >
                    <ArrowLeft className="size-4" />
                    Back to Pizzas
                </Button>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Edit Pizza</h1>
                    <p className="mt-1 text-muted-foreground">Update {pizza.name}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name *</Label>
                                <Input
                                    id="name"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    placeholder="E.g., Margherita"
                                />
                                {form.errors.name && (
                                    <p className="text-sm text-destructive">{form.errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    value={form.data.description}
                                    onChange={(e) => form.setData('description', e.target.value)}
                                    rows={3}
                                />
                                {form.errors.description && (
                                    <p className="text-sm text-destructive">{form.errors.description}</p>
                                )}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="base_price">Base Price ($) *</Label>
                                    <Input
                                        id="base_price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={form.data.base_price}
                                        onChange={(e) => form.setData('base_price', e.target.value)}
                                    />
                                    {form.errors.base_price && (
                                        <p className="text-sm text-destructive">{form.errors.base_price}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="preparation_time">Prep Time (min)</Label>
                                    <Input
                                        id="preparation_time"
                                        type="number"
                                        min="1"
                                        value={form.data.preparation_time}
                                        onChange={(e) => form.setData('preparation_time', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image_url">Image URL</Label>
                                <Input
                                    id="image_url"
                                    value={form.data.image_url}
                                    onChange={(e) => form.setData('image_url', e.target.value)}
                                    placeholder="https://example.com/pizza.jpg"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Options */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Options</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="is_vegetarian"
                                    checked={form.data.is_vegetarian}
                                    onCheckedChange={(checked) => form.setData('is_vegetarian', !!checked)}
                                />
                                <Label htmlFor="is_vegetarian" className="cursor-pointer">
                                    Vegetarian
                                </Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="is_featured"
                                    checked={form.data.is_featured}
                                    onCheckedChange={(checked) => form.setData('is_featured', !!checked)}
                                />
                                <Label htmlFor="is_featured" className="cursor-pointer">
                                    Featured on menu
                                </Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="is_available"
                                    checked={form.data.is_available}
                                    onCheckedChange={(checked) => form.setData('is_available', !!checked)}
                                />
                                <Label htmlFor="is_available" className="cursor-pointer">
                                    Available for ordering
                                </Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Toppings */}
                    {Object.keys(toppingsByCategory).length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Default Toppings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {Object.entries(toppingsByCategory).map(([cat, catToppings]) => (
                                    <div key={cat}>
                                        <h4 className="mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                            {cat}
                                        </h4>
                                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                            {catToppings.map((t) => (
                                                <div key={t.id} className="flex items-center gap-2">
                                                    <Checkbox
                                                        id={`topping-${t.id}`}
                                                        checked={form.data.default_toppings.includes(t.id)}
                                                        onCheckedChange={() => toggleTopping(t.id)}
                                                    />
                                                    <Label htmlFor={`topping-${t.id}`} className="cursor-pointer text-sm">
                                                        {t.name}
                                                        {t.price > 0 && (
                                                            <span className="text-muted-foreground ml-1">
                                                                (+${Number(t.price).toFixed(2)})
                                                            </span>
                                                        )}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    <div className="flex gap-3">
                        <Button type="submit" className="gap-2" disabled={form.processing}>
                            {form.processing ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <Save className="size-4" />
                            )}
                            Update Pizza
                        </Button>
                        <Button type="button" variant="outline" asChild>
                            <Link href="/admin/pizzas">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
