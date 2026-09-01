import { Form, Head, Link, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

    return (
        <>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile settings</h1>

            <div className="space-y-6">
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
                        <div className="rounded-xl border border-[#1a2035] bg-[#0f1723] p-6">
                            <div className="space-y-5">
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="name"
                                        className="text-sm text-white/60"
                                    >
                                        Name
                                    </Label>

                                    <Input
                                        id="name"
                                        className="mt-1 block w-full border-[#1a2035] bg-[#070b18] text-white placeholder:text-white/30 focus-visible:border-ustp-navy focus-visible:ring-1 focus-visible:ring-ustp-navy/25"
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
                                    <Label
                                        htmlFor="email"
                                        className="text-sm text-white/60"
                                    >
                                        Email address
                                    </Label>

                                    <Input
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full border-[#1a2035] bg-[#070b18] text-white placeholder:text-white/30 focus-visible:border-ustp-navy focus-visible:ring-1 focus-visible:ring-ustp-navy/25"
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
                                            <p className="-mt-4 text-sm text-white/40">
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
                                                <div className="mt-2 text-sm font-medium text-emerald-400">
                                                    A new verification link has been
                                                    sent to your email address.
                                                </div>
                                            )}
                                        </div>
                                    )}
                            </div>

                            <div className="mt-6 flex items-center gap-4 border-t border-[#1a2035] pt-5">
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
