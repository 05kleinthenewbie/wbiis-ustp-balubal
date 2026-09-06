import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export function BackButton({
    href,
    label = 'Back',
}: {
    href: string;
    label?: string;
}) {
    return (
        <Link
            href={href}
            className="group mb-3 inline-flex w-fit items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-sm font-medium text-white/70 shadow-md shadow-black/20 transition-all hover:-translate-x-0.5 hover:border-ustp-gold/40 hover:bg-white/[0.06] hover:text-ustp-gold focus-visible:ring-2 focus-visible:ring-ustp-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#070b18] focus-visible:outline-none"
        >
            <ArrowLeft className="size-4 text-white/40 transition-all group-hover:-translate-x-0.5 group-hover:text-ustp-gold" />
            {label}
        </Link>
    );
}
