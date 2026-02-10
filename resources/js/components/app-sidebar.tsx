import { Link, usePage } from '@inertiajs/react';
import {
    Pizza,
    ShoppingCart,
    LayoutGrid,
    ClipboardList,
    Settings,
    UtensilsCrossed,
} from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem, SharedData } from '@/types';
import AppLogo from './app-logo';

const customerNavItems: NavItem[] = [
    {
        title: 'Menu',
        href: '/menu',
        icon: Pizza,
    },
    {
        title: 'My Orders',
        href: '/orders',
        icon: ShoppingCart,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Orders',
        href: '/admin/orders',
        icon: ClipboardList,
    },
    {
        title: 'Pizzas',
        href: '/admin/pizzas',
        icon: UtensilsCrossed,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Settings',
        href: '/settings/profile',
        icon: Settings,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = (auth.user as any)?.role === 'admin';

    const navItems = isAdmin ? adminNavItems : customerNavItems;
    const homeHref = isAdmin ? '/admin/dashboard' : '/menu';

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={homeHref} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
