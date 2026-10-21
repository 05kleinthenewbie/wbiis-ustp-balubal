import { Form, Head, router } from '@inertiajs/react';
import {
    GraduationCap,
    KeyRound,
    Plus,
    Search,
    Trash2,
    Upload,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
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
import {
    destroy,
    importMethod,
    resetPassword,
    store,
} from '@/routes/student-roster';

type AccountStatus =
    | 'active'
    | 'disabled'
    | 'no_account';

type StudentRow = {
    id: number;
    id_number: string;
    name: string;
    program: string;
    email: string | null;
    registered_user_id: number | null;
    account_status: AccountStatus;
};

type CredentialRow = {
    id_number: string;
    name: string;
    password: string;
};

type Props = {
    students: StudentRow[];
    credentials?: CredentialRow[] | null;
    status?: string | null;
};

const accountStatusConfig: Record<
    AccountStatus,
    { label: string; className: string }
> = {
    active: {
        label: 'Active',
        className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    },
    disabled: {
        label: 'Disabled',
        className: 'border-rose-200 bg-rose-50 text-rose-600',
    },
    no_account: {
        label: 'No account',
        className: 'border-slate-200 bg-slate-50 text-slate-500',
    },
};

const programs = [
    { value: 'BSA', label: 'BSA' },
    { value: 'BSIT', label: 'BSIT' },
    { value: 'BTLED', label: 'BTLED' },
];

export default function StudentRosterIndex({
    students,
    credentials,
    status,
}: Props) {
    const [search, setSearch] = useState('');
    const [program, setProgram] = useState('');

    const filtered = students.filter((student) => {
        const q = search.toLowerCase();

        return (
            student.id_number.includes(q) ||
            student.name.toLowerCase().includes(q) ||
            student.program.toLowerCase().includes(q) ||
            (student.email ?? '').toLowerCase().includes(q)
        );
    });

    function removeStudent(id: number) {
        if (confirm('Remove this student from the list?')) {
            router.delete(destroy.url(id));
        }
    }

    function resetStudentPassword(id: number) {
        if (
            confirm(
                'Reset this student\'s password back to their ID number? They can change it anytime from their profile.',
            )
        ) {
            router.post(resetPassword.url(id));
        }
    }

    return (
        <>
            <Head title="Student List" />

            <div className="min-h-full flex-1 bg-slate-50 text-slate-800">
                <div className="relative flex flex-1 flex-col gap-6 overflow-hidden p-4 md:p-6 lg:p-8">
                    <div className="relative">
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-800 md:text-3xl">
                            Student List
                        </h1>

                        <p className="mt-1.5 max-w-2xl text-sm text-slate-400">
                            Adding a student here automatically creates their
                            portal account. Students sign in with their ID
                            number as both the username and the initial
                            password, then choose a private one.
                        </p>
                    </div>

                    {status && (
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                            {status}
                        </div>
                    )}

                    {credentials && credentials.length > 0 && (
                        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-amber-800">
                                <KeyRound className="size-4" />
                                Temporary credentials — shown once
                            </div>
                            <p className="mt-1 text-xs text-amber-700">
                                Share these with the student through a secure
                                channel. The password is their ID number, which
                                they can change anytime from their profile.
                            </p>
                            <div className="mt-3 overflow-hidden rounded-lg border border-amber-200 bg-white">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="border-b border-amber-100 bg-amber-50/60">
                                                <th className="px-4 py-2.5 text-left text-[10px] font-semibold tracking-[0.1em] text-amber-700 uppercase">
                                                    ID number
                                                </th>
                                                <th className="px-4 py-2.5 text-left text-[10px] font-semibold tracking-[0.1em] text-amber-700 uppercase">
                                                    Student
                                                </th>
                                                <th className="px-4 py-2.5 text-left text-[10px] font-semibold tracking-[0.1em] text-amber-700 uppercase">
                                                    Password
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {credentials.map((credential) => (
                                                <tr
                                                    key={credential.id_number}
                                                    className="border-b border-amber-50 last:border-0"
                                                >
                                                    <td className="px-4 py-2.5 font-mono font-medium text-slate-700">
                                                        {credential.id_number}
                                                    </td>
                                                    <td className="px-4 py-2.5 text-slate-600">
                                                        {credential.name}
                                                    </td>
                                                    <td className="px-4 py-2.5 font-mono font-semibold text-slate-800 select-all">
                                                        {credential.password}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-4 lg:grid-cols-2">
                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="mb-4 flex items-center gap-2">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-ustp-navy/10 text-ustp-navy">
                                    <Plus className="size-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-600">
                                        Add student
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        Provision one account manually
                                    </p>
                                </div>
                            </div>

                            <Form
                                {...store.form()}
                                resetOnSuccess={['id_number', 'name', 'program', 'email']}
                                disableWhileProcessing
                                className="grid gap-4"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="roster_id_number"
                                                className="text-xs font-medium text-slate-500"
                                            >
                                                University ID number
                                            </Label>
                                            <Input
                                                id="roster_id_number"
                                                name="id_number"
                                                inputMode="numeric"
                                                placeholder="2023303709"
                                                className="h-10 border-slate-300 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus-visible:border-ustp-navy focus-visible:ring-1 focus-visible:ring-ustp-navy/25"
                                            />
                                            <p className="text-xs text-destructive">
                                                {errors.id_number}
                                            </p>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="roster_name"
                                                className="text-xs font-medium text-slate-500"
                                            >
                                                Full name
                                            </Label>
                                            <Input
                                                id="roster_name"
                                                name="name"
                                                placeholder="Juan Dela Cruz"
                                                className="h-10 border-slate-300 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus-visible:border-ustp-navy focus-visible:ring-1 focus-visible:ring-ustp-navy/25"
                                            />
                                            <p className="text-xs text-destructive">
                                                {errors.name}
                                            </p>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label className="text-xs font-medium text-slate-500">
                                                Program
                                            </Label>
                                            <Select
                                                name="program"
                                                value={program}
                                                onValueChange={setProgram}
                                            >
                                                <SelectTrigger
                                                    id="roster_program"
                                                    className="h-10 w-full border-slate-300 bg-white text-sm text-slate-800 focus-visible:border-ustp-navy focus-visible:ring-1 focus-visible:ring-ustp-navy/25"
                                                >
                                                    <SelectValue placeholder="Select program" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {programs.map((option) => (
                                                        <SelectItem
                                                            key={option.value}
                                                            value={option.value}
                                                        >
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <p className="text-xs text-destructive">
                                                {errors.program}
                                            </p>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="roster_email"
                                                className="text-xs font-medium text-slate-500"
                                            >
                                                Gmail address
                                            </Label>
                                            <Input
                                                id="roster_email"
                                                type="email"
                                                name="email"
                                                placeholder="juan.delacruz@gmail.com"
                                                className="h-10 border-slate-300 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus-visible:border-ustp-navy focus-visible:ring-1 focus-visible:ring-ustp-navy/25"
                                            />
                                            <p className="text-xs text-destructive">
                                                {errors.email}
                                            </p>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="h-10 bg-ustp-navy text-xs text-white shadow-lg shadow-ustp-navy/20 hover:bg-ustp-navy-dark"
                                        >
                                            {processing && <Spinner />}
                                            Add &amp; create account
                                        </Button>
                                    </>
                                )}
                            </Form>
                        </section>

                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="mb-4 flex items-center gap-2">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                                    <Upload className="size-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-600">
                                        Bulk import
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        Upload a CSV with an
                                        id_number,name,program,email header row
                                    </p>
                                </div>
                            </div>

                            <Form
                                {...importMethod.form()}
                                resetOnSuccess={['csv_file']}
                                disableWhileProcessing
                                className="grid gap-4"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="roster_csv"
                                                className="text-xs font-medium text-slate-500"
                                            >
                                                CSV file
                                            </Label>
                                            <Input
                                                id="roster_csv"
                                                type="file"
                                                name="csv_file"
                                                accept=".csv,.txt"
                                                className="h-10 border-slate-300 bg-white text-xs text-slate-800 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-600 hover:file:bg-slate-200"
                                            />
                                            <p className="text-xs text-destructive">
                                                {errors.csv_file}
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-slate-50 p-3 font-mono text-[11px] leading-relaxed text-slate-500">
                                            id_number,name,program,email
                                            <br />
                                            2023303709,Juan Dela Cruz,BSIT,juan.delacruz@gmail.com
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="h-10 bg-ustp-gold text-xs font-semibold text-ustp-navy shadow-md shadow-ustp-gold/20 hover:bg-ustp-gold-dark hover:text-white"
                                        >
                                            {processing && <Spinner />}
                                            Import CSV
                                        </Button>
                                    </>
                                )}
                            </Form>
                        </section>
                    </div>

                    <section className="relative">
                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                                    <GraduationCap className="size-4" />
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-slate-600">
                                        Student List
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {students.length} student
                                        {students.length !== 1 ? 's' : ''} on
                                        the list
                                    </p>
                                </div>
                            </div>

                            <div className="relative w-full max-w-xs">
                                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />

                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search ID, name, or program..."
                                    className="h-9 border-slate-300 bg-white pl-9 text-xs text-slate-800 placeholder:text-slate-400 focus-visible:border-ustp-navy focus-visible:ring-1 focus-visible:ring-ustp-navy/25"
                                />
                            </div>
                        </div>

                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center">
                                <Users className="mb-3 size-8 text-slate-400" />
                                <p className="text-sm text-slate-400">
                                    {search
                                        ? 'No matching students'
                                        : 'No students on the list yet.'}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-160 text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-200 bg-slate-50">
                                                <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                    ID number
                                                </th>
                                                <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                    Name
                                                </th>
                                                <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                    Program
                                                </th>
                                                <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                    Gmail
                                                </th>
                                                <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                                                    Status
                                                </th>
                                                <th className="px-5 py-3.5" />
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {filtered.map((student) => (
                                                <tr
                                                    key={student.id}
                                                    className="border-b border-slate-200 transition-colors last:border-0 hover:bg-slate-50"
                                                >
                                                    <td className="px-5 py-4 font-mono text-xs font-medium text-slate-600">
                                                        {student.id_number}
                                                    </td>
                                                    <td className="px-5 py-4 font-medium text-slate-600">
                                                        {student.name}
                                                    </td>
                                                    <td className="px-5 py-4 text-xs text-slate-400">
                                                        {student.program}
                                                    </td>
                                                    <td className="px-5 py-4 text-xs text-slate-400">
                                                        {student.email ?? '—'}
                                                    </td>
                                                    <td className="px-5 py-4">
                                                        <Badge
                                                            variant="outline"
                                                            className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${accountStatusConfig[student.account_status].className}`}
                                                        >
                                                            {
                                                                accountStatusConfig[
                                                                    student
                                                                        .account_status
                                                                ].label
                                                            }
                                                        </Badge>
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() =>
                                                                    resetStudentPassword(
                                                                        student.id,
                                                                    )
                                                                }
                                                                className="h-8 border-slate-200 bg-white px-3 text-xs text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
                                                            >
                                                                <KeyRound className="mr-1 size-3" />
                                                                {student.account_status ===
                                                                'no_account'
                                                                    ? 'Create account'
                                                                    : 'Reset password'}
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() =>
                                                                    removeStudent(
                                                                        student.id,
                                                                    )
                                                                }
                                                                className="h-8 border-rose-200 bg-white px-3 text-xs text-rose-600 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
                                                            >
                                                                <Trash2 className="mr-1 size-3" />
                                                                Remove
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </>
    );
}
