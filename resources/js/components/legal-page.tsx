import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';
import TextLink from '@/components/text-link';
import { register } from '@/routes';

type LegalPageProps = {
    title: string;
    updated: string;
    children: ReactNode;
};

export default function LegalPage({
    title,
    updated,
    children,
}: LegalPageProps) {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Head title={title} />

            <header className="border-b border-border bg-background/95 backdrop-blur">
                <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-3 px-4">
                    <span className="min-w-0 truncate text-sm font-semibold tracking-tight text-ustp-navy dark:text-white">
                        WBIMIS
                        <span className="hidden sm:inline">
                            {' '}
                            — USTP Balubal ICT Portal
                        </span>
                    </span>
                    <TextLink
                        href={register()}
                        className="shrink-0 text-sm font-medium whitespace-nowrap text-ustp-navy hover:text-ustp-navy-dark dark:text-white/80 dark:hover:text-white"
                    >
                        <span className="sm:hidden">Back</span>
                        <span className="hidden sm:inline">
                            Back to registration
                        </span>
                    </TextLink>
                </div>
            </header>

            <main className="mx-auto max-w-3xl px-4 py-10">
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                    {title}
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Last updated: {updated}
                </p>

                <div className="mt-8 flex flex-col gap-8 text-sm leading-relaxed text-muted-foreground">
                    {children}
                </div>
            </main>
        </div>
    );
}

export function LegalSection({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return (
        <section className="flex flex-col gap-2">
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            {children}
        </section>
    );
}
