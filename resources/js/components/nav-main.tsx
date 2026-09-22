import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Navigation
            </SidebarGroupLabel>
            <SidebarMenu className="gap-0.5">
                {items.map((item) => {
                    const isActive = isCurrentUrl(item.href);
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                tooltip={{ children: item.title }}
                                className={`group relative h-10 rounded-lg px-3 text-sm font-medium transition-all duration-200 ${
                                    isActive
                                        ? 'bg-ustp-navy text-white shadow-sm shadow-ustp-navy/20'
                                        : 'text-slate-600 hover:bg-ustp-navy/5 hover:text-ustp-navy'
                                } [&>svg]:size-[18px] [&>svg]:shrink-0 ${
                                    isActive
                                        ? '[&>svg]:text-ustp-gold'
                                        : '[&>svg]:text-slate-400 group-hover:[&>svg]:text-ustp-navy'
                                }`}
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
