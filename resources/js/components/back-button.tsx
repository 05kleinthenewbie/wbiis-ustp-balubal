import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export function BackButton({ href, label = 'Back' }: { href: string; label?: string }) {
    return (
        <Link
            href={href}
            className="mb-2 inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
            <ArrowLeft className="size-4" />
            {label}
        </Link>
    );
}
