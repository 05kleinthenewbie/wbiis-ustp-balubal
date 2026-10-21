import { Form, Head } from '@inertiajs/react';
import { GraduationCap, Lock, Mail, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import StatusAlert, { isAlertMessage } from '@/components/status-alert';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordStrength } from '@/components/ui/password-strength';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { login, privacy, terms } from '@/routes';
import { store } from '@/routes/register';
import { lookup as studentLookup } from '@/routes/register/student';

type Props = {
    passwordRules: string;
};

type LookupState = 'idle' | 'checking' | 'found' | 'not_found';

type LookupResult = {
    id: string;
    status: 'found' | 'not_found';
};

const departmentOptions = [
    { value: 'BSA', label: 'BSA' },
    { value: 'BSIT', label: 'BSIT' },
    { value: 'BTLED', label: 'BTLED' },
];

export default function Register({ passwordRules }: Props) {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('faculty_staff');
    const [employmentType, setEmploymentType] = useState('');
    const [department, setDepartment] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [lookupResult, setLookupResult] = useState<LookupResult | null>(
        null,
    );
    const isStudent = role === 'student';
    const idValid = isStudent && /^[0-9]{10}$/.test(idNumber);
    const lookupState: LookupState = !idValid
        ? 'idle'
        : lookupResult?.id === idNumber
          ? lookupResult.status
          : 'checking';

    useEffect(() => {
        if (!isStudent || !/^[0-9]{10}$/.test(idNumber)) {
            return;
        }

        if (lookupResult?.id === idNumber) {
            return;
        }

        const controller = new AbortController();
        const timer = setTimeout(async () => {
            try {
                const response = await fetch(studentLookup.url(idNumber), {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error('not found');
                }

                const data = await response.json();
                setName(data.name);
                setDepartment(data.program);
                setLookupResult({ id: idNumber, status: 'found' });
            } catch (error) {
                if (error instanceof Error && error.name === 'AbortError') {
                    return;
                }

                setName('');
                setLookupResult({ id: idNumber, status: 'not_found' });
            }
        }, 400);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [idNumber, isStudent, lookupResult]);

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
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        readOnly={
                                            isStudent &&
                                            lookupState === 'found'
                                        }
                                        placeholder="Juan Dela Cruz"
                                        className="h-11 rounded-lg border-border pl-9 text-sm transition-colors focus-visible:border-ustp-navy focus-visible:ring-ustp-navy/20 read-only:cursor-not-allowed read-only:bg-muted/50"
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
                                {isAlertMessage(errors.email ?? '') ? (
                                    <StatusAlert
                                        message={errors.email}
                                        className="mt-1.5"
                                    />
                                ) : (
                                    <InputError message={errors.email} />
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label
                                    htmlFor="role"
                                    className="text-sm font-medium text-foreground"
                                >
                                    Role
                                </Label>
                                <Select
                                    name="role"
                                    value={role}
                                    onValueChange={(value) => {
                                        setRole(value);
                                        setEmploymentType('');
                                        setDepartment('');
                                    }}
                                    required
                                >
                                    <SelectTrigger
                                        id="role"
                                        className="h-11 w-full rounded-lg border-border text-sm transition-colors focus-visible:border-ustp-navy focus-visible:ring-ustp-navy/20"
                                    >
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                            <SelectItem value="faculty_staff">
                                                Faculty
                                            </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.role} />
                            </div>

                            {isStudent && (
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="id_number"
                                        className="text-sm font-medium text-foreground"
                                    >
                                        University ID number
                                        <span className="ml-1 text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <div className="relative">
                                        <GraduationCap className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="id_number"
                                            type="text"
                                            required
                                            tabIndex={3}
                                            name="id_number"
                                            inputMode="numeric"
                                            autoComplete="off"
                                            value={idNumber}
                                            onChange={(e) =>
                                                setIdNumber(
                                                    e.target.value
                                                        .replace(/\D/g, '')
                                                        .slice(0, 10),
                                                )
                                            }
                                            placeholder="2023303709"
                                            className="h-11 rounded-lg border-border pl-9 text-sm transition-colors focus-visible:border-ustp-navy focus-visible:ring-ustp-navy/20"
                                        />
                                    </div>
                                    {lookupState === 'checking' && (
                                        <p className="text-xs text-muted-foreground">
                                            Checking ID number…
                                        </p>
                                    )}
                                    {lookupState === 'found' && (
                                        <StatusAlert
                                            message="ID found. Your details were loaded from the list."
                                            variant="success"
                                        />
                                    )}
                                    {lookupState === 'not_found' && (
                                        <StatusAlert
                                            message="ID number not found in the student list. Please visit ICT/Registrar to be enrolled."
                                            variant="warning"
                                        />
                                    )}
                                    {isAlertMessage(
                                        errors.id_number ?? '',
                                    ) ? (
                                        <StatusAlert
                                            message={errors.id_number}
                                            className="mt-1.5"
                                        />
                                    ) : (
                                        <InputError message={errors.id_number} />
                                    )}
                                </div>
                            )}

                            {role === 'faculty_staff' && (
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="employment_type"
                                        className="text-sm font-medium text-foreground"
                                    >
                                        Employment type
                                        <span className="ml-1 text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Select
                                        name="employment_type"
                                        value={employmentType}
                                        onValueChange={(value) => {
                                            setEmploymentType(value);
                                            setDepartment('');
                                        }}
                                        required
                                    >
                                        <SelectTrigger
                                            id="employment_type"
                                            className="h-11 w-full rounded-lg border-border text-sm transition-colors focus-visible:border-ustp-navy focus-visible:ring-ustp-navy/20"
                                        >
                                            <SelectValue placeholder="Select employment type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="teaching">
                                                Teaching
                                            </SelectItem>
                                            <SelectItem value="non_teaching">
                                                Non-teaching
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError
                                        message={errors.employment_type}
                                    />
                                </div>
                            )}

                            {(isStudent ||
                                employmentType === 'teaching') && (
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="department"
                                        className="text-sm font-medium text-foreground"
                                    >
                                        Department
                                        <span className="ml-1 text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Select
                                        name="department"
                                        value={department}
                                        onValueChange={setDepartment}
                                        required
                                    >
                                        <SelectTrigger
                                            id="department"
                                            className="h-11 w-full rounded-lg border-border text-sm transition-colors focus-visible:border-ustp-navy focus-visible:ring-ustp-navy/20"
                                        >
                                            <SelectValue
                                                placeholder={
                                                    isStudent
                                                        ? 'Select your program'
                                                        : 'Select your department'
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departmentOptions.map((option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError
                                        message={errors.department}
                                    />
                                </div>
                            )}

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
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="Create a password"
                                        passwordrules={passwordRules}
                                        className="h-11 rounded-lg border-border pl-9 text-sm transition-colors focus-visible:border-ustp-navy focus-visible:ring-ustp-navy/20"
                                    />
                                </div>
                                {password.length > 0 && (
                                    <PasswordStrength
                                        value={password}
                                        className="mt-1"
                                    />
                                )}
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

                            <div className="mt-2 flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    name="terms"
                                    value="on"
                                    required
                                    tabIndex={6}
                                    className="mt-0.5 size-4 shrink-0 rounded-[4px] border border-input accent-ustp-navy focus-visible:ring-2 focus-visible:ring-ustp-navy/30 dark:border-white/20"
                                />
                                <Label
                                    htmlFor="terms"
                                    className="text-sm leading-snug font-normal text-muted-foreground"
                                >
                                    By clicking continue, you agree to our{' '}
                                    <a
                                        href={terms.url()}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="font-medium text-ustp-navy underline-offset-2 hover:underline dark:text-white/90"
                                    >
                                        Terms of Service
                                    </a>{' '}
                                    and{' '}
                                    <a
                                        href={privacy.url()}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="font-medium text-ustp-navy underline-offset-2 hover:underline dark:text-white/90"
                                    >
                                        Privacy Policy
                                    </a>
                                    .
                                </Label>
                            </div>
                            <InputError message={errors.terms} />

                            <Button
                                type="submit"
                                className="h-11 w-full rounded-lg bg-ustp-gold font-semibold text-ustp-navy shadow-md shadow-ustp-gold/20 transition-all hover:-translate-y-0.5 hover:bg-ustp-gold-dark hover:text-white hover:shadow-lg hover:shadow-ustp-gold/30 active:scale-[0.98]"
                                tabIndex={7}
                                disabled={
                                    processing ||
                                    (isStudent && lookupState !== 'found')
                                }
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Continue
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
                                tabIndex={8}
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
