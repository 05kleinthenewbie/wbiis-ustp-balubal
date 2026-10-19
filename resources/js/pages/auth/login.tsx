import { Form, Head } from '@inertiajs/react';
import { ArrowRight, Info, Mail } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Log in" />

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
                                    <span>USTP Email Address</span>
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
                                        autoComplete="email"
                                        placeholder="name.id@ustp.edu.ph"
                                        className="h-11 rounded-lg border-border pl-10 text-sm transition-all focus-visible:border-ustp-navy focus-visible:ring-ustp-navy/20"
                                    />
                                </div>
                                <InputError message={errors.email} />
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
                                className="mt-1 h-11 w-full rounded-xl bg-ustp-gold font-semibold text-ustp-navy shadow-sm shadow-ustp-gold/30 transition-all hover:-translate-y-0.5 hover:bg-ustp-gold-dark hover:text-white hover:shadow-md hover:shadow-ustp-gold/30 active:scale-[0.98]"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Log in to Portal
                                {!processing && (
                                    <ArrowRight className="size-[18px]" />
                                )}
                            </Button>
                        </div>

                        <div className="relative my-1 flex items-center justify-center">
                            <div className="h-px w-full bg-border dark:bg-white/10" />
                            <span className="absolute bg-white px-3 text-[11px] font-medium tracking-wider text-muted-foreground uppercase dark:bg-neutral-900">
                                or
                            </span>
                        </div>

                        <div className="pt-1 text-center text-sm text-muted-foreground">
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

                        <div className="flex flex-col gap-2.5">
                            <div className="flex items-start gap-2 rounded-lg border border-ustp-gold/40 bg-ustp-gold/10 p-2.5">
                                <Info className="mt-0.5 size-4 shrink-0 text-ustp-gold-dark dark:text-ustp-gold-light" />
                                <p className="text-[11px] leading-relaxed text-ustp-navy/70 dark:text-white/60">
                                    <strong className="font-semibold text-ustp-navy dark:text-white">
                                        Notice:
                                    </strong>{' '}
                                    This system is exclusive to USTP Balubal
                                    Campus operations. Accounts from other USTP
                                    campuses cannot be authenticated here.
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-700">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Welcome Back!',
    description:
        'Authorized access for USTP Balubal Campus faculty, staff, and personnel only.',
};
