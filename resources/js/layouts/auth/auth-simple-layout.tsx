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
        <div className="flex min-h-svh items-center justify-center bg-ustp-gray/50 p-6">
            <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-ustp-gray-medium bg-white shadow-xl">
                {/* Brand header */}
                <div className="bg-ustp-navy px-8 pt-9 pb-7 text-center">
                    <Link href={home()} className="inline-block">
                        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-white p-1.5 shadow-md">
                            <img
                                src={ustpLogo}
                                alt="USTP Logo"
                                className="size-full rounded-full object-contain"
                            />
                        </div>
                    </Link>
                    <p className="mb-1 font-serif text-sm font-bold leading-snug text-white">
                        University of Science and Technology of Southern Philippines
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-ustp-gold">
                        Balubal Campus, Cagayan de Oro City
                    </p>
                </div>

                {/* Gold accent divider */}
                <div className="h-1.5 bg-ustp-gold" />

                <div className="bg-white px-8 py-8">
                    <div className="mb-6 space-y-1 text-center">
                        <h2 className="font-serif text-xl font-bold text-ustp-navy">
                            {title}
                        </h2>
                        <p className="text-sm text-ustp-navy/60">{description}</p>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
