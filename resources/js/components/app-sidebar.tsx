import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    FileText,
    ClipboardList,
    Box,
    Calendar,
    AlertTriangle,
    History,
    Mail,
    BarChart3,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
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
import type { NavItem } from '@/types';

export function AppSidebar() {
    const dashboardUrl = '/dashboard';
    const { auth } = usePage().props as any;
    const roleName = auth?.user?.role?.role_name;

    const adminNavItems: NavItem[] = [
        { title: 'Overview', href: dashboardUrl, icon: LayoutGrid },
        { title: 'Requests', href: '/requests', icon: FileText },
        { title: 'Job Orders', href: '/job-orders', icon: ClipboardList },
        { title: 'Inventory', href: '/inventory', icon: Box },
        { title: 'Bookings', href: '/bookings', icon: Calendar },
        { title: 'Incidents', href: '/incidents', icon: AlertTriangle },
        { title: 'Audit Log', href: '/audit-log', icon: History },
        { title: 'Reports', href: '/reports', icon: BarChart3 },
        { title: 'User Management', href: '/users', icon: Users },
    ];

    const facultyStaffNavItems: NavItem[] = [
        { title: 'Overview', href: dashboardUrl, icon: LayoutGrid },
        { title: 'My Requests', href: '/requests', icon: FileText },
        { title: 'Bookings', href: '/bookings', icon: Calendar },
        { title: 'Incidents', href: '/incidents', icon: AlertTriangle },
    ];

    const studentNavItems: NavItem[] = [
        { title: 'Overview', href: dashboardUrl, icon: LayoutGrid },
        { title: 'Request Email/O365', href: '/requests', icon: Mail },
    ];

    let mainNavItems: NavItem[] = facultyStaffNavItems;

    if (roleName === 'ict_admin') {
        mainNavItems = adminNavItems;
    } else if (roleName === 'student') {
        mainNavItems = studentNavItems;
    }

    const footerNavItems: NavItem[] = [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
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

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
