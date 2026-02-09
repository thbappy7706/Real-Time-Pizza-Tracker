# Pizza Ordering System - Architecture Documentation

## System Overview

This is a production-ready, real-time pizza ordering and tracking system built with modern web technologies. The system supports two user roles (Customer and Admin) with comprehensive real-time features powered by WebSockets.

## Technology Stack

### Backend
- **Framework:** Laravel 12
- **Language:** PHP 8.3+
- **Database:** MySQL 8.0+
- **Cache/Queue:** Redis
- **Real-time:** Laravel Reverb (WebSockets)
- **Payment:** Stripe API

### Frontend
- **Framework:** React 18 with TypeScript
- **Routing:** Inertia.js (SPA-like experience)
- **UI Library:** shadcn/ui + Tailwind CSS
- **Real-time Client:** Laravel Echo + Pusher JS
- **Build Tool:** Vite

## Architecture Patterns

### 1. MVC + Service Layer Pattern

```
┌─────────────┐
│   Routes    │
└──────┬──────┘
       │
┌──────▼──────┐
│ Controllers │
└──────┬──────┘
       │
┌──────▼──────┐
│  Services   │ (Business Logic)
└──────┬──────┘
       │
┌──────▼──────┐
│   Models    │ (Data Layer)
└─────────────┘
```

**Why this pattern?**
- Separates business logic from controllers
- Makes code more testable and maintainable
- Follows SOLID principles

### 2. Event-Driven Architecture for Real-time

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Action     │────▶│    Event     │────▶│  Broadcast   │
│ (Order Place)│     │(OrderPlaced) │     │  to Channels │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                                    ┌─────────────┼─────────────┐
                                    │             │             │
                              ┌─────▼──────┐┌────▼────┐ ┌─────▼──────┐
                              │   Admin    ││Customer │ │Other Admins│
                              │ Dashboard  ││ Tracker │ │            │
                              └────────────┘└─────────┘ └────────────┘
```

## Database Schema

### Core Tables

#### users
```sql
- id (PK)
- name
- email (UNIQUE)
- password (hashed)
- role (ENUM: customer, admin)
- phone
- address
- latitude, longitude
- timestamps, soft_deletes
```

#### pizzas
```sql
- id (PK)
- name
- description
- image_url
- base_price (DECIMAL)
- is_available (BOOLEAN)
- is_vegetarian (BOOLEAN)
- is_featured (BOOLEAN)
- preparation_time (INTEGER)
- timestamps, soft_deletes
```

#### toppings
```sql
- id (PK)
- name
- price (DECIMAL)
- category (ENUM: meat, vegetable, cheese, sauce, other)
- is_available (BOOLEAN)
- is_vegetarian (BOOLEAN)
- timestamps, soft_deletes
```

#### pizza_topping (Pivot Table)
```sql
- id (PK)
- pizza_id (FK)
- topping_id (FK)
- is_default (BOOLEAN)
- timestamps
```

#### orders
```sql
- id (PK)
- order_number (UNIQUE)
- user_id (FK)
- status (ENUM: pending, placed, accepted, preparing, 
          baking, out_for_delivery, delivered, 
          cancelled, rejected)
- subtotal, tax, delivery_fee, total (DECIMAL)
- delivery_address, delivery_latitude, delivery_longitude
- customer_phone
- special_instructions
- estimated_delivery_time
- accepted_at, delivered_at
- rejection_reason
- timestamps, soft_deletes
```

#### order_items
```sql
- id (PK)
- order_id (FK)
- pizza_id (FK)
- quantity
- size (ENUM: small, medium, large, extra_large)
- crust (ENUM: thin, regular, thick, stuffed)
- base_price, size_price, crust_price, toppings_price
- item_total (DECIMAL)
- selected_toppings (JSON)
- timestamps
```

#### payments
```sql
- id (PK)
- order_id (FK)
- payment_method
- transaction_id (UNIQUE)
- amount (DECIMAL)
- status (ENUM: pending, completed, failed, refunded)
- payment_details (JSON)
- paid_at
- timestamps
```

#### deliveries
```sql
- id (PK)
- order_id (FK)
- driver_id (FK to users)
- status (ENUM: assigned, picked_up, in_transit, 
          delivered, failed)
- current_latitude, current_longitude
- assigned_at, picked_up_at, delivered_at
- delivery_notes
- timestamps
```

#### reviews
```sql
- id (PK)
- order_id (FK)
- user_id (FK)
- pizza_id (FK, nullable)
- rating (1-5)
- comment
- food_rating, delivery_rating
- timestamps
```

### Indexing Strategy

**Primary Indexes:**
- All foreign keys are indexed
- Email (unique index)
- Order number (unique index)
- Transaction ID (unique index)

**Composite Indexes:**
- (pizza_id, topping_id) on pizza_topping
- (order_id, status) for filtering
- (user_id, created_at) for order history

## Real-time Broadcasting

### WebSocket Channels

#### 1. Private Channels
```javascript
// User-specific notifications
users.{userId}
- Receives: order status updates, delivery updates

// Order tracking
orders.{orderId}
- Receives: status updates, delivery location updates
- Authorization: user_id === order.user_id || user.isAdmin()
```

#### 2. Presence Channels
```javascript
// Admin dashboard
admin.dashboard
- Receives: new orders, order updates
- Members: online admin users
- Authorization: user.role === 'admin'
```

#### 3. Public Channels
None (all channels are authenticated for security)

### Events Broadcast

#### OrderPlaced
- **Triggered:** When customer completes checkout
- **Channels:** admin.dashboard, orders.{id}
- **Payload:** order summary, customer info

#### OrderStatusUpdated
- **Triggered:** When admin changes order status
- **Channels:** admin.dashboard, orders.{id}, users.{userId}
- **Payload:** new status, progress %, ETA

#### DeliveryAssigned
- **Triggered:** When admin assigns driver
- **Channels:** orders.{id}, users.{userId}, drivers.{driverId}
- **Payload:** driver info, assignment time

#### DeliveryLocationUpdated
- **Triggered:** When driver location updates
- **Channels:** orders.{id}, users.{userId}
- **Payload:** latitude, longitude, status

## Security

### Authentication & Authorization

#### Authentication
- **Method:** Laravel's built-in session-based auth
- **Password:** Bcrypt hashing
- **Session:** Redis-backed, HTTP-only cookies

#### Authorization
- **Policies:** OrderPolicy for CRUD operations
- **Middleware:** EnsureUserIsAdmin for admin routes
- **Channel Auth:** Broadcasting authorization in channels.php

### Security Measures

1. **CSRF Protection:** All POST/PUT/DELETE requests
2. **SQL Injection:** Eloquent ORM with prepared statements
3. **XSS Prevention:** React escapes output by default
4. **Rate Limiting:** API throttling on sensitive endpoints
5. **Input Validation:** Form requests with validation rules
6. **Secure WebSockets:** Token-based channel authorization

### Payment Security

- **PCI Compliance:** Stripe handles card data (never stored)
- **Webhook Verification:** Stripe signature verification
- **HTTPS Only:** All payment pages require SSL
- **Transaction Logs:** Encrypted payment details in JSON

## API Design

### RESTful Endpoints

```
Authentication
POST   /login              - User login
POST   /register           - Customer registration
POST   /logout             - Logout

Customer Routes (auth required)
GET    /menu               - Browse pizzas
GET    /menu/{id}          - Pizza details
POST   /orders             - Create order
GET    /orders             - Order history
GET    /orders/{id}        - Track order
POST   /orders/{id}/cancel - Cancel order
POST   /orders/{id}/review - Submit review
GET    /checkout/{id}      - Checkout page
POST   /checkout/{id}      - Process payment

Admin Routes (auth + admin middleware)
GET    /admin/dashboard    - Real-time dashboard
GET    /admin/orders       - Manage orders
GET    /admin/orders/{id}  - Order details
PATCH  /admin/orders/{id}/status - Update status
POST   /admin/orders/{id}/assign - Assign driver
GET    /admin/pizzas       - Manage menu
POST   /admin/pizzas       - Create pizza
PUT    /admin/pizzas/{id}  - Update pizza
DELETE /admin/pizzas/{id}  - Delete pizza
```

## Frontend Architecture

### Component Structure

```
Pages/
├── Auth/
│   ├── Login.tsx
│   └── Register.tsx
├── Menu/
│   ├── Index.tsx          (Pizza listing)
│   └── Show.tsx           (Pizza customization)
├── Orders/
│   ├── Index.tsx          (Order history)
│   └── Show.tsx           (Real-time tracking)
├── Checkout/
│   └── Index.tsx          (Payment)
├── Admin/
│   ├── Dashboard.tsx      (Real-time orders)
│   ├── Orders/
│   │   ├── Index.tsx
│   │   └── Show.tsx
│   └── Pizzas/
│       ├── Index.tsx
│       ├── Create.tsx
│       └── Edit.tsx
└── Layout.tsx             (Main layout)

Components/
├── ui/                    (shadcn/ui components)
│   ├── button.tsx
│   ├── card.tsx
│   ├── badge.tsx
│   └── ...
└── custom/                (App-specific components)

Hooks/
└── useEcho.ts            (WebSocket hooks)

Lib/
└── utils.ts              (Utilities)
```

### State Management

- **Server State:** Inertia.js props (Laravel backend)
- **Local State:** React useState for UI state
- **Real-time State:** WebSocket events update local state
- **No Redux needed:** Inertia handles server state sync

## Performance Optimizations

### Backend
1. **Query Optimization**
   - Eager loading relationships
   - Index all foreign keys
   - Use query builder for complex queries

2. **Caching**
   - Redis for session storage
   - Config/route/view caching in production
   - Query result caching for menu items

3. **Queue Processing**
   - Asynchronous email sending
   - Background job processing
   - Redis queue driver

### Frontend
1. **Code Splitting**
   - Lazy load pages with Inertia
   - Dynamic imports for heavy components

2. **Asset Optimization**
   - Vite bundling and minification
   - Image optimization
   - Tailwind CSS purging

3. **Real-time Efficiency**
   - Selective channel subscriptions
   - Debounced location updates
   - Disconnect on unmount

## Scalability Considerations

### Horizontal Scaling
- **App Servers:** Load balance multiple Laravel instances
- **Database:** Master-slave replication
- **Queue Workers:** Multiple worker processes
- **WebSocket:** Reverb horizontal scaling with Redis adapter

### Vertical Scaling
- Increase server resources (CPU/RAM)
- Optimize database queries
- Use CDN for static assets

### Monitoring & Logging
- Application logs in `storage/logs`
- Database query logging
- WebSocket connection monitoring
- Error tracking (Sentry recommended)

## Deployment Architecture

```
┌──────────────────────────────────────────────┐
│              Load Balancer (Nginx)            │
└────────────┬─────────────────────────────────┘
             │
      ┌──────┴──────┐
      │             │
┌─────▼─────┐ ┌─────▼─────┐
│  App      │ │  App      │
│  Server 1 │ │  Server 2 │
└─────┬─────┘ └─────┬─────┘
      │             │
      └──────┬──────┘
             │
    ┌────────▼────────┐
    │  MySQL Master   │
    │   (Read/Write)  │
    └────────┬────────┘
             │
    ┌────────▼────────┐
    │  MySQL Slave    │
    │   (Read Only)   │
    └─────────────────┘

┌─────────────────────┐
│  Redis Cluster      │
│  (Cache/Queue/      │
│   Sessions)         │
└─────────────────────┘

┌─────────────────────┐
│  Reverb Server      │
│  (WebSockets)       │
└─────────────────────┘
```

## Testing Strategy

### Backend Testing
```bash
# Unit Tests
php artisan test --testsuite=Unit

# Feature Tests
php artisan test --testsuite=Feature

# Coverage
php artisan test --coverage
```

### Frontend Testing
```bash
# Component Tests
npm run test

# E2E Tests (with Cypress/Playwright)
npm run test:e2e
```

### Testing Real-time Features
1. Use Reverb test environment
2. Mock WebSocket connections
3. Test event broadcasting
4. Verify channel authorization

## Maintenance & Updates

### Regular Tasks
- **Daily:** Check error logs
- **Weekly:** Database backups
- **Monthly:** Dependency updates
- **Quarterly:** Security audits

### Update Process
```bash
# Update dependencies
composer update
npm update

# Run tests
php artisan test
npm run test

# Deploy
php artisan down
git pull
composer install --no-dev
npm ci && npm run build
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan up
```

## Conclusion

This architecture provides:
- ✅ Real-time bidirectional communication
- ✅ Scalable and maintainable codebase
- ✅ Secure authentication and authorization
- ✅ Production-ready performance
- ✅ Clear separation of concerns
- ✅ Comprehensive error handling
- ✅ Easy deployment and monitoring
