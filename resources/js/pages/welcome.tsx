import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    Box,
    Calendar,
    ClipboardList,
    FileText,
    Zap,
} from 'lucide-react';
import ustpLogo from '@/assets/ustp-logo.png';
import { dashboard, login, register } from '@/routes';

export default function Welcome() {
    const { auth } = usePage().props;
    const dashboardUrl = dashboard();

    return (
        <>
            <Head title="USTP Balubal ICT Portal" />

            <div className="relative min-h-screen overflow-hidden bg-[#070b18] text-white">
                {/* Ambient glows */}
                <div className="pointer-events-none absolute -top-40 left-1/4 h-[600px] w-[600px] rounded-full bg-ustp-navy/[0.06] blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-ustp-gold/[0.02] blur-3xl" />

                {/* Dot pattern */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle, #fcb315 1px, transparent 1px)',
                        backgroundSize: '28px 28px',
                    }}
                />

                {/* Nav */}
                <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-white p-1.5">
                            <img
                                src={ustpLogo}
                                alt="USTP Logo"
                                className="size-full object-contain"
                            />
                        </div>
                        <div>
                            <p className="text-sm font-semibold tracking-tight text-white">
                                USTP Balubal
                            </p>
                            <p className="text-[10px] uppercase tracking-[0.15em] text-white/40">
                                ICT Portal
                            </p>
                        </div>
                    </div>

                    <nav className="flex items-center gap-3">
                        {auth.user ? (
                            <Link
                                href={dashboardUrl}
                                className="rounded-xl bg-ustp-navy px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-ustp-navy/20 transition-all hover:bg-ustp-navy-dark hover:shadow-ustp-navy/30"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="rounded-xl px-5 py-2.5 text-sm font-medium text-white/70 transition-colors hover:text-white"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={register()}
                                    className="rounded-xl bg-ustp-navy px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-ustp-navy/20 transition-all hover:bg-ustp-navy-dark hover:shadow-ustp-navy/30"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                {/* Hero */}
                <main className="relative z-10 mx-auto max-w-6xl px-6 pt-16 pb-24 lg:pt-24 lg:pb-32">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-ustp-gold/20 bg-ustp-gold/[0.06] px-4 py-1.5">
                            <span className="size-1.5 rounded-full bg-ustp-gold shadow-[0_0_8px_rgba(252,179,21,0.5)]" />
                            <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-ustp-gold/80">
                                Balubal Campus, Cagayan de Oro City
                            </span>
                        </div>

                        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                            Web-Based ICT
                            <br />
                            <span className="text-ustp-light-blue">Management and Information System</span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/50">
                            A centralized platform for managing ICT service requests,
                            facility bookings, incident reports, and inventory tracking
                            across the university.
                        </p>

                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            {auth.user ? (
                                <Link
                                    href={dashboardUrl}
                                    className="group flex items-center gap-2 rounded-xl bg-ustp-navy px-7 py-3.5 text-sm font-medium text-white shadow-lg shadow-ustp-navy/25 transition-all hover:bg-ustp-navy-dark hover:shadow-ustp-navy/35"
                                >
                                    Go to Dashboard
                                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={register()}
                                        className="group flex items-center gap-2 rounded-xl bg-ustp-navy px-7 py-3.5 text-sm font-medium text-white shadow-lg shadow-ustp-navy/25 transition-all hover:bg-ustp-navy-dark hover:shadow-ustp-navy/35"
                                    >
                                        Get Started
                                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                                    </Link>
                                    <Link
                                        href={login()}
                                        className="rounded-xl border border-white/10 px-7 py-3.5 text-sm font-medium text-white/70 transition-all hover:border-white/20 hover:text-white"
                                    >
                                        Log in to your account
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Features */}
                    <div className="mx-auto mt-24 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                            {
                                icon: FileText,
                                title: 'Service Requests',
                                description: 'Submit and track ICT service requests for equipment, software, and network support.',
                                color: 'bg-ustp-light-blue/10 text-ustp-light-blue',
                            },
                            {
                                icon: Calendar,
                                title: 'Facility Bookings',
                                description: 'Reserve computer labs, AV rooms, and other ICT facilities for academic use.',
                                color: 'bg-ustp-gold/10 text-ustp-gold',
                            },
                            {
                                icon: AlertTriangle,
                                title: 'Incident Reports',
                                description: 'Report equipment failures, security incidents, and facility issues promptly.',
                                color: 'bg-red-400/10 text-red-400',
                            },
                            {
                                icon: ClipboardList,
                                title: 'Job Orders',
                                description: 'ICT staff can manage, assign, and track resolution of service requests.',
                                color: 'bg-emerald-400/10 text-emerald-400',
                            },
                            {
                                icon: Box,
                                title: 'Inventory Management',
                                description: 'Track ICT equipment, property records, and maintenance status across campus.',
                                color: 'bg-purple-400/10 text-purple-400',
                            },
                            {
                                icon: Zap,
                                title: 'Dashboard Overview',
                                description: 'Monitor system activity, pending tasks, and key metrics at a glance.',
                                color: 'bg-amber-400/10 text-amber-400',
                            },
                        ].map((feature) => {
                            const Icon = feature.icon;

                            return (
                                <div
                                    key={feature.title}
                                    className="group rounded-2xl border border-[#1a2035] bg-[#0f1723] p-5 transition-all hover:border-white/10 hover:bg-[#111827]"
                                >
                                    <div className={`mb-4 flex size-10 items-center justify-center rounded-xl ${feature.color}`}>
                                        <Icon className="size-5" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-white">
                                        {feature.title}
                                    </h3>
                                    <p className="mt-1.5 text-xs leading-relaxed text-white/40">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Roles */}
                    <div className="mx-auto mt-20 max-w-2xl text-center">
                        <h2 className="text-xl font-semibold tracking-tight text-white">
                            Built for every role
                        </h2>
                        <p className="mt-2 text-sm text-white/40">
                            Whether you're a student, faculty member, or ICT administrator
                        </p>

                        <div className="mt-8 grid gap-4 sm:grid-cols-3">
                            {[
                                {
                                    role: 'Students',
                                    desc: 'Request email accounts and Office 365 access',
                                    accent: 'border-ustp-light-blue/20 bg-ustp-light-blue/[0.04]',
                                },
                                {
                                    role: 'Faculty & Staff',
                                    desc: 'Submit service requests and book facilities',
                                    accent: 'border-ustp-gold/20 bg-ustp-gold/[0.04]',
                                },
                                {
                                    role: 'ICT Admin',
                                    desc: 'Manage requests, inventory, and system settings',
                                    accent: 'border-emerald-400/20 bg-emerald-400/[0.04]',
                                },
                            ].map((item) => (
                                <div
                                    key={item.role}
                                    className={`rounded-xl border p-5 ${item.accent}`}
                                >
                                    <p className="text-sm font-semibold text-white">
                                        {item.role}
                                    </p>
                                    <p className="mt-1 text-xs text-white/40">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="relative z-10 border-t border-white/[0.06] bg-[#070b18]/80">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
                        <p className="text-xs text-white/30">
                            USTP Balubal ICT Portal &copy; {new Date().getFullYear()}
                        </p>
                        <p className="text-xs text-white/30">
                            University of Science and Technology of Southern Philippines
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
