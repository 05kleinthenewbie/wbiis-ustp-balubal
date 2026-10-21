import type { LucideIcon } from 'lucide-react';
import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';

export default function AuthLayout({
    title = '',
    description = '',
    wide = false,
    icon,
    iconClassName,
    backHref,
    backLabel,
    backTestId,
    children,
}: {
    title?: string;
    description?: string;
    wide?: boolean;
    icon?: LucideIcon;
    iconClassName?: string;
    backHref?: string;
    backLabel?: string;
    backTestId?: string;
    children: React.ReactNode;
}) {
    return (
        <AuthLayoutTemplate
            title={title}
            description={description}
            wide={wide}
            icon={icon}
            iconClassName={iconClassName}
            backHref={backHref}
            backLabel={backLabel}
            backTestId={backTestId}
        >
            {children}
        </AuthLayoutTemplate>
    );
}
