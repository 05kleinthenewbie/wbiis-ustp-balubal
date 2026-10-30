import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    Activity,
    UserCog,
    FileText,
    ClipboardList,
    Box,
    Calendar,
    CalendarClock,
    Building2,
    CheckCircle2,
    AlertTriangle,
    ShieldAlert,
    History,
    BarChart3,
    Users,
    Wrench,
    Bell,
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
import { index as incidentsIndex } from '@/routes/incidents';
import { index as liabilitiesIndex } from '@/routes/liabilities';
import { index as notificationsIndex } from '@/routes/notifications';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const dashboardUrl = '/dashboard';
    const { auth } = usePage().props as any;
    const roleName = auth?.user?.role?.role_name;

    const adminNavItems: NavItem[] = [
        { title: 'Dashboard', href: dashboardUrl, icon: LayoutGrid },
        {
            title: 'Service Requests',
            href: '/requests',
            icon: FileText,
            children: [
                { title: 'All Requests', href: '/requests', icon: FileText },
                {
                    title: 'Request Approvals',
                    href: '/requests/approvals',
                    icon: CheckCircle2,
                },
            ],
        },
        {
            title: 'Job Orders',
            href: '/job-orders',
            icon: ClipboardList,
            children: [
                {
                    title: 'All Job Orders',
                    href: '/job-orders',
                    icon: ClipboardList,
                },
                {
                    title: 'Assignments',
                    href: '/job-orders/assignments',
                    icon: UserCog,
                },
                {
                    title: 'Work Progress',
                    href: '/job-orders/progress',
                    icon: Activity,
                },
            ],
        },
        {
            title: 'Inventory',
            href: '/inventory',
            icon: Box,
            children: [
                {
                    title: 'All Items',
                    href: '/inventory',
                    icon: Box,
                },
                {
                    title: 'Monitor Expiration',
                    href: '/inventory/expirations',
                    icon: CalendarClock,
                },
                {
                    title: 'Defective',
                    href: '/inventory/defective',
                    icon: AlertTriangle,
                },
                {
                    title: 'Under Repair',
                    href: '/inventory/under-repair',
                    icon: Wrench,
                },
            ],
        },
        {
            title: 'Facility Booking',
            href: '/bookings',
            icon: Calendar,
            children: [
                {
                    title: 'Reservations',
                    href: '/bookings',
                    icon: ClipboardList,
                },
                {
                    title: 'Facilities',
                    href: '/facilities',
                    icon: Building2,
                },
                {
                    title: 'Booking Approvals',
                    href: '/bookings/approvals',
                    icon: CheckCircle2,
                },
            ],
        },
        {
            title: 'Laboratory Incident Reports',
            href: '/incidents',
            icon: AlertTriangle,
        },
        { title: 'Audit Log', href: '/audit-log', icon: History },
        { title: 'Reports', href: '/reports', icon: BarChart3 },
        { title: 'User Management', href: '/users', icon: Users },
    ];

    const facultyStaffNavItems: NavItem[] = [
        { title: 'Dashboard', href: dashboardUrl, icon: LayoutGrid },
        { title: 'My Service Requests', href: '/requests', icon: FileText },
        {
            title: 'Facility Booking',
            href: '/bookings',
            icon: Calendar,
            children: [
                {
                    title: 'Reservations',
                    href: '/bookings',
                    icon: ClipboardList,
                },
            ],
        },
        {
            title: 'Laboratory Incident Reports',
            href: '/incidents',
            icon: AlertTriangle,
            children: [
                {
                    title: 'Incident Reports',
                    href: '/incidents',
                    icon: AlertTriangle,
                },
                {
                    title: 'My Liabilities',
                    href: liabilitiesIndex().url,
                    icon: ShieldAlert,
                },
            ],
        },
    ];

    const studentNavItems: NavItem[] = [
        { title: 'Dashboard', href: dashboardUrl, icon: LayoutGrid },
        { title: 'My Service Requests', href: '/requests', icon: FileText },
        {
            title: 'Laboratory Incident Reports',
            href: incidentsIndex().url,
            icon: AlertTriangle,
            children: [
                {
                    title: 'Incident Reports',
                    href: incidentsIndex().url,
                    icon: AlertTriangle,
                },
                {
                    title: 'My Liabilities',
                    href: liabilitiesIndex().url,
                    icon: ShieldAlert,
                },
            ],
        },
    ];

    let mainNavItems: NavItem[] = facultyStaffNavItems;

    if (roleName === 'student') {
        mainNavItems = studentNavItems;
    } else if (roleName === 'ict_admin') {
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
                <NavMain
                    items={[
                        ...mainNavItems,
                        {
                            title: 'Notifications',
                            href: notificationsIndex().url,
                            icon: Bell,
                        },
                    ]}
                />
            </SidebarContent>

            <SidebarSeparator className="mx-3 my-1" />

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
            </SidebarFooter>
        </Sidebar>
    );
}
