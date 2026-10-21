import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    Box,
    Calendar,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    ClipboardList,
    Facebook,
    FileText,
    Inbox,
    Mail,
    MapPin,
    Phone,
    Shield,
    Users,
    Wifi,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import ustpLogo from '@/assets/ustp-logo.png';
import { Button } from '@/components/tailgrids/core/button';
import { dashboard, login } from '@/routes';
import { login as adminLogin } from '@/routes/admin';
import { login as facultyLogin } from '@/routes/faculty';
import { login as studentLogin } from '@/routes/student';

const modules = [
    {
        icon: FileText,
        title: 'Service Requests',
        description:
            'Submit and track ICT service requests for equipment, software, and network support across campus.',
    },
    {
        icon: ClipboardList,
        title: 'Job Orders',
        description:
            'ICT staff can create, assign, and monitor job orders to resolve service requests efficiently.',
    },
    {
        icon: Inbox,
        title: 'Inventory',
        description:
            'Track ICT equipment, property records, and monitor defective items across the campus.',
    },
    {
        icon: Calendar,
        title: 'Facility Booking',
        description:
            'Reserve computer laboratories and audio-visual rooms for academic and official use.',
    },
    {
        icon: Shield,
        title: 'Laboratory Incident Reports',
        description:
            'Document laboratory incidents and monitor user responsibilities and liabilities.',
    },
    {
        icon: Mail,
        title: 'Notifications',
        description:
            'Receive email updates on request statuses, approvals, bookings, and system alerts.',
    },
];

const roles = [
    {
        icon: Users,
        role: 'Faculty & Staff',
        description:
            'Submit service requests, book facilities, and track your ICT-related concerns in real time.',
        features: [
            'Submit Requests',
            'Book Facilities',
            'Track Status',
            'View Updates',
        ],
        href: facultyLogin().url,
    },
    {
        icon: Shield,
        role: 'ICT Administrators',
        description:
            'Manage requests, process job orders, monitor inventory, and oversee all ICT operations.',
        features: [
            'Manage Requests',
            'Process Job Orders',
            'Monitor Inventory',
            'Record Laboratory Incidents',
        ],
        href: adminLogin().url,
    },
    {
        icon: Wifi,
        role: 'Students',
        description:
            'Request email accounts and Office 365 access for academic purposes.',
        features: ['Email Requests', 'Office 365 Access', 'Track Requests'],
        href: studentLogin().url,
    },
];

const workflowSteps = [
    {
        step: '1',
        title: 'Submit Request',
        description:
            'User submits a service request or facility booking through the portal.',
    },
    {
        step: '2',
        title: 'Review & Assign',
        description:
            'ICT administrator reviews and creates a job order for the request.',
    },
    {
        step: '3',
        title: 'Process & Resolve',
        description:
            'Assigned staff processes the request and updates the status.',
    },
    {
        step: '4',
        title: 'Notify & Close',
        description:
            'User receives notification and confirms resolution. Request is closed.',
    },
];

export default function Welcome() {
    const { auth } = usePage().props;
    const dashboardUrl = dashboard();
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(1);
    const [isScrolled, setIsScrolled] = useState(false);
    const [scrollingDown, setScrollingDown] = useState(false);

    useEffect(() => {
        let previous = window.scrollY;

        const onScroll = () => {
            const current = window.scrollY;

            setIsScrolled(current > 150);

            if (current > previous && current > 150) {
                setScrollingDown(true);
            } else {
                setScrollingDown(false);
            }

            previous = current;
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    useEffect(() => {
        const queries = [
            { query: '(min-width: 1024px)', count: 3 },
            {
                query: '(min-width: 640px) and (max-width: 1023px)',
                count: 2,
            },
            { query: '(max-width: 639px)', count: 1 },
        ];

        const mediaQueryLists = queries.map(({ query, count }) => {
            const maxPage = Math.ceil(modules.length / count) - 1;

            const mql = window.matchMedia(query);

            if (mql.matches) {
                setItemsPerView(count);
                setCurrentPage((page) => Math.min(page, maxPage));
            }

            const handler = (event: MediaQueryListEvent) => {
                if (event.matches) {
                    setItemsPerView(count);
                    setCurrentPage((page) => Math.min(page, maxPage));
                }
            };

            mql.addEventListener('change', handler);

            return { mql, handler };
        });

        return () => {
            mediaQueryLists.forEach(({ mql, handler }) => {
                mql.removeEventListener('change', handler);
            });
        };
    }, []);

    const totalPages = Math.ceil(modules.length / itemsPerView);

    return (
        <>
            <Head title="USTP Balubal ICT Portal" />

            <div
                id="top"
                className="min-h-screen scroll-smooth bg-white pt-24 sm:pt-20"
            >
                {/* Header */}
                <header
                    className={`fixed inset-x-0 top-0 z-40 border-b transition-all duration-300 ease-in-out motion-reduce:transition-none ${
                        isScrolled
                            ? 'border-black/5 bg-white/90 shadow-lg backdrop-blur-md'
                            : 'border-ustp-gray-medium bg-white'
                    } ${scrollingDown ? '-translate-y-1 motion-reduce:translate-y-0' : 'translate-y-0'}`}
                >
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
                        <a
                            href="#top"
                            className="flex items-center gap-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ustp-gold focus-visible:ring-offset-2"
                        >
                            <div className="flex size-12 items-center justify-center rounded-lg bg-white p-1 shadow-sm">
                                <img
                                    src={ustpLogo}
                                    alt="USTP Logo"
                                    className="size-full object-contain"
                                />
                            </div>
                            <div>
                                <p className="font-serif text-base leading-tight font-bold text-ustp-navy sm:text-lg">
                                    University of Science and Technology
                                </p>
                                <p className="font-serif text-xs font-bold text-ustp-navy sm:text-sm">
                                    of Southern Philippines
                                </p>
                                <p className="hidden text-[11px] tracking-[0.12em] text-ustp-navy/60 uppercase sm:block">
                                    Balubal Campus, Cagayan de Oro City
                                </p>
                            </div>
                        </a>

                        <nav
                            aria-label="Page sections"
                            className="hidden items-center gap-1 md:flex"
                        >
                            {[
                                { label: 'Modules', href: '#modules' },
                                { label: 'How It Works', href: '#how-it-works' },
                                { label: 'Roles', href: '#roles' },
                            ].map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="rounded-lg px-3 py-2 text-sm font-medium text-ustp-navy/70 transition-colors hover:bg-ustp-gray/70 hover:text-ustp-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-ustp-gold"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </nav>

                        <div className="flex items-center gap-3">
                            {auth.user ? (
                                <Link
                                    href={dashboardUrl}
                                    className="rounded-lg bg-ustp-navy px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:bg-ustp-navy-dark hover:shadow-lg"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <Button
                                    asChild
                                    variant="primary"
                                    size="md"
                                    className="rounded-xl px-5"
                                >
                                    <Link href={login()}>Sign in</Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative flex min-h-screen items-center overflow-hidden bg-ustp-navy">
                    <div className="absolute inset-0 bg-gradient-to-r from-ustp-navy-dark to-ustp-navy" />
                    {/* Corner glow for depth */}
                    <div className="pointer-events-none absolute -top-32 right-0 h-[600px] w-[600px] rounded-full bg-ustp-light-blue/[0.08] blur-3xl" />
                    <div className="pointer-events-none absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-ustp-gold/[0.05] blur-3xl" />
                    <div
                        className="pointer-events-none absolute inset-0 opacity-5"
                        style={{
                            backgroundImage:
                                'radial-gradient(circle, #F2A900 1px, transparent 1px)',
                            backgroundSize: '32px 32px',
                        }}
                    />
                    {/* Real module badges — subtle fill behind stat cards */}
                    <div className="pointer-events-none absolute top-1/2 -right-6 hidden -translate-y-1/2 grid-cols-3 gap-5 opacity-[0.08] lg:grid">
                        <AlertTriangle
                            className="size-16 text-white"
                            strokeWidth={1}
                        />
                        <Shield
                            className="size-16 text-white"
                            strokeWidth={1}
                        />
                        <ClipboardList
                            className="size-16 text-white"
                            strokeWidth={1}
                        />
                        <Box className="size-16 text-white" strokeWidth={1} />
                        <Calendar
                            className="size-16 text-white"
                            strokeWidth={1}
                        />
                        <Wifi className="size-16 text-white" strokeWidth={1} />
                        <FileText
                            className="size-16 text-white"
                            strokeWidth={1}
                        />
                        <Mail className="size-16 text-white" strokeWidth={1} />
                        <Inbox className="size-16 text-white" strokeWidth={1} />
                    </div>
                    <div className="relative mx-auto w-full max-w-7xl px-6 py-20 lg:py-28">
                        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-12">
                            <div>
                                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-ustp-gold/30 bg-ustp-gold/10 px-4 py-1.5">
                                    <span className="size-1.5 rounded-full bg-ustp-gold" />
                                    <span className="text-xs font-medium tracking-wider text-ustp-gold uppercase">
                                        Web-Based ICT Management and Information
                                        System
                                    </span>
                                </div>
                                <h1 className="font-serif text-3xl leading-tight font-bold text-white sm:text-5xl lg:text-[3.4rem]">
                                    USTP Balubal{' '}
                                    <span className="text-ustp-gold">
                                        ICT Portal
                                    </span>
                                </h1>
                                <p className="mt-6 max-w-lg text-base leading-relaxed text-white/70 sm:mt-7 sm:text-lg">
                                    A centralized platform for managing ICT
                                    service requests, job orders, inventory,
                                    defective equipment, incident reporting with
                                    user liability, facility bookings, and
                                    notifications across the Balubal Campus.
                                </p>
                                <div className="mt-10 flex flex-wrap gap-4">
                                    {auth.user ? (
                                        <Link
                                            href={dashboardUrl}
                                            className="group flex items-center gap-2 rounded-lg bg-ustp-gold px-7 py-3.5 text-sm font-bold text-ustp-navy shadow-lg shadow-ustp-gold/20 transition-all hover:-translate-y-0.5 hover:bg-ustp-gold-dark hover:text-white hover:shadow-xl hover:shadow-ustp-gold/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-ustp-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ustp-navy"
                                        >
                                            Go to Dashboard
                                            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                                        </Link>
                                    ) : (
                                        <>
                                            <Button
                                                asChild
                                                variant="secondary"
                                                size="lg"
                                                className="px-7"
                                            >
                                                <Link href={login()}>
                                                    Sign in
                                                </Link>
                                            </Button>
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="lg"
                                                className="border-white/20 px-7 text-white/80 hover:border-ustp-gold/50 hover:bg-white/5 hover:text-white"
                                            >
                                                <Link href={facultyLogin()}>
                                                    Faculty Registration
                                                </Link>
                                            </Button>
                                        </>
                                    )}
                                </div>

                                {!auth.user && (
                                    <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/50">
                                        <span className="inline-flex items-center gap-1.5">
                                            <CheckCircle className="size-3.5 text-ustp-gold" />
                                            Campus-only access
                                        </span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <CheckCircle className="size-3.5 text-ustp-gold" />
                                            Role-based dashboards
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="hidden lg:block">
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        {
                                            icon: FileText,
                                            label: 'Service Requests',
                                            value: 'Streamlined',
                                        },
                                        {
                                            icon: Calendar,
                                            label: 'Facility Booking',
                                            value: 'Reservable',
                                        },
                                        {
                                            icon: Box,
                                            label: 'Inventory',
                                            value: 'Tracked',
                                        },
                                        {
                                            icon: Shield,
                                            label: 'Laboratory Incidents',
                                            value: 'Accountable',
                                        },
                                    ].map((stat) => {
                                        const Icon = stat.icon;

                                        return (
                                            <div
                                                key={stat.label}
                                                className="group/card rounded-xl border border-white/15 bg-gradient-to-br from-white/10 to-white/[0.02] p-5 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-ustp-gold/60 hover:shadow-lg hover:shadow-black/20"
                                            >
                                                <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-ustp-gold/15 text-ustp-gold transition-colors group-hover/card:bg-ustp-gold/25">
                                                    <Icon className="size-4" />
                                                </div>
                                                <p className="text-xs tracking-wider text-white/40 uppercase">
                                                    {stat.label}
                                                </p>
                                                <p className="mt-1 font-serif text-lg font-bold text-ustp-gold">
                                                    {stat.value}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* System Modules */}
                <section id="modules" className="scroll-mt-24 bg-white">
                    <div className="mx-auto max-w-7xl px-6 py-20">
                        <div className="mb-12 text-center">
                            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-ustp-gold/10 px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-ustp-gold-dark uppercase">
                                Core Modules
                            </span>
                            <h2 className="font-serif text-2xl font-bold text-ustp-navy sm:text-3xl">
                                System Modules
                            </h2>
                            <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-ustp-gold" />
                            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ustp-navy/60">
                                The system integrates six core modules to
                                centralize and streamline ICT management
                                operations at USTP Balubal Campus.
                            </p>
                        </div>

                        <div className="relative">
                            <div className="mx-auto overflow-hidden px-9 py-2 sm:px-0">
                                <div
                                    className="flex transition-transform duration-500 ease-out"
                                    style={{
                                        transform: `translateX(-${currentPage * 100}%)`,
                                    }}
                                >
                                    {modules.map((mod) => {
                                        const Icon = mod.icon;

                                        return (
                                            <div
                                                key={mod.title}
                                                className="min-w-0 shrink-0 px-3"
                                                style={{
                                                    flexBasis: `${100 / itemsPerView}%`,
                                                }}
                                            >
                                                <div className="group flex h-full flex-col rounded-xl border border-ustp-gray-medium bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-ustp-gold/40 hover:shadow-lg">
                                                    <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-ustp-navy/5 text-ustp-navy transition-colors group-hover:bg-ustp-gold/10 group-hover:text-ustp-gold">
                                                        <Icon className="size-6" />
                                                    </div>
                                                    <h3 className="font-serif text-lg font-bold text-ustp-navy">
                                                        {mod.title}
                                                    </h3>
                                                    <p className="mt-2 text-sm leading-relaxed text-ustp-navy/60">
                                                        {mod.description}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {totalPages > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setCurrentPage((page) =>
                                                Math.max(page - 1, 0),
                                            )
                                        }
                                        disabled={currentPage === 0}
                                        aria-label="Previous slide"
                                        className="absolute top-1/2 left-0 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-ustp-gray-medium bg-white text-ustp-navy shadow-md transition-all hover:border-ustp-gold hover:text-ustp-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-ustp-gold disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <ChevronLeft className="size-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setCurrentPage((page) =>
                                                Math.min(
                                                    page + 1,
                                                    totalPages - 1,
                                                ),
                                            )
                                        }
                                        disabled={
                                            currentPage === totalPages - 1
                                        }
                                        aria-label="Next slide"
                                        className="absolute top-1/2 right-0 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-ustp-gray-medium bg-white text-ustp-navy shadow-md transition-all hover:border-ustp-gold hover:text-ustp-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-ustp-gold disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <ChevronRight className="size-5" />
                                    </button>

                                    <div className="mt-8 flex items-center justify-center gap-2">
                                        {Array.from({ length: totalPages }).map(
                                            (_, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() =>
                                                        setCurrentPage(index)
                                                    }
                                                    aria-label={`Go to slide ${index + 1}`}
                                                    className={`h-2.5 rounded-full transition-all ${
                                                        index === currentPage
                                                            ? 'w-8 bg-ustp-gold'
                                                            : 'w-2.5 bg-ustp-navy/20 hover:bg-ustp-navy/40'
                                                    }`}
                                                />
                                            ),
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section id="how-it-works" className="scroll-mt-24 bg-ustp-gray/50">
                    <div className="mx-auto max-w-7xl px-6 py-20">
                        <div className="mb-12 text-center">
                            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-ustp-gold-dark uppercase shadow-sm">
                                Workflow
                            </span>
                            <h2 className="font-serif text-2xl font-bold text-ustp-navy sm:text-3xl">
                                How It Works
                            </h2>
                            <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-ustp-gold" />
                            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ustp-navy/60">
                                From submission to resolution, the system
                                streamlines the entire ICT service workflow.
                            </p>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {workflowSteps.map((step) => (
                                <div
                                    key={step.step}
                                    className="group relative rounded-xl border border-ustp-gray-medium bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-ustp-gold/40 hover:shadow-lg"
                                >
                                    <span className="text-[11px] font-bold tracking-[0.18em] text-ustp-navy/40 uppercase">
                                        Step {step.step}
                                    </span>
                                    <div className="mt-3 mb-4 flex size-11 items-center justify-center rounded-full bg-ustp-navy text-lg font-bold text-white transition-colors group-hover:bg-ustp-gold group-hover:text-ustp-navy">
                                        {step.step}
                                    </div>
                                    <h3 className="font-serif text-base font-bold text-ustp-navy">
                                        {step.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-ustp-navy/60">
                                        {step.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* User Roles */}
                <section id="roles" className="scroll-mt-24 bg-white">
                    <div className="mx-auto max-w-7xl px-6 py-20">
                        <div className="mb-12 text-center">
                            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-ustp-gold/10 px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-ustp-gold-dark uppercase">
                                Access Levels
                            </span>
                            <h2 className="font-serif text-2xl font-bold text-ustp-navy sm:text-3xl">
                                Built for Every Role
                            </h2>
                            <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-ustp-gold" />
                            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ustp-navy/60">
                                The system provides tailored access and features
                                for each user type within the campus.
                            </p>
                        </div>

                        <div className="grid gap-6 lg:grid-cols-3">
                            {roles.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <div
                                        key={item.role}
                                        className="group flex flex-col rounded-xl border border-ustp-gray-medium bg-white p-8 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-ustp-gold/40 hover:shadow-lg"
                                    >
                                        <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-ustp-gold/10 text-ustp-gold transition-colors group-hover:bg-ustp-gold/20">
                                            <Icon className="size-6" />
                                        </div>
                                        <h3 className="font-serif text-lg font-bold text-ustp-navy">
                                            {item.role}
                                        </h3>
                                        <p className="mt-2 text-sm leading-relaxed text-ustp-navy/60">
                                            {item.description}
                                        </p>
                                        <ul className="mt-4 space-y-2">
                                            {item.features.map((feature) => (
                                                <li
                                                    key={feature}
                                                    className="flex items-center gap-2 text-sm text-ustp-navy/70"
                                                >
                                                    <CheckCircle className="size-4 shrink-0 text-ustp-gold" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        <Link
                                            href={item.href}
                                            className="mt-6 inline-flex items-center gap-1.5 border-t border-ustp-gray-medium pt-4 text-sm font-bold text-ustp-navy transition-colors hover:text-ustp-gold-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-ustp-gold"
                                        >
                                            Sign in
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-ustp-gray/50">
                    <div className="mx-auto max-w-7xl px-6 py-20">
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ustp-navy to-ustp-navy-dark p-10 text-center shadow-xl sm:p-14">
                            <div className="pointer-events-none absolute -top-24 -right-16 size-64 rounded-full bg-ustp-gold/10 blur-3xl" />
                            <div className="pointer-events-none absolute -bottom-24 -left-16 size-64 rounded-full bg-ustp-light-blue/10 blur-3xl" />
                            <div className="relative">
                                <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-ustp-gold/30 bg-ustp-gold/10 px-3 py-1 text-[11px] font-bold tracking-[0.18em] text-ustp-gold uppercase">
                                    Get Started
                                </span>
                                <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
                                    Ready to streamline your ICT services?
                                </h2>
                                <p className="mx-auto mt-4 max-w-lg text-white/60">
                                    Sign in to the USTP Balubal ICT Portal to
                                    submit requests, book facilities, and manage
                                    ICT operations all in one place.
                                </p>
                                <div className="mt-8 flex flex-wrap justify-center gap-4">
                                    {!auth.user && (
                                        <>
                                            <Button
                                                asChild
                                                variant="secondary"
                                                size="lg"
                                                className="px-7"
                                            >
                                                <Link href={login()}>
                                                    Sign in
                                                </Link>
                                            </Button>
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="lg"
                                                className="border-white/20 px-7 text-white/80 hover:border-ustp-gold/50 hover:bg-white/5 hover:text-white"
                                            >
                                                <Link href={facultyLogin()}>
                                                    Faculty Registration
                                                </Link>
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-ustp-navy text-white">
                    <div className="mx-auto max-w-7xl px-6 py-12">
                        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-lg bg-white p-1">
                                        <img
                                            src={ustpLogo}
                                            alt="USTP Logo"
                                            className="size-full object-contain"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-serif text-sm font-bold text-white">
                                            USTP Balubal
                                        </p>
                                        <p className="text-[10px] tracking-wider text-white/50 uppercase">
                                            ICT Portal
                                        </p>
                                    </div>
                                </div>
                                <p className="mt-4 text-sm leading-relaxed text-white/50">
                                    Web-Based ICT Management and Information
                                    System for USTP Balubal Campus, Cagayan de
                                    Oro City.
                                </p>
                                <div className="mt-4 flex gap-3">
                                    <a
                                        href="https://www.facebook.com/USTPBalubal"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="USTP Balubal on Facebook"
                                        className="flex size-9 items-center justify-center rounded-lg border border-white/10 text-white/50 transition-all hover:border-ustp-gold hover:text-ustp-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-ustp-gold"
                                    >
                                        <Facebook className="size-4" />
                                    </a>
                                    <a
                                        href="mailto:balubal@ustp.edu.ph"
                                        aria-label="Email USTP Balubal"
                                        className="flex size-9 items-center justify-center rounded-lg border border-white/10 text-white/50 transition-all hover:border-ustp-gold hover:text-ustp-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-ustp-gold"
                                    >
                                        <Mail className="size-4" />
                                    </a>
                                </div>
                            </div>

                            <div>
                                <h4 className="mb-4 text-sm font-bold tracking-wider text-ustp-gold uppercase">
                                    System Modules
                                </h4>
                                <ul className="space-y-2.5">
                                    {[
                                        'Service Requests',
                                        'Job Orders',
                                        'Inventory',
                                        'Facility Booking',
                                        'Laboratory Incident Reports',
                                        'Notifications',
                                    ].map((link) => (
                                        <li key={link}>
                                            <a
                                                href="#modules"
                                                className="text-sm text-white/50 transition-colors hover:text-ustp-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-ustp-gold"
                                            >
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="mb-4 text-sm font-bold tracking-wider text-ustp-gold uppercase">
                                    Contact
                                </h4>
                                <ul className="space-y-2.5 text-sm text-white/50">
                                    <li className="flex items-start gap-2">
                                        <MapPin className="mt-0.5 size-4 shrink-0 text-ustp-gold/60" />
                                        <span>
                                            Balubal, Cagayan de Oro City,
                                            Philippines
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Phone className="size-4 shrink-0 text-ustp-gold/60" />
                                        <span>+63 88 856 1234</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Mail className="size-4 shrink-0 text-ustp-gold/60" />
                                        <a
                                            href="mailto:balubal@ustp.edu.ph"
                                            className="transition-colors hover:text-ustp-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-ustp-gold"
                                        >
                                            balubal@ustp.edu.ph
                                        </a>
                                    </li>
                                </ul>
                                <div className="mt-6 flex gap-3">
                                    <a
                                        href="mailto:balubal@ustp.edu.ph?subject=ICT%20Portal%20Feedback"
                                        className="rounded-lg border border-ustp-gold/40 px-4 py-2 text-xs font-bold tracking-wider text-ustp-gold uppercase transition-all hover:bg-ustp-gold hover:text-ustp-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-ustp-gold"
                                    >
                                        Feedback
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/10">
                        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 sm:flex-row">
                            <p className="text-xs text-white/30">
                                &copy; {new Date().getFullYear()} USTP Balubal
                                ICT Portal. All rights reserved.
                            </p>
                            <p className="text-xs text-white/30">
                                University of Science and Technology of Southern
                                Philippines
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
