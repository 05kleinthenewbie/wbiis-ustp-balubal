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
import { dashboard, login, register } from '@/routes';

const modules = [
    {
        icon: FileText,
        title: 'Service Requests',
        description: 'Submit and track ICT service requests for equipment, software, and network support across campus.',
    },
    {
        icon: ClipboardList,
        title: 'Job Order Management',
        description: 'ICT staff can create, assign, and monitor job orders to resolve service requests efficiently.',
    },
    {
        icon: Inbox,
        title: 'Inventory Management',
        description: 'Track ICT equipment, property records, and monitor defective items across the campus.',
    },
    {
        icon: Calendar,
        title: 'Facility Booking',
        description: 'Reserve computer laboratories and audio-visual rooms for academic and official use.',
    },
    {
        icon: Shield,
        title: 'Incident Recording',
        description: 'Document ICT-related incidents and monitor user responsibilities and liabilities.',
    },
    {
        icon: Mail,
        title: 'Notifications',
        description: 'Receive email updates on request statuses, approvals, bookings, and system alerts.',
    },
];

const roles = [
    {
        icon: Users,
        role: 'Faculty & Staff',
        description: 'Submit service requests, book facilities, and track your ICT-related concerns in real time.',
        features: ['Submit Requests', 'Book Facilities', 'Track Status', 'View Updates'],
    },
    {
        icon: Shield,
        role: 'ICT Administrators',
        description: 'Manage requests, process job orders, monitor inventory, and oversee all ICT operations.',
        features: ['Manage Requests', 'Process Job Orders', 'Monitor Inventory', 'Record Incidents'],
    },
    {
        icon: Wifi,
        role: 'Students',
        description: 'Request email accounts and Office 365 access for academic purposes.',
        features: ['Email Requests', 'Office 365 Access', 'Track Requests'],
    },
];

const workflowSteps = [
    { step: '1', title: 'Submit Request', description: 'User submits a service request or facility booking through the portal.' },
    { step: '2', title: 'Review & Assign', description: 'ICT administrator reviews and creates a job order for the request.' },
    { step: '3', title: 'Process & Resolve', description: 'Assigned staff processes the request and updates the status.' },
    { step: '4', title: 'Notify & Close', description: 'User receives notification and confirms resolution. Request is closed.' },
];

export default function Welcome() {
    const { auth } = usePage().props;
    const dashboardUrl = dashboard();
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(1);

    useEffect(() => {
        const queries = [
            { query: '(min-width: 1024px)', count: 3 },
            { query: '(min-width: 640px)', count: 2 },
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

            <div className="min-h-screen bg-white">
                {/* Header */}
                <header className="border-b border-ustp-gray-medium bg-white">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex size-12 items-center justify-center rounded-lg bg-white p-1 shadow-sm">
                                <img
                                    src={ustpLogo}
                                    alt="USTP Logo"
                                    className="size-full object-contain"
                                />
                            </div>
                            <div>
                                <p className="font-serif text-lg font-bold leading-tight text-ustp-navy">
                                    University of Science and Technology
                                </p>
                                <p className="font-serif text-sm font-bold text-ustp-navy">
                                    of Southern Philippines
                                </p>
                                <p className="text-[11px] uppercase tracking-[0.12em] text-ustp-navy/60">
                                    Balubal Campus, Cagayan de Oro City
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {auth.user ? (
                                <Link
                                    href={dashboardUrl}
                                    className="rounded-lg bg-ustp-navy px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:bg-ustp-navy-dark hover:shadow-lg"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="rounded-lg px-5 py-2.5 text-sm font-medium text-ustp-navy transition-colors hover:bg-ustp-gray"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={register()}
                                        className="rounded-lg border-2 border-ustp-gold bg-ustp-gold px-5 py-2.5 text-sm font-bold text-ustp-navy transition-all hover:bg-ustp-gold-dark hover:text-white"
                                    >
                                        Register
                                    </Link>
                                </>
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
                            backgroundImage: 'radial-gradient(circle, #F2A900 1px, transparent 1px)',
                            backgroundSize: '32px 32px',
                        }}
                    />
                    {/* Real module badges — subtle fill behind stat cards */}
                    <div className="pointer-events-none absolute -right-6 top-1/2 hidden -translate-y-1/2 grid-cols-3 gap-5 opacity-[0.08] lg:grid">
                        <AlertTriangle className="size-16 text-white" strokeWidth={1} />
                        <Shield className="size-16 text-white" strokeWidth={1} />
                        <ClipboardList className="size-16 text-white" strokeWidth={1} />
                        <Box className="size-16 text-white" strokeWidth={1} />
                        <Calendar className="size-16 text-white" strokeWidth={1} />
                        <Wifi className="size-16 text-white" strokeWidth={1} />
                        <FileText className="size-16 text-white" strokeWidth={1} />
                        <Mail className="size-16 text-white" strokeWidth={1} />
                        <Inbox className="size-16 text-white" strokeWidth={1} />
                    </div>
                    <div className="relative mx-auto w-full max-w-7xl px-6 py-20 lg:py-28">
                        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-12">
                            <div>
                                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-ustp-gold/30 bg-ustp-gold/10 px-4 py-1.5">
                                    <span className="size-1.5 rounded-full bg-ustp-gold" />
                                    <span className="text-xs font-medium uppercase tracking-wider text-ustp-gold">
                                        Web-Based ICT Management and Information System
                                    </span>
                                </div>
                                <h1 className="font-serif text-4xl font-bold leading-tight text-white sm:text-5xl">
                                    USTP Balubal{' '}
                                    <span className="text-ustp-gold">ICT Portal</span>
                                </h1>
                                <p className="mt-7 max-w-lg text-lg leading-relaxed text-white/70 sm:text-xl sm:leading-relaxed">
                                    A centralized platform for managing ICT service requests,
                                    job orders, inventory, defective equipment, incident reporting
                                    with user liability, facility bookings, and notifications
                                    across the Balubal Campus.
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
                                            <Link
                                                href={register()}
                                                className="group flex items-center gap-2 rounded-lg bg-ustp-gold px-7 py-3.5 text-sm font-bold text-ustp-navy shadow-lg shadow-ustp-gold/20 transition-all hover:-translate-y-0.5 hover:bg-ustp-gold-dark hover:text-white hover:shadow-xl hover:shadow-ustp-gold/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-ustp-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ustp-navy"
                                            >
                                                Get Started
                                                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                                            </Link>
                                            <Link
                                                href={login()}
                                                className="rounded-lg border-2 border-white/20 px-7 py-3.5 text-sm font-medium text-white/80 transition-all hover:-translate-y-0.5 hover:border-ustp-gold/50 hover:bg-white/5 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-ustp-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ustp-navy"
                                            >
                                                Log in to your account
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="hidden lg:block">
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { icon: FileText, label: 'Service Requests', value: 'Streamlined' },
                                        { icon: Calendar, label: 'Facility Booking', value: 'Reservable' },
                                        { icon: Box, label: 'Inventory', value: 'Tracked' },
                                        { icon: Shield, label: 'Incidents', value: 'Accountable' },
                                    ].map((stat) => {
                                        const Icon = stat.icon;

                                        return (
                                            <div
                                                key={stat.label}
                                                className="group/card rounded-xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-ustp-gold/60 hover:bg-white/[0.07] hover:shadow-lg"
                                            >
                                                <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-ustp-gold/15 text-ustp-gold transition-colors group-hover/card:bg-ustp-gold/25">
                                                    <Icon className="size-4" />
                                                </div>
                                                <p className="text-xs uppercase tracking-wider text-white/40">
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
                <section className="bg-white">
                    <div className="mx-auto max-w-7xl px-6 py-16">
                        <div className="mb-12 text-center">
                            <h2 className="font-serif text-2xl font-bold text-ustp-navy sm:text-3xl">
                                System Modules
                            </h2>
                            <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-ustp-gold" />
                            <p className="mx-auto mt-4 max-w-2xl text-sm text-ustp-navy/60">
                                The system integrates six core modules to centralize and streamline
                                ICT management operations at USTP Balubal Campus.
                            </p>
                        </div>

                        <div className="relative">
                            <div className="mx-auto overflow-hidden py-2">
                                <div
                                    className="flex transition-transform duration-500 ease-out"
                                    style={{ transform: `translateX(-${currentPage * (100 / itemsPerView)}%)` }}
                                >
                                    {modules.map((mod) => {
                                        const Icon = mod.icon;

                                        return (
                                            <div
                                                key={mod.title}
                                                className="min-w-0 shrink-0 px-3"
                                                style={{ flexBasis: `${100 / itemsPerView}%` }}
                                            >
                                                <div className="group flex h-full flex-col rounded-xl border border-ustp-gray-medium bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-ustp-gold/30 hover:shadow-lg">
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
                                        onClick={() => setCurrentPage((page) => Math.max(page - 1, 0))}
                                        disabled={currentPage === 0}
                                        aria-label="Previous slide"
                                        className="absolute left-0 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-ustp-gray-medium bg-white text-ustp-navy shadow-md transition-all hover:border-ustp-gold hover:text-ustp-gold disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <ChevronLeft className="size-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages - 1))}
                                        disabled={currentPage === totalPages - 1}
                                        aria-label="Next slide"
                                        className="absolute right-0 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-ustp-gray-medium bg-white text-ustp-navy shadow-md transition-all hover:border-ustp-gold hover:text-ustp-gold disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <ChevronRight className="size-5" />
                                    </button>

                                    <div className="mt-8 flex items-center justify-center gap-2">
                                        {Array.from({ length: totalPages }).map((_, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                onClick={() => setCurrentPage(index)}
                                                aria-label={`Go to slide ${index + 1}`}
                                                className={`h-2.5 rounded-full transition-all ${
                                                    index === currentPage
                                                        ? 'w-8 bg-ustp-gold'
                                                        : 'w-2.5 bg-ustp-navy/20 hover:bg-ustp-navy/40'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="bg-ustp-gray/50">
                    <div className="mx-auto max-w-7xl px-6 py-16">
                        <div className="mb-12 text-center">
                            <h2 className="font-serif text-2xl font-bold text-ustp-navy sm:text-3xl">
                                How It Works
                            </h2>
                            <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-ustp-gold" />
                            <p className="mx-auto mt-4 max-w-2xl text-sm text-ustp-navy/60">
                                From submission to resolution, the system streamlines the entire
                                ICT service workflow.
                            </p>
                        </div>

                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {workflowSteps.map((step, index) => (
                                <div key={step.step} className="relative text-center">
                                    <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-ustp-navy text-lg font-bold text-white">
                                        {step.step}
                                    </div>
                                    <h3 className="font-serif text-base font-bold text-ustp-navy">
                                        {step.title}
                                    </h3>
                                    <p className="mt-2 text-sm text-ustp-navy/60">
                                        {step.description}
                                    </p>
                                    {index < workflowSteps.length - 1 && (
                                        <div className="absolute left-[calc(50%+2rem)] top-6 hidden h-px w-[calc(100%-4rem)] bg-ustp-gold/30 lg:block" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* User Roles */}
                <section className="bg-white">
                    <div className="mx-auto max-w-7xl px-6 py-16">
                        <div className="mb-12 text-center">
                            <h2 className="font-serif text-2xl font-bold text-ustp-navy sm:text-3xl">
                                Built for Every Role
                            </h2>
                            <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-ustp-gold" />
                            <p className="mx-auto mt-4 max-w-2xl text-sm text-ustp-navy/60">
                                The system provides tailored access and features for each user type
                                within the campus.
                            </p>
                        </div>

                        <div className="grid gap-6 lg:grid-cols-3">
                            {roles.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <div
                                        key={item.role}
                                        className="rounded-xl border border-ustp-gray-medium bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                                    >
                                        <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-ustp-gold/10 text-ustp-gold">
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
                                                <li key={feature} className="flex items-center gap-2 text-sm text-ustp-navy/70">
                                                    <CheckCircle className="size-4 text-ustp-gold" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-ustp-gray/50">
                    <div className="mx-auto max-w-7xl px-6 py-16">
                        <div className="rounded-2xl bg-ustp-navy p-10 text-center sm:p-14">
                            <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
                                Ready to streamline your ICT services?
                            </h2>
                            <p className="mx-auto mt-4 max-w-lg text-white/60">
                                Join the USTP Balubal ICT Portal to submit requests, book
                                facilities, and manage ICT operations all in one place.
                            </p>
                            <div className="mt-8 flex flex-wrap justify-center gap-4">
                                {!auth.user && (
                                    <>
                                        <Link
                                            href={register()}
                                            className="group flex items-center gap-2 rounded-lg bg-ustp-gold px-7 py-3.5 text-sm font-bold text-ustp-navy shadow-lg transition-all hover:bg-ustp-gold-dark hover:text-white hover:shadow-xl"
                                        >
                                            Create an Account
                                            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                                        </Link>
                                        <Link
                                            href={login()}
                                            className="rounded-lg border-2 border-white/20 px-7 py-3.5 text-sm font-medium text-white/80 transition-all hover:border-ustp-gold/50 hover:text-white"
                                        >
                                            Already have an account? Log in
                                        </Link>
                                    </>
                                )}
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
                                        <p className="text-[10px] uppercase tracking-wider text-white/50">
                                            ICT Portal
                                        </p>
                                    </div>
                                </div>
                                <p className="mt-4 text-sm leading-relaxed text-white/50">
                                    Web-Based ICT Management and Information System for
                                    USTP Balubal Campus, Cagayan de Oro City.
                                </p>
                                <div className="mt-4 flex gap-3">
                                    <a href="https://www.facebook.com/USTPBalubal" target="_blank" rel="noopener noreferrer" className="flex size-9 items-center justify-center rounded-lg border border-white/10 text-white/50 transition-all hover:border-ustp-gold hover:text-ustp-gold">
                                        <Facebook className="size-4" />
                                    </a>
                                    <a href="mailto:balubal@ustp.edu.ph" className="flex size-9 items-center justify-center rounded-lg border border-white/10 text-white/50 transition-all hover:border-ustp-gold hover:text-ustp-gold">
                                        <Mail className="size-4" />
                                    </a>
                                    <a href="#" className="flex size-9 items-center justify-center rounded-lg border border-white/10 text-white/50 transition-all hover:border-ustp-gold hover:text-ustp-gold">
                                        <Phone className="size-4" />
                                    </a>
                                    <a href="#" className="flex size-9 items-center justify-center rounded-lg border border-white/10 text-white/50 transition-all hover:border-ustp-gold hover:text-ustp-gold">
                                        <MapPin className="size-4" />
                                    </a>
                                </div>
                            </div>

                            <div>
                                <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-ustp-gold">
                                    System Modules
                                </h4>
                                <ul className="space-y-2.5">
                                    {['Service Requests', 'Job Orders', 'Inventory', 'Facility Booking', 'Incident Reports', 'Notifications'].map((link) => (
                                        <li key={link}>
                                            <a href="#" className="text-sm text-white/50 transition-colors hover:text-ustp-gold">
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-ustp-gold">
                                    Contact
                                </h4>
                                <ul className="space-y-2.5 text-sm text-white/50">
                                    <li className="flex items-start gap-2">
                                        <MapPin className="mt-0.5 size-4 shrink-0 text-ustp-gold/60" />
                                        <span>Balubal, Cagayan de Oro City, Philippines</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Phone className="size-4 shrink-0 text-ustp-gold/60" />
                                        <span>+63 88 856 1234</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Mail className="size-4 shrink-0 text-ustp-gold/60" />
                                        <span>balubal@ustp.edu.ph</span>
                                    </li>
                                </ul>
                                <div className="mt-6 flex gap-3">
                                    <a
                                        href="#"
                                        className="rounded-lg border border-ustp-gold/40 px-4 py-2 text-xs font-bold uppercase tracking-wider text-ustp-gold transition-all hover:bg-ustp-gold hover:text-ustp-navy"
                                    >
                                        Feedback
                                    </a>
                                    <a
                                        href="#"
                                        className="rounded-lg border border-ustp-gold/40 px-4 py-2 text-xs font-bold uppercase tracking-wider text-ustp-gold transition-all hover:bg-ustp-gold hover:text-ustp-navy"
                                    >
                                        Survey
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/10">
                        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 sm:flex-row">
                            <p className="text-xs text-white/30">
                                &copy; {new Date().getFullYear()} USTP Balubal ICT Portal. All rights reserved.
                            </p>
                            <p className="text-xs text-white/30">
                                University of Science and Technology of Southern Philippines
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
