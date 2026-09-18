import { Link } from '@inertiajs/react';
import { Palette, Shield, User, Users } from 'lucide-react';
import type { ComponentType, PropsWithChildren } from 'react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import { index as teams } from '@/routes/teams';

type SettingsNavItem = {
    title: string;
    href: string;
    icon: ComponentType<{ className?: string }>;
};

const settingsNavItems: SettingsNavItem[] = [
    {
        title: 'Profile',
        href: edit(),
        icon: User,
    },
    {
        title: 'Security',
        href: editSecurity(),
        icon: Shield,
    },
    {
        title: 'Teams',
        href: teams(),
        icon: Users,
    },
    {
        title: 'Appearance',
        href: editAppearance(),
        icon: Palette,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <div className="min-h-full flex-1 bg-slate-50 p-4 text-slate-800 md:p-6 lg:p-8">
            <div className="mx-auto max-w-6xl space-y-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                        Settings
                    </h1>
                    <p className="text-sm text-slate-500">
                        Manage your profile and account settings
                    </p>
                </div>

                <nav
                    className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-4"
                    aria-label="Settings"
                >
                    {settingsNavItems.map((item, index) => {
                        const active = isCurrentOrParentUrl(item.href);
                        const Icon = item.icon;

                        return (
                            <Link
                                key={`${toUrl(item.href)}-${index}`}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2 text-sm transition-colors',
                                    {
                                        'bg-ustp-navy font-semibold text-white shadow-sm': active,
                                        'border border-slate-200 bg-white font-medium text-slate-600 shadow-xs hover:bg-slate-100':
                                            !active,
                                    },
                                )}
                            >
                                {active && (
                                    <Icon className="size-4 text-ustp-gold" />
                                )}
                                <span>{item.title}</span>
                            </Link>
                        );
                    })}
                </nav>

                <section className="space-y-8">{children}</section>
            </div>
        </div>
    );
}