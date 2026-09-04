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
            className="group mb-3 inline-flex w-fit items-center gap-2 rounded-lg border border-[#1a2035] bg-[#0f1723] px-3.5 py-2 text-sm font-medium text-gray-300 shadow-md shadow-black/20 transition-all hover:-translate-x-0.5 hover:border-ustp-gold/40 hover:bg-[#111827] hover:text-ustp-gold focus-visible:ring-2 focus-visible:ring-ustp-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#070b18] focus-visible:outline-none"
        >
            <ArrowLeft className="size-4 text-gray-500 transition-all group-hover:-translate-x-0.5 group-hover:text-ustp-gold" />
            {label}
        </Link>
    );
}
