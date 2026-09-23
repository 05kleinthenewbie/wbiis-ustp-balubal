import { Form, Head } from '@inertiajs/react';
import { Lock, Mail, User } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    return (
        <>
            <Head title="Register" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="name"
                                    className="text-sm font-medium text-foreground"
                                >
                                    Full name
                                </Label>
                                <div className="relative">
                                    <User className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        name="name"
                                        placeholder="Juan Dela Cruz"
                                        className="h-11 rounded-lg border-border pl-9 text-sm transition-colors focus-visible:border-ustp-navy focus-visible:ring-ustp-navy/20"
                                    />
                                </div>
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-medium text-foreground"
                                >
                                    Email address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        tabIndex={2}
                                        autoComplete="email"
                                        name="email"
                                        placeholder="your.email@example.com"
                                        className="h-11 rounded-lg border-border pl-9 text-sm transition-colors focus-visible:border-ustp-navy focus-visible:ring-ustp-navy/20"
                                    />
                                </div>
                                <InputError message={errors.email} />
                                <p className="text-xs text-muted-foreground">
                                    Don't have a USTP email yet? You can request
                                    one after registering.
                                </p>
                            </div>

                            <input
                                type="hidden"
                                name="role"
                                value="faculty_staff"
                            />
                            <InputError message={errors.role} />

                            <div className="grid gap-2">
                                <Label
                                    htmlFor="password"
                                    className="text-sm font-medium text-foreground"
                                >
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <PasswordInput
                                        id="password"
                                        required
                                        tabIndex={4}
                                        autoComplete="new-password"
                                        name="password"
                                        placeholder="Create a password"
                                        passwordrules={passwordRules}
                                        className="h-11 rounded-lg border-border pl-9 text-sm transition-colors focus-visible:border-ustp-navy focus-visible:ring-ustp-navy/20"
                                    />
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label
                                    htmlFor="password_confirmation"
                                    className="text-sm font-medium text-foreground"
                                >
                                    Confirm password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <PasswordInput
                                        id="password_confirmation"
                                        required
                                        tabIndex={5}
                                        autoComplete="new-password"
                                        name="password_confirmation"
                                        placeholder="Confirm your password"
                                        passwordrules={passwordRules}
                                        className="h-11 rounded-lg border-border pl-9 text-sm transition-colors focus-visible:border-ustp-navy focus-visible:ring-ustp-navy/20"
                                    />
                                </div>
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 h-11 w-full rounded-lg bg-ustp-gold font-semibold text-ustp-navy shadow-md shadow-ustp-gold/20 transition-all hover:-translate-y-0.5 hover:bg-ustp-gold-dark hover:text-white hover:shadow-lg hover:shadow-ustp-gold/30 active:scale-[0.98]"
                                tabIndex={6}
                                disabled={processing}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Create account
                            </Button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border dark:border-white/10" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    or
                                </span>
                            </div>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <TextLink
                                href={login()}
                                data-test="team-invitation-login-link"
                                tabIndex={7}
                                className="font-medium text-ustp-navy hover:text-ustp-navy-dark dark:text-white/80 dark:hover:text-white"
                            >
                                Sign in
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Create an account',
    description: 'Join the USTP Balubal ICT Portal to get started',
};
