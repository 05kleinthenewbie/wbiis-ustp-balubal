import { Form, Head, Link, usePage } from '@inertiajs/react';
import { Mail } from 'lucide-react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInitials } from '@/hooks/use-initials';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth;
};

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<PageProps>().props;
    const getInitials = useInitials();
    const role = (auth.user.role as { role_name?: string } | undefined)
        ?.role_name;

    return (
        <>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile settings</h1>

            <div className="space-y-6">
                <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                    <Avatar className="size-16 shrink-0 rounded-2xl ring-2 ring-ustp-gold/50">
                        {auth.user.avatar ? (
                            <AvatarImage
                                src={auth.user.avatar}
                                alt={auth.user.name}
                            />
                        ) : null}
                        <AvatarFallback className="rounded-2xl bg-ustp-navy text-xl font-bold text-ustp-gold">
                            {getInitials(auth.user.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                        <p className="truncate text-lg font-semibold text-slate-900">
                            {auth.user.name}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-slate-500">
                            <Mail className="size-3.5 shrink-0" />
                            {auth.user.email}
                        </p>
                        {role && (
                            <span className="mt-2 inline-flex rounded-lg bg-ustp-gold/10 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-ustp-gold-dark uppercase">
                                {role.replace(/_/g, ' ')}
                            </span>
                        )}
                    </div>
                </div>

                <Heading
                    variant="small"
                    title="Profile"
                    description="Update your name and email address"
                />

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
                            <div className="space-y-5">
                                <div className="grid gap-2">
                                    <Label htmlFor="name" className="text-slate-700">
                                        Name
                                    </Label>

                                    <Input
                                        id="name"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.name}
                                        name="name"
                                        required
                                        autoComplete="name"
                                        placeholder="Full name"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.name}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="text-slate-700">
                                        Email address
                                    </Label>

                                    <Input
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.email}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder="Email address"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.email}
                                    />
                                </div>

                                {mustVerifyEmail &&
                                    auth.user.email_verified_at === null && (
                                        <div>
                                            <p className="-mt-4 text-sm text-slate-500">
                                                Your email address is unverified.{' '}
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className="text-ustp-light-blue underline decoration-ustp-light-blue/50 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current"
                                                >
                                                    Click here to re-send the
                                                    verification email.
                                                </Link>
                                            </p>

                                            {status ===
                                                'verification-link-sent' && (
                                                <div className="mt-2 text-sm font-medium text-emerald-600">
                                                    A new verification link has been
                                                    sent to your email address.
                                                </div>
                                            )}
                                        </div>
                                    )}
                            </div>

                            <div className="mt-6 flex items-center gap-4 border-t border-slate-100 pt-5">
                                <Button
                                    disabled={processing}
                                    data-test="update-profile-button"
                                    className="bg-ustp-navy text-white shadow-lg shadow-ustp-navy/20 hover:bg-ustp-navy-dark"
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                    )}
                </Form>
            </div>

            <DeleteUser />
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Profile settings',
            href: edit(),
        },
    ],
};