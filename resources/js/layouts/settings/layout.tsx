import type { PropsWithChildren } from 'react';
import SettingsSidebarAccordion from '@/components/settings-sidebar-accordion';

export default function SettingsLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-full flex-1 bg-slate-50 p-4 text-slate-800 md:p-6 lg:p-8">
            <div className="mx-auto max-w-6xl space-y-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                        Settings
                    </h1>
                    <p className="text-sm text-slate-500">
                        Manage your profile and account settings
                    </p>
                </div>

                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
                    <aside className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm lg:col-span-4 xl:col-span-3">
                        <SettingsSidebarAccordion />
                    </aside>

                    <section className="space-y-8 lg:col-span-8 xl:col-span-9">
                        {children}
                    </section>
                </div>
            </div>
        </div>
    );
}
