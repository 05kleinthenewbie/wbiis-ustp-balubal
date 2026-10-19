import { Link } from '@inertiajs/react';
import { X } from 'lucide-react';

export function BackButton({ href }: { href: string }) {
    return (
        <Link
            href={href}
            aria-label="Close"
            title="Close"
            className="inline-flex size-9 items-center justify-center rounded-xs text-muted-foreground opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden"
        >
            <X className="size-4" />
        </Link>
    );
}
