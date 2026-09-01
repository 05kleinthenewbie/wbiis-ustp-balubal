import { Form, Head } from '@inertiajs/react';
import { Building, Lock, Mail, User } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
                                    <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        name="name"
                                        placeholder="Juan Dela Cruz"
                                        className="h-11 border-border pl-9 text-sm transition-colors focus-visible:border-ustp-navy focus-visible:ring-ustp-navy/20"
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
                                    <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        tabIndex={2}
                                        autoComplete="email"
                                        name="email"
                                        placeholder="your.email@example.com"
                                        className="h-11 border-border pl-9 text-sm transition-colors focus-visible:border-ustp-navy focus-visible:ring-ustp-navy/20"
                                    />
                                </div>
                                <InputError message={errors.email} />
                                <p className="text-xs text-muted-foreground">
                                    Don't have a USTP email yet? You can
                                    request one after registering.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="role"
                                        className="text-sm font-medium text-foreground"
                                    >
                                        Role
                                    </Label>
                                    <Select name="role" required>
                                        <SelectTrigger
                                            id="role"
                                            className="h-11 border-border text-sm transition-colors focus:border-ustp-navy focus:ring-ustp-navy/20"
                                        >
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="faculty_staff">
                                                Faculty/Staff
                                            </SelectItem>
                                            <SelectItem value="student">
                                                Student
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.role} />
                                </div>

                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="department"
                                        className="text-sm font-medium text-foreground"
                                    >
                                        Department
                                    </Label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="department"
                                            type="text"
                                            required
                                            tabIndex={3}
                                            name="department"
                                            placeholder="e.g. CITC"
                                            className="h-11 border-border pl-9 text-sm transition-colors focus-visible:border-ustp-navy focus-visible:ring-ustp-navy/20"
                                        />
                                    </div>
                                    <InputError message={errors.department} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label
                                    htmlFor="password"
                                    className="text-sm font-medium text-foreground"
                                >
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <PasswordInput
                                        id="password"
                                        required
                                        tabIndex={4}
                                        autoComplete="new-password"
                                        name="password"
                                        placeholder="Create a password"
                                        passwordrules={passwordRules}
                                        className="h-11 border-border pl-9 text-sm transition-colors focus-visible:border-ustp-navy focus-visible:ring-ustp-navy/20"
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
                                    <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <PasswordInput
                                        id="password_confirmation"
                                        required
                                        tabIndex={5}
                                        autoComplete="new-password"
                                        name="password_confirmation"
                                        placeholder="Confirm your password"
                                        passwordrules={passwordRules}
                                        className="h-11 border-border pl-9 text-sm transition-colors focus-visible:border-ustp-navy focus-visible:ring-ustp-navy/20"
                                    />
                                </div>
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 h-11 w-full bg-ustp-navy text-white shadow-md shadow-ustp-navy/20 transition-all hover:bg-ustp-navy-dark hover:shadow-lg hover:shadow-ustp-navy/25 active:scale-[0.98]"
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
                                <div className="w-full border-t border-border" />
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
                                className="font-medium text-ustp-navy hover:text-ustp-navy-dark"
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
