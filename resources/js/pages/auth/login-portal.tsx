import { Head, Link } from '@inertiajs/react';
import { Briefcase, GraduationCap, Home, ShieldCheck } from 'lucide-react';
import StatusAlert from '@/components/status-alert';
import { Button } from '@/components/ui/button';
import { home } from '@/routes';
import { login as adminLogin } from '@/routes/admin';
import { login as facultyLogin } from '@/routes/faculty';
import { login as studentLogin } from '@/routes/student';

type Props = {
    status?: string;
};

type PortalOption = {
    title: string;
    description: string;
    buttonLabel: string;
    icon: typeof Briefcase;
    iconClassName: string;
    buttonClassName: string;
    href: string;
    dataTest: string;
};

const options: PortalOption[] = [
    {
        title: 'Faculty',
        description:
            'Sign in with your official USTP email, or create a faculty account for ICT office approval.',
        buttonLabel: 'Sign in',
        icon: Briefcase,
        iconClassName:
            'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
        buttonClassName:
            'bg-blue-600 text-white shadow-sm shadow-blue-600/30 hover:bg-blue-700',
        href: facultyLogin().url,
        dataTest: 'portal-faculty-login-button',
    },
    {
        title: 'For Administrators',
        description:
            'Sign in with your official USTP email to manage requests, inventory, bookings, and campus reports.',
        buttonLabel: 'Sign in',
        icon: ShieldCheck,
        iconClassName:
            'bg-orange-50 text-orange-500 dark:bg-orange-950/50 dark:text-orange-400',
        buttonClassName:
            'bg-orange-500 text-white shadow-sm shadow-orange-500/30 hover:bg-orange-600',
        href: adminLogin().url,
        dataTest: 'portal-admin-login-button',
    },
    {
        title: 'Student Portal',
        description:
            'Sign in with your student ID number to request ICT services, book facilities, and track your tickets.',
        buttonLabel: 'Sign in',
        icon: GraduationCap,
        iconClassName:
            'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400',
        buttonClassName:
            'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 hover:bg-emerald-700',
        href: studentLogin().url,
        dataTest: 'portal-student-login-button',
    },
];

export default function LoginPortal({ status }: Props) {
    return (
        <>
            <Head title="Select Portal" />

            <div className="mb-4">
                <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="-ml-2 text-muted-foreground hover:text-ustp-navy dark:hover:text-white"
                >
                    <Link href={home()} data-test="portal-home-button">
                        <Home className="size-4" />
                        Back to Home
                    </Link>
                </Button>
            </div>

            {status && (
                <div className="mb-5">
                    <StatusAlert message={status} />
                </div>
            )}

            <div className="grid gap-4">
                {options.map((option) => {
                    const Icon = option.icon;

                    return (
                        <div
                            key={option.title}
                            className="flex h-full flex-col items-center rounded-2xl border border-ustp-gray-medium bg-white p-6 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
                        >
                            <div
                                className={`mb-4 flex size-16 items-center justify-center rounded-2xl ${option.iconClassName}`}
                            >
                                <Icon className="size-8" />
                            </div>

                            <h3 className="mb-2 font-serif text-lg font-bold tracking-tight text-ustp-navy dark:text-white">
                                {option.title}
                            </h3>

                            <p className="mb-5 flex-1 text-sm leading-relaxed text-muted-foreground">
                                {option.description}
                            </p>

                            <Button
                                asChild
                                className={`h-11 w-full rounded-xl font-semibold transition-all active:scale-[0.98] ${option.buttonClassName}`}
                            >
                                <Link
                                    href={option.href}
                                    data-test={option.dataTest}
                                >
                                    <Icon className="size-[18px]" />
                                    {option.buttonLabel}
                                </Link>
                            </Button>
                        </div>
                    );
                })}
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground">
                Access is limited to authorized USTP Balubal Campus students and
                personnel.
            </p>
        </>
    );
}

LoginPortal.layout = {
    title: 'Welcome to USTP Balubal',
    description: 'Choose how you would like to continue to the ICT Portal.',
};
