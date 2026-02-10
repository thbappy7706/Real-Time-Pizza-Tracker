// ── Topping ──
export interface Topping {
    id: number;
    name: string;
    price: number;
    category: string;
    is_vegetarian?: boolean;
}

// ── Pizza (menu listing) ──
export interface Pizza {
    id: number;
    name: string;
    description: string;
    image_url: string | null;
    base_price: number;
    is_vegetarian: boolean;
    is_featured: boolean;
    preparation_time: number;
    average_rating: number;
    reviews_count: number;
    default_toppings: Topping[];
}

// ── Pizza (detail page) ──
export interface PizzaDetail extends Omit<Pizza, 'reviews_count'> {
    reviews: Review[];
}

// ── Review ──
export interface Review {
    id: number;
    rating: number;
    comment: string | null;
    user_name: string;
    created_at: string;
}

// ── Order Item ──
export interface OrderItem {
    id?: number;
    pizza_name: string;
    quantity: number;
    size: string;
    crust: string;
    item_total: number;
    selected_toppings: string[] | null;
}

// ── Payment ──
export interface Payment {
    method: string;
    status: string;
    amount?: number;
}

// ── Delivery ──
export interface Delivery {
    status: string;
    driver_name: string | null;
    driver_phone?: string | null;
    driver_id?: number | null;
    current_latitude?: number | null;
    current_longitude?: number | null;
}

// ── Customer Order (list) ──
export interface OrderListItem {
    id: number;
    order_number: string;
    status: string;
    status_label: string;
    total: number;
    items_count: number;
    created_at: string;
    can_cancel: boolean;
}

// ── Customer Order (detail) ──
export interface OrderDetail {
    id: number;
    order_number: string;
    status: string;
    status_label: string;
    progress_percentage: number;
    subtotal: number;
    tax: number;
    delivery_fee: number;
    total: number;
    delivery_address: string;
    customer_phone: string;
    special_instructions: string | null;
    estimated_delivery_time: string | null;
    created_at: string;
    items: OrderItem[];
    payment: Payment | null;
    delivery: Delivery | null;
    can_cancel: boolean;
    can_review: boolean;
}

// ── Checkout Order ──
export interface CheckoutOrder {
    id: number;
    order_number: string;
    total: number;
    subtotal: number;
    tax: number;
    delivery_fee: number;
}

// ── Admin Order (list) ──
export interface AdminOrderListItem {
    id: number;
    order_number: string;
    customer_name: string;
    status: string;
    status_label: string;
    total: number;
    items_count: number;
    created_at: string;
}

// ── Admin Order (detail) ──
export interface AdminOrderDetail {
    id: number;
    order_number: string;
    customer_name: string;
    customer_phone: string;
    customer_email: string;
    status: string;
    status_label: string;
    subtotal: number;
    tax: number;
    delivery_fee: number;
    total: number;
    delivery_address: string;
    special_instructions: string | null;
    created_at: string;
    items: OrderItem[];
    payment: Payment | null;
    delivery: Delivery | null;
}

// ── Admin Dashboard ──
export interface DashboardStats {
    total_orders_today: number;
    active_orders: number;
    total_revenue_today: number;
    total_customers: number;
}

export interface ActiveOrder {
    id: number;
    order_number: string;
    customer_name: string;
    customer_phone: string;
    status: string;
    status_label: string;
    total: number;
    items_count: number;
    delivery_address: string;
    created_at: string;
    estimated_delivery_time: string | null;
    driver_name: string | null;
}

// ── Admin Pizza (list) ──
export interface AdminPizzaListItem {
    id: number;
    name: string;
    base_price: number;
    is_available: boolean;
    is_featured: boolean;
    reviews_count: number;
}

// ── Admin Pizza (edit) ──
export interface AdminPizzaEdit {
    id: number;
    name: string;
    description: string;
    image_url: string | null;
    base_price: number;
    is_vegetarian: boolean;
    is_featured: boolean;
    is_available: boolean;
    preparation_time: number;
    default_toppings: number[];
}

// ── Driver ──
export interface Driver {
    id: number;
    name: string;
}

// ── Cart Item (for building orders on client) ──
export interface CartItem {
    pizza_id: number;
    pizza_name: string;
    quantity: number;
    size: 'small' | 'medium' | 'large' | 'extra_large';
    crust: 'thin' | 'regular' | 'thick' | 'stuffed';
    base_price: number;
    size_price: number;
    crust_price: number;
    toppings_price: number;
    item_total: number;
    selected_toppings: string[];
}

// ── Pagination ──
export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface Paginated<T> {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}
