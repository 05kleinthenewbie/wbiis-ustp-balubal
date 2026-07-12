import { Link } from '@inertiajs/react';
import ustpLogo from '@/assets/ustp-logo.png';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-ustp-navy-dark p-10 text-white lg:flex">
                <Link
                    href={home()}
                    className="relative z-20 flex items-center gap-2 text-lg font-medium"
                >
                    <img src={ustpLogo} alt="USTP Logo" className="size-8 rounded bg-white p-0.5" />
                    USTP Balubal ICT Portal
                </Link>

                <div className="relative z-20 mt-auto">
                    <p className="mb-2 text-sm font-medium text-ustp-gold">
                        Welcome back
                    </p>
                    <h2 className="mb-3 text-2xl font-medium">
                        Manage ICT services for USTP Balubal Campus
                    </h2>
                    <p className="text-sm leading-relaxed text-blue-100">
                        Submit requests, track job orders, book facilities,
                        and report incidents in one place.
                    </p>
                </div>
            </div>

            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Link
                        href={home()}
                        className="relative z-20 flex items-center justify-center gap-2 lg:hidden"
                    >
                        <img src={ustpLogo} alt="USTP Logo" className="h-10 sm:h-12" />
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-medium">{title}</h1>
                        <p className="text-sm text-balance text-muted-foreground">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
