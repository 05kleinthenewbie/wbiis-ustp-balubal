import { Link } from '@inertiajs/react';
import { X } from 'lucide-react';

export function BackButton({ href }: { href: string }) {
    return (
        <Link
            href={href}
            aria-label="Close"
            title="Close"
            className="group inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-600 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ustp-navy focus-visible:ring-offset-2 focus-visible:outline-none"
        >
            <X className="size-4 transition-transform group-hover:rotate-90" />
        </Link>
    );
}
