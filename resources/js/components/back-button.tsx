import { Link } from '@inertiajs/react';
import { X } from 'lucide-react';

export function BackButton({ href }: { href: string }) {
    return (
        <Link
            href={href}
            aria-label="Close"
            title="Close"
            className="group absolute top-0 right-0 z-10 flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/60 shadow-lg shadow-black/20 transition-all hover:-translate-y-0.5 hover:border-ustp-gold/60 hover:bg-ustp-gold/10 hover:text-ustp-gold hover:shadow-xl hover:shadow-ustp-gold/10 focus-visible:ring-2 focus-visible:ring-ustp-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#070b18] focus-visible:outline-none"
        >
            <X className="size-5 transition-transform group-hover:rotate-90" />
        </Link>
    );
}
