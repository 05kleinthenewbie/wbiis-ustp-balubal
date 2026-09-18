import { Head } from '@inertiajs/react';
import { ArrowRight, Check, Monitor, Moon, Package, Palette, Sun } from 'lucide-react';
import { useState } from 'react';
import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import { useAppearance } from '@/hooks/use-appearance';
import { edit as editAppearance } from '@/routes/appearance';
import type { Appearance } from '@/hooks/use-appearance';

const themeOptions: { value: Appearance; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
];

const accentColors = [
    { name: 'USTP Navy', value: '#1a1851' },
    { name: 'USTP Gold', value: '#fcb315' },
    { name: 'Charcoal', value: '#151515' },
    { name: 'Cool Gray', value: '#b3b3b3' },
];

function ToggleSwitch({
    checked,
    onChange,
}: {
    checked: boolean;
    onChange: (checked: boolean) => void;
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={cn(
                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                checked ? 'bg-ustp-navy' : 'bg-slate-200',
            )}
        >
            <span
                className={cn(
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                    checked ? 'translate-x-5' : 'translate-x-0',
                )}
            />
        </button>
    );
}

export default function Appearance() {
    const { appearance, updateAppearance } = useAppearance();
    const [compactView, setCompactView] = useState(false);
    const [highContrast, setHighContrast] = useState(true);

    return (
        <>
            <Head title="Appearance settings" />

            <h1 className="sr-only">Appearance settings</h1>

            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
                {/* Left Main Appearance Card */}
                <div className="space-y-8 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-8 lg:col-span-8">
                    {/* Card Header */}
                    <div className="flex items-start gap-4 border-b border-slate-100 pb-6">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700">
                            <Palette className="size-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                Appearance settings
                            </h2>
                            <p className="text-sm text-slate-500">
                                Update the appearance settings for your account
                            </p>
                        </div>
                    </div>

                    {/* Interface Theme Section */}
                    <div className="space-y-3">
                        <label className="block text-xs font-bold tracking-wider text-slate-400 uppercase">
                            Interface Theme
                        </label>

                        <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-slate-200 bg-slate-100/90 p-1.5">
                            {themeOptions.map(({ value, label, icon: Icon }) => {
                                const active = appearance === value;

                                return (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => updateAppearance(value)}
                                        className={cn(
                                            'flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm transition-all',
                                            active
                                                ? 'border border-slate-200/60 bg-white font-semibold text-slate-900 shadow-sm'
                                                : 'font-medium text-slate-600 hover:bg-slate-200/50 hover:text-slate-900',
                                        )}
                                    >
                                        <Icon
                                            className={cn(
                                                'size-4',
                                                !active &&
                                                    'text-slate-400',
                                                active && value === 'light' &&
                                                    'text-amber-500',
                                                active && value === 'dark' &&
                                                    'text-slate-800',
                                                active && value === 'system' &&
                                                    'text-slate-600',
                                            )}
                                        />
                                        <span>{label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Live Preview Section */}
                    <div className="space-y-3">
                        <label className="block text-xs font-bold tracking-wider text-slate-400 uppercase">
                            Live Preview
                        </label>

                        <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50/70 p-5">
                            <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                                <div className="flex min-w-0 items-center gap-3.5">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-amber-200 bg-amber-50 text-amber-600">
                                        <Package className="size-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="truncate text-sm font-semibold text-slate-900">
                                            Balubal Lab 302 Reservation
                                        </h4>
                                        <p className="mt-0.5 text-xs text-slate-400">
                                            ICT Request #2024-049
                                        </p>
                                    </div>
                                </div>
                                <span className="inline-flex shrink-0 items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                    Active
                                </span>
                            </div>

                            <div className="flex items-center justify-between px-1 text-xs">
                                <span className="text-slate-500">
                                    Interface Tone:{' '}
                                    <strong className="font-semibold text-slate-800">
                                        Crisp White &amp; Navy
                                    </strong>
                                </span>
                                <span className="font-bold text-ustp-gold-dark">
                                    Applied
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Accessibility & View Options Section */}
                    <div className="space-y-6 border-t border-slate-100 pt-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="space-y-0.5">
                                <h4 className="text-sm font-semibold text-slate-900">
                                    Compact View Mode
                                </h4>
                                <p className="text-xs text-slate-500">
                                    Reduce list and card spacing for higher
                                    information density
                                </p>
                            </div>
                            <ToggleSwitch
                                checked={compactView}
                                onChange={setCompactView}
                            />
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            <div className="space-y-0.5">
                                <h4 className="text-sm font-semibold text-slate-900">
                                    High Contrast Text
                                </h4>
                                <p className="text-xs text-slate-500">
                                    Enhance clarity and contrast under bright
                                    ambient sunlight
                                </p>
                            </div>
                            <ToggleSwitch
                                checked={highContrast}
                                onChange={setHighContrast}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Supplementary Column */}
                <div className="space-y-6 lg:col-span-4">
                    {/* Campus Accent Tone Card */}
                    <div className="space-y-4 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900">
                                Campus Accent Tone
                            </h3>
                            <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-ustp-gold-dark uppercase">
                                Default
                            </span>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-500">
                            The Balubal Campus Portal enforces standardized USTP
                            institutional color tokens for accessibility and
                            identity consistency.
                        </p>
                        <div className="grid grid-cols-4 gap-2 pt-2">
                            {accentColors.map((color, index) => (
                                <button
                                    key={color.name}
                                    type="button"
                                    title={color.name}
                                    className={cn(
                                        'flex h-10 cursor-pointer items-center justify-center rounded-lg text-white transition-opacity',
                                        index === 0 &&
                                            'ring-2 ring-offset-2',
                                    )}
                                    style={
                                        {
                                            backgroundColor: color.value,
                                            '--tw-ring-color': color.value,
                                        } as CSSProperties
                                    }
                                >
                                    {index === 0 && <Check className="size-4" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Portal Information Box */}
                    <div className="space-y-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-6">
                        <div className="flex items-center gap-2 text-sm font-semibold text-blue-900">
                            <Palette className="size-4 text-blue-600" />
                            <span>Need Accessibility Support?</span>
                        </div>
                        <p className="text-xs leading-relaxed text-blue-800/80">
                            Faculty and personnel requiring specialized contrast
                            or screen-reader layouts can contact the USTP Balubal
                            ICT Helpdesk directly.
                        </p>
                        <div className="pt-2">
                            <a
                                href="#"
                                className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900 hover:underline"
                            >
                                Contact ICT Helpdesk <ArrowRight className="size-3" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [
        {
            title: 'Appearance settings',
            href: editAppearance(),
        },
    ],
};