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
        <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6">
            <div className="w-full max-w-lg overflow-hidden rounded-xl border">
                <div className="bg-ustp-navy-dark px-8 pt-9 pb-7 text-center">
                    <Link href={home()} className="inline-block">
                        <div className="mx-auto mb-3.5 flex size-14 items-center justify-center rounded-full bg-white">
                            <img
                                src={ustpLogo}
                                alt="USTP Logo"
                                className="size-full rounded-full object-contain p-1.5"
                            />
                        </div>
                    </Link>
                    <p className="mb-1.5 text-xs font-medium tracking-wide text-ustp-gold uppercase">
                        USTP Balubal Campus
                    </p>
                    <h1 className="text-base leading-snug font-medium text-white uppercase">
                        A Web-Based ICT Management
                        <br />
                        and Information System
                    </h1>
                </div>

                <div className="h-1.5 bg-ustp-gold" />

                <div className="bg-background px-8 py-8">
                    <div className="mb-6 space-y-1 text-center">
                        <h2 className="text-lg font-medium">{title}</h2>
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
