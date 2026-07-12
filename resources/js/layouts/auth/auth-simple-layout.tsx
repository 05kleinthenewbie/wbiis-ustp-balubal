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
        <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden bg-gradient-to-br from-ustp-navy-dark via-ustp-navy to-ustp-navy-dark p-6 md:p-10">
            {/* Decorative background accents */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 size-[32rem] rounded-full bg-white/5 blur-3xl" />
                <div className="absolute top-1/4 -right-32 size-96 rounded-full bg-ustp-gold/15 blur-3xl" />
                <div className="absolute -bottom-40 left-1/3 size-[28rem] rounded-full bg-white/5 blur-3xl" />
            </div>

            {/* Subtle dot grid pattern */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.08]"
                style={{
                    backgroundImage:
                        'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }}
            />

            <div className="relative z-10 w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="mb-1 flex h-16 w-16 items-center justify-center rounded-full bg-white p-1 shadow-lg ring-4 ring-white/10">
                                <img
                                    src={ustpLogo}
                                    alt="USTP Logo"
                                    className="size-full object-contain"
                                />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium text-white">{title}</h1>
                            <p className="text-center text-sm text-blue-100/80">
                                {description}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white p-6 text-slate-900 shadow-xl">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
