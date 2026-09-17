import { Link } from '@inertiajs/react';
import ustpLogo from '@/assets/ustp-logo.png';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh items-center justify-center bg-ustp-gray/50 p-6 dark:bg-neutral-950">
            <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-ustp-gray-medium bg-white shadow-xl dark:border-neutral-700 dark:bg-neutral-900">
                {/* Brand header */}
                <div className="relative bg-ustp-navy px-6 pt-7 pb-6 text-center">
                    <Link href={home()} className="inline-block">
                        <div className="mx-auto mb-3 flex size-20 items-center justify-center rounded-full bg-white p-2 shadow-md">
                            <img
                                src={ustpLogo}
                                alt="USTP Logo"
                                className="size-full rounded-full object-contain"
                            />
                        </div>
                    </Link>
                    <h1 className="mb-1 font-serif text-2xl font-bold tracking-tight text-white">
                        USTP ICT Portal
                    </h1>
                    <p className="mb-3 text-[11px] font-medium tracking-[0.15em] text-white/80 uppercase">
                        University of Science and Technology of Southern
                        Philippines
                    </p>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-ustp-gold/40 bg-ustp-gold/20 px-3 py-1">
                        <span className="size-1.5 shrink-0 rounded-full bg-ustp-gold-light" />
                        <span className="text-[11px] font-semibold tracking-wide text-ustp-gold-light uppercase">
                            Balubal Campus, Cagayan de Oro City
                        </span>
                    </span>
                </div>

                {/* Gold accent divider */}
                <div className="h-1 bg-ustp-gold" />

                <div className="bg-white px-6 py-6 dark:bg-neutral-900">
                    <div className="mb-6 space-y-1 text-center">
                        <h2 className="font-serif text-lg font-bold tracking-tight text-ustp-navy dark:text-white">
                            {title}
                        </h2>
                        <p className="text-sm leading-snug text-ustp-navy/70 dark:text-white/70">
                            {description}
                        </p>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
