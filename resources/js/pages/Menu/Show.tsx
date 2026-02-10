import { Head, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Clock,
    Leaf,
    Minus,
    Plus,
    ShoppingCart,
    Star,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { PizzaDetail } from '@/types/pizza';

interface Props {
    pizza: PizzaDetail;
}

const SIZE_OPTIONS = [
    { value: 'small', label: 'Small (10")', price: 0 },
    { value: 'medium', label: 'Medium (12")', price: 2 },
    { value: 'large', label: 'Large (14")', price: 4 },
    { value: 'extra_large', label: 'Extra Large (16")', price: 6 },
];

const CRUST_OPTIONS = [
    { value: 'thin', label: 'Thin Crust', price: 0 },
    { value: 'regular', label: 'Regular Crust', price: 0 },
    { value: 'thick', label: 'Thick Crust', price: 1.5 },
    { value: 'stuffed', label: 'Stuffed Crust', price: 3 },
];

export default function MenuShow({ pizza }: Props) {
    const [size, setSize] = useState('medium');
    const [crust, setCrust] = useState('regular');
    const [quantity, setQuantity] = useState(1);
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [instructions, setInstructions] = useState('');
    const [loading, setLoading] = useState(false);

    const sizePrice = SIZE_OPTIONS.find((s) => s.value === size)?.price || 0;
    const crustPrice = CRUST_OPTIONS.find((c) => c.value === crust)?.price || 0;
    const toppingsPrice = pizza.default_toppings?.reduce((acc, t) => acc + Number(t.price || 0), 0) || 0;
    const unitPrice = Number(pizza.base_price) + sizePrice + crustPrice + toppingsPrice;
    const totalPrice = unitPrice * quantity;

    const selectedToppings = pizza.default_toppings?.map((t: any) => t.name) || [];

    function handleOrder() {
        if (!address.trim() || !phone.trim()) return;
        setLoading(true);

        router.post('/orders', {
            items: [
                {
                    pizza_id: pizza.id,
                    quantity,
                    size,
                    crust,
                    base_price: Number(pizza.base_price),
                    size_price: sizePrice,
                    crust_price: crustPrice,
                    toppings_price: toppingsPrice,
                    item_total: totalPrice,
                    selected_toppings: selectedToppings,
                },
            ],
            delivery_address: address,
            customer_phone: phone,
            special_instructions: instructions || null,
        }, {
            onFinish: () => setLoading(false),
        });
    }

    const avgRating = pizza.average_rating ?? 0;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Menu', href: '/menu' },
                { title: pizza.name, href: `/menu/${pizza.id}` },
            ]}
        >
            <Head title={pizza.name} />

            <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
                <Button
                    variant="ghost"
                    className="mb-6 gap-2"
                    onClick={() => window.history.back()}
                >
                    <ArrowLeft className="size-4" />
                    Back to Menu
                </Button>

                <div className="grid gap-8 lg:grid-cols-5">
                    {/* Left: Pizza Info */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Image */}
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5">
                            {pizza.image_url ? (
                                <img
                                    src={pizza.image_url}
                                    alt={pizza.name}
                                    className="h-72 w-full object-cover sm:h-96"
                                />
                            ) : (
                                <div className="flex h-72 w-full items-center justify-center sm:h-96">
                                    <div className="text-8xl">🍕</div>
                                </div>
                            )}
                            {pizza.is_vegetarian && (
                                <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1.5 text-sm font-semibold text-white shadow-lg">
                                    <Leaf className="size-4" />
                                    Vegetarian
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div>
                            <h1 className="text-3xl font-bold">{pizza.name}</h1>
                            <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Star className="size-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-semibold text-foreground">{avgRating > 0 ? avgRating.toFixed(1) : 'New'}</span>
                                    {pizza.reviews?.length > 0 && <span>({pizza.reviews.length} reviews)</span>}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="size-4" />
                                    <span>{pizza.preparation_time} min</span>
                                </div>
                            </div>
                            <p className="mt-4 text-muted-foreground leading-relaxed">
                                {pizza.description}
                            </p>
                        </div>

                        {/* Default Toppings */}
                        {pizza.default_toppings?.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Included Toppings</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {pizza.default_toppings.map((t: any) => (
                                            <span
                                                key={t.id}
                                                className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                                            >
                                                {t.name}
                                            </span>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Reviews */}
                        {pizza.reviews?.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Customer Reviews</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {pizza.reviews.map((review) => (
                                        <div key={review.id} className="rounded-lg border p-4">
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold">{review.user_name}</span>
                                                <div className="flex items-center gap-1">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`size-3.5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            {review.comment && (
                                                <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
                                            )}
                                            <p className="mt-1 text-xs text-muted-foreground/70">{review.created_at}</p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right: Order Form */}
                    <div className="lg:col-span-2">
                        <Card className="sticky top-6">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Build Your Order</span>
                                    <span className="text-2xl font-bold text-primary">
                                        ${Number(pizza.base_price).toFixed(2)}
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                {/* Size */}
                                <div className="space-y-2">
                                    <Label>Size</Label>
                                    <Select value={size} onValueChange={setSize}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SIZE_OPTIONS.map((s) => (
                                                <SelectItem key={s.value} value={s.value}>
                                                    {s.label} {s.price > 0 ? `(+$${s.price.toFixed(2)})` : ''}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Crust */}
                                <div className="space-y-2">
                                    <Label>Crust</Label>
                                    <Select value={crust} onValueChange={setCrust}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CRUST_OPTIONS.map((c) => (
                                                <SelectItem key={c.value} value={c.value}>
                                                    {c.label} {c.price > 0 ? `(+$${c.price.toFixed(2)})` : ''}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Quantity */}
                                <div className="space-y-2">
                                    <Label>Quantity</Label>
                                    <div className="flex items-center gap-3">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            disabled={quantity <= 1}
                                        >
                                            <Minus className="size-4" />
                                        </Button>
                                        <span className="w-8 text-center text-lg font-bold">{quantity}</span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setQuantity(quantity + 1)}
                                        >
                                            <Plus className="size-4" />
                                        </Button>
                                    </div>
                                </div>

                                <Separator />

                                {/* Delivery Info */}
                                <div className="space-y-2">
                                    <Label>Delivery Address *</Label>
                                    <Input
                                        placeholder="Enter your address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Phone Number *</Label>
                                    <Input
                                        placeholder="Enter your phone"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Special Instructions</Label>
                                    <Textarea
                                        placeholder="Any special requests?"
                                        value={instructions}
                                        onChange={(e) => setInstructions(e.target.value)}
                                        rows={2}
                                    />
                                </div>

                                <Separator />

                                {/* Price Breakdown */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Base price</span>
                                        <span>${Number(pizza.base_price).toFixed(2)}</span>
                                    </div>
                                    {sizePrice > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Size upgrade</span>
                                            <span>+${sizePrice.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {crustPrice > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Crust upgrade</span>
                                            <span>+${crustPrice.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {quantity > 1 && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Quantity</span>
                                            <span>×{quantity}</span>
                                        </div>
                                    )}
                                    <Separator />
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-primary">${totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>

                                <Button
                                    size="lg"
                                    className="w-full gap-2 text-base"
                                    onClick={handleOrder}
                                    disabled={loading || !address.trim() || !phone.trim()}
                                >
                                    <ShoppingCart className="size-5" />
                                    {loading ? 'Placing Order...' : 'Place Order'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
