import { Form, Head } from '@inertiajs/react';
import { Mail, ShieldCheck } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import StatusAlert, { isAlertMessage } from '@/components/status-alert';
import { Button } from '@/components/tailgrids/core/button';
import TextLink from '@/components/text-link';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login as portal, register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    showRegister?: boolean;
    title?: string;
};

export default function Login({
    status,
    canResetPassword,
    showRegister = false,
    title = 'Sign in',
}: Props) {
    return (
        <>
            <Head title={title} />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            <div className="grid gap-1.5">
                                <Label
                                    htmlFor="email"
                                    className="flex items-center justify-between text-sm font-medium text-foreground"
                                >
                                    <span>Email Address</span>
                                    <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                                        Official
                                    </span>
                                </Label>
                                <div className="relative flex items-center">
                                    <Mail className="pointer-events-none absolute top-1/2 left-3 size-[18px] -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="username"
                                        placeholder="name.id@ustp.edu.ph"
                                        className="h-11 rounded-lg border-border pl-10 text-sm transition-all focus-visible:border-ustp-navy focus-visible:ring-ustp-navy/20"
                                    />
                                </div>
                                {errors.email && (
                                    <StatusAlert
                                        message={errors.email}
                                        variant={
                                            isAlertMessage(errors.email)
                                                ? 'warning'
                                                : 'error'
                                        }
                                        className="mt-1.5"
                                    />
                                )}
                            </div>

                            <div className="grid gap-1.5">
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="password"
                                        className="text-sm font-medium text-foreground"
                                    >
                                        Password
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-xs font-medium text-ustp-navy hover:text-ustp-navy-dark dark:text-white/80 dark:hover:text-white"
                                            tabIndex={5}
                                        >
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    className="h-11 rounded-lg border-border pl-10 text-sm transition-all focus-visible:border-ustp-navy focus-visible:ring-ustp-navy/20"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center gap-2.5">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="border-border data-[state=checked]:border-ustp-navy data-[state=checked]:bg-ustp-navy dark:border-neutral-600"
                                />
                                <Label
                                    htmlFor="remember"
                                    className="text-sm text-muted-foreground"
                                >
                                    Remember me for 30 days
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="mt-1 w-full rounded-xl"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Sign in
                            </Button>
                        </div>

                        {showRegister && (
                            <div className="text-center text-sm text-muted-foreground">
                                Don't have an account?{' '}
                                <TextLink
                                    href={register()}
                                    data-test="register-link"
                                    tabIndex={5}
                                    className="font-medium text-ustp-navy hover:text-ustp-navy-dark dark:text-white/80 dark:hover:text-white"
                                >
                                    Create an account
                                </TextLink>
                            </div>
                        )}
                    </>
                )}
            </Form>

            {status && <StatusAlert message={status} />}
        </>
    );
}

Login.layout = {
    title: 'Administrator Sign In',
    description:
        'Authorized access for USTP Balubal Campus administrators, faculty, and staff only.',
    icon: ShieldCheck,
    iconClassName:
        'bg-orange-50 text-orange-500 dark:bg-orange-950/50 dark:text-orange-400',
    backHref: portal().url,
    backTestId: 'back-to-portal-button',
};
