import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    FileText,
    ClipboardList,
    Box,
    Calendar,
    AlertTriangle,
    History,
    BarChart3,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const dashboardUrl = '/dashboard';
    const { auth } = usePage().props as any;
    const roleName = auth?.user?.role?.role_name;

    const adminNavItems: NavItem[] = [
        { title: 'Dashboard', href: dashboardUrl, icon: LayoutGrid },
        { title: 'Service Requests', href: '/requests', icon: FileText },
        { title: 'Job Orders', href: '/job-orders', icon: ClipboardList },
        { title: 'Inventory', href: '/inventory', icon: Box },
        { title: 'Facility Booking', href: '/bookings', icon: Calendar },
        { title: 'Incidents', href: '/incidents', icon: AlertTriangle },
        { title: 'Audit Log', href: '/audit-log', icon: History },
        { title: 'Reports', href: '/reports', icon: BarChart3 },
        { title: 'User Management', href: '/users', icon: Users },
    ];

    const facultyStaffNavItems: NavItem[] = [
        { title: 'Dashboard', href: dashboardUrl, icon: LayoutGrid },
        { title: 'My Service Requests', href: '/requests', icon: FileText },
        { title: 'Facility Booking', href: '/bookings', icon: Calendar },
        { title: 'Incidents', href: '/incidents', icon: AlertTriangle },
    ];

    let mainNavItems: NavItem[] = facultyStaffNavItems;

    if (roleName === 'ict_admin') {
        mainNavItems = adminNavItems;
    }

    const footerNavItems: NavItem[] = [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="bg-ustp-navy">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardUrl} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarSeparator className="mx-3 my-1" />

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarSeparator className="mx-3 my-1" />

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
            </SidebarFooter>
        </Sidebar>
    );
}
