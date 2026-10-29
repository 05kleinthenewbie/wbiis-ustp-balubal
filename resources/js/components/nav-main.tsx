import { Link } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { isCurrentUrl, isCurrentOrParentUrl } = useCurrentUrl();
    const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

    const setOpen = (title: string, open: boolean) => {
        setOpenItems((current) => ({ ...current, [title]: open }));
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Navigation
            </SidebarGroupLabel>
            <SidebarMenu className="gap-0.5">
                {items.map((item) => {
                    const hasChildren = Boolean(item.children?.length);
                    const childActive =
                        item.children?.some((child) =>
                            isCurrentUrl(child.href),
                        ) ?? false;
                    const isActive =
                        isCurrentUrl(item.href) ||
                        isCurrentOrParentUrl(item.href) ||
                        childActive;
                    const isOpen = isActive && openItems[item.title] === true;

                    return (
                        <SidebarMenuItem
                            key={item.title}
                            className="relative"
                        >
                            <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                tooltip={{ children: item.title }}
                                className={cn(
                                    'group relative h-10 rounded-lg px-3 text-sm font-medium transition-all duration-200',
                                    hasChildren && 'pr-9',
                                    isActive
                                        ? 'bg-ustp-navy text-white shadow-sm shadow-ustp-navy/20'
                                        : 'text-slate-600 hover:bg-ustp-navy/5 hover:text-ustp-navy',
                                    '[&>svg]:size-4.5 [&>svg]:shrink-0',
                                    isActive
                                        ? '[&>svg]:text-ustp-gold'
                                        : '[&>svg]:text-slate-400 group-hover:[&>svg]:text-ustp-navy',
                                )}
                            >
                                <Link
                                    href={item.href}
                                    prefetch
                                    onClick={
                                        hasChildren
                                            ? () => setOpen(item.title, true)
                                            : undefined
                                    }
                                >
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>

                            {hasChildren && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setOpen(item.title, !isOpen)
                                    }
                                    aria-expanded={isOpen}
                                    aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${item.title}`}
                                    className={cn(
                                        'absolute top-1/2 right-2 z-10 flex size-6 -translate-y-1/2 items-center justify-center rounded-md transition-colors',
                                        'group-data-[collapsible=icon]:hidden',
                                        isActive
                                            ? 'text-white/70 hover:bg-white/10 hover:text-white'
                                            : 'text-slate-400 hover:bg-ustp-navy/5 hover:text-ustp-navy',
                                    )}
                                >
                                    <ChevronDown
                                        className={cn(
                                            'size-3.5 transition-transform duration-200',
                                            isOpen && 'rotate-180',
                                        )}
                                    />
                                </button>
                            )}

                            {hasChildren && isOpen && (
                                <SidebarMenuSub className="mt-1 gap-0.5">
                                    {item.children?.map((child) => {
                                        const isChildActive = isCurrentUrl(
                                            child.href,
                                        );

                                        return (
                                            <SidebarMenuSubItem
                                                key={child.title}
                                            >
                                                <SidebarMenuSubButton
                                                    asChild
                                                    size="sm"
                                                    isActive={isChildActive}
                                                    className={cn(
                                                        'h-8 rounded-md px-2 text-[13px] font-medium',
                                                        isChildActive
                                                            ? 'bg-ustp-navy/10 text-ustp-navy'
                                                            : 'text-slate-500 hover:bg-ustp-navy/5 hover:text-ustp-navy',
                                                    )}
                                                >
                                                    <Link
                                                        href={child.href}
                                                        prefetch
                                                    >
                                                        {child.icon && (
                                                            <child.icon />
                                                        )}
                                                        <span>{child.title}</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        );
                                    })}
                                </SidebarMenuSub>
                            )}
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
