import { Form, Head } from '@inertiajs/react';
import { GraduationCap, Info } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import StatusAlert from '@/components/status-alert';
import { Button } from '@/components/tailgrids/core/button';
import TextLink from '@/components/text-link';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login as portal } from '@/routes';
import { authenticate } from '@/routes/student';
import { request as forgotPassword } from '@/routes/student/password';

type Props = {
    status?: string;
};

export default function StudentLogin({ status }: Props) {
    return (
        <>
            <Head title="Student Sign In" />

            <Form
                {...authenticate.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            <div className="grid gap-1.5">
                                <Label
                                    htmlFor="id_number"
                                    className="text-sm font-medium text-foreground"
                                >
                                    Student ID
                                </Label>
                                <div className="relative flex items-center">
                                    <GraduationCap className="pointer-events-none absolute top-1/2 left-3 size-[18px] -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="id_number"
                                        type="text"
                                        name="id_number"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="username"
                                        inputMode="numeric"
                                        maxLength={10}
                                        placeholder="Student ID number"
                                        className="h-11 rounded-lg border-border pl-10 text-sm transition-all focus-visible:border-ustp-navy focus-visible:ring-ustp-navy/20"
                                    />
                                </div>
                                {errors.id_number && (
                                    <StatusAlert
                                        message={errors.id_number}
                                        variant="warning"
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
                                    <TextLink
                                        href={forgotPassword()}
                                        tabIndex={5}
                                        className="text-xs font-medium text-ustp-navy hover:text-ustp-navy-dark"
                                    >
                                        Forgot password?
                                    </TextLink>
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
                                data-test="student-login-button"
                            >
                                {processing && <Spinner />}
                                Sign in
                            </Button>
                        </div>

                        <div className="flex items-start gap-2 rounded-lg border border-ustp-gold/40 bg-ustp-gold/10 p-2.5">
                            <Info className="mt-0.5 size-4 shrink-0 text-ustp-gold-dark dark:text-ustp-gold-light" />
                            <p className="text-[11px] leading-relaxed text-ustp-navy/70 dark:text-white/60">
                                <strong className="font-semibold text-ustp-navy dark:text-white">
                                    First time signing in?
                                </strong>{' '}
                                Enter your student ID number as both your
                                username and password. You can change your
                                password anytime from your profile. If your
                                account is not yet active, contact the ICT
                                office.
                            </p>
                        </div>
                    </>
                )}
            </Form>

            {status && <StatusAlert message={status} />}
        </>
    );
}

StudentLogin.layout = {
    title: 'Student Portal',
    description:
        'Sign in with your student ID number and password to request ICT services.',
    icon: GraduationCap,
    backHref: portal().url,
    backTestId: 'back-to-portal-button',
};
