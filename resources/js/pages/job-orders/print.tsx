import { Head } from '@inertiajs/react';
import { ArrowLeft, Printer } from 'lucide-react';
import ustpLogo from '@/assets/ustp-logo.png';

type PrintService = {
    id: number;
    specification: string | null;
    quantity: number | null;
    action_type: string | null;
    service_type: {
        service_name: string;
        category: { category_name: string } | null;
    } | null;
};

type PrintProps = {
    jobOrder: {
        id: number;
        job_order_number: string | null;
        report: string | null;
        resolution: string | null;
        action_taken: string | null;
        final_remarks: string | null;
        date_assigned: string | null;
        date_in_progress: string | null;
        date_completed: string | null;
        date_closed: string | null;
        technician: {
            id: number;
            name: string;
            department: string | null;
        } | null;
        service_request: {
            id: number;
            form_number: string | null;
            date_requested: string | null;
            location: string | null;
            contact_details: string | null;
            problem_description: string | null;
            user: {
                name: string;
                department: string | null;
                contact_no: string | null;
            } | null;
            request_services: PrintService[];
        } | null;
    };
    hasAttachment: boolean;
};

const CAMPUSES = [
    'Alubijid',
    'Balubal',
    'Cagayan de Oro',
    'Claveria',
    'Jasaan',
    'Oroquieta',
    'Panaon',
    'Villanueva',
];

const CATEGORY_CONFIG: { title: string; actions: string[]; rows: string[] }[] =
    [
        {
            title: 'NETWORK SERVICES',
            actions: ['New Connection', 'Troubleshoot'],
            rows: [
                'Network Connection',
                'Internet Connection',
                'Printer Connection',
                'Phone Connection',
                'Others',
            ],
        },
        {
            title: 'HARDWARE SERVICES',
            actions: ['Installation', 'Troubleshoot', 'Update'],
            rows: [
                'Computer/Laptop',
                'Printer/Scanner',
                'Tablet/Mobile Phone',
                'Others',
            ],
        },
        {
            title: 'SOFTWARE SERVICES',
            actions: ['Installation', 'Troubleshoot', 'Update'],
            rows: [
                'Operating System',
                'Office Suites',
                'Anti-Virus',
                'Device Drivers',
                'Others',
            ],
        },
        {
            title: 'INFORMATION SYSTEM SERVICES',
            actions: ['Create New', 'Troubleshoot', 'Update'],
            rows: ['E-mail', 'Office 365', 'Others'],
        },
    ];

const FINAL_REMARKS: { key: string; label: string }[] = [
    { key: 'outsource_repair', label: 'For Outsource Repair' },
    { key: 'replacement', label: 'For Replacement' },
    { key: 'disposal', label: 'For Disposal' },
    { key: 'task_completed', label: 'Task Completed' },
];

function formatDateTime(value?: string | null): string {
    if (!value) {
        return '';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    return date.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}

function joinValues(values: (string | number | null | undefined)[]): string {
    return values
        .map((value) => String(value ?? ''))
        .filter(Boolean)
        .join('; ');
}

function Bracket({ checked }: { checked: boolean }) {
    return (
        <span className="font-mono text-[11px] font-bold">
            [{checked ? '✓' : ''}]
        </span>
    );
}

function ServiceCategory({
    title,
    actions,
    rows,
    services,
}: {
    title: string;
    actions: string[];
    rows: string[];
    services: PrintService[];
}) {
    const normalize = (value?: string | null) =>
        (value ?? '').trim().toLowerCase();

    const rowServices = (name: string) =>
        services.filter(
            (service) =>
                normalize(service.service_type?.category?.category_name) ===
                    normalize(title) &&
                normalize(service.service_type?.service_name) ===
                    normalize(name),
        );

    return (
        <div className="mb-1">
            <p className="mb-0.5 text-[10.5px] font-bold text-black">{title}</p>
            <table
                className="w-full border-collapse"
                style={{ tableLayout: 'fixed' }}
            >
                <tbody>
                    {rows.map((name) => {
                        const matched = rowServices(name);
                        const checked = matched.length > 0;

                        return (
                            <tr key={name}>
                                <td
                                    className="border border-black px-1 py-0.5"
                                    style={{ width: '3%' }}
                                >
                                    <div className="flex justify-center">
                                        <Bracket checked={checked} />
                                    </div>
                                </td>
                                <td
                                    className="border border-black px-1 py-0.5 text-[10px] font-semibold text-black"
                                    style={{ width: '22%' }}
                                >
                                    {name}
                                </td>
                                <td
                                    className="border border-black px-1 py-0.5 text-[9px] text-black"
                                    style={{ width: '7%' }}
                                >
                                    Specify:
                                </td>
                                <td
                                    className="border border-black px-1 py-0.5 text-[10px] text-black"
                                    style={{ width: '23%' }}
                                >
                                    {joinValues(
                                        matched.map(
                                            (service) => service.specification,
                                        ),
                                    )}
                                </td>
                                <td
                                    className="border border-black px-1 py-0.5 text-[9px] text-black"
                                    style={{ width: '5%' }}
                                >
                                    Qty:
                                </td>
                                <td
                                    className="border border-black px-1 py-0.5 text-center text-[10px] text-black"
                                    style={{ width: '5%' }}
                                >
                                    {joinValues(
                                        matched.map(
                                            (service) => service.quantity,
                                        ),
                                    )}
                                </td>
                                {actions.map((action) => (
                                    <td
                                        key={action}
                                        className="border border-black px-1 py-0.5 text-center"
                                        style={{
                                            width: `${35 / actions.length}%`,
                                        }}
                                    >
                                        <div className="flex items-center justify-center gap-1 text-[9px] text-black">
                                            <Bracket
                                                checked={matched.some(
                                                    (service) =>
                                                        normalize(
                                                            service.action_type,
                                                        ) === normalize(action),
                                                )}
                                            />
                                            <span className="whitespace-nowrap">
                                                {action}
                                            </span>
                                        </div>
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default function PrintJobRequestForm({
    jobOrder,
    hasAttachment,
}: PrintProps) {
    const services = jobOrder.service_request?.request_services ?? [];
    const serviceRequest = jobOrder.service_request;
    const user = serviceRequest?.user;
    const technician = jobOrder.technician;

    const knownRowNames = CATEGORY_CONFIG.flatMap((config) =>
        config.rows.map((row) => row.trim().toLowerCase()),
    );
    const unmatchedServices = services.filter(
        (service) =>
            !service.service_type ||
            !knownRowNames.includes(
                (service.service_type.service_name ?? '').trim().toLowerCase(),
            ),
    );

    const respondedAt = jobOrder.date_in_progress || jobOrder.date_assigned;
    const resolvedAt = jobOrder.date_completed || jobOrder.date_closed;
    const reportText =
        jobOrder.report || jobOrder.resolution || jobOrder.action_taken;

    return (
        <>
            <Head
                title={`ICT Job Request Form${jobOrder.job_order_number ? ` - ${jobOrder.job_order_number}` : ''}`}
            />

            <style>{`
                @page {
                    size: A4 portrait;
                    margin: 0;
                }

                @media print {
                    body {
                        background: #ffffff !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }

                    .page-container {
                        padding: 8mm 10mm !important;
                    }
                }
            `}</style>

            <div className="min-h-screen bg-slate-100 print:bg-white">
                <div className="mx-auto flex max-w-[210mm] flex-wrap items-center justify-between gap-3 px-4 pt-5 print:hidden">
                    <a
                        href={`/job-orders/${jobOrder.id}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                        <ArrowLeft className="size-4" />
                        Back to Job Order
                    </a>
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-2 rounded-lg bg-ustp-light-blue px-3.5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-ustp-navy"
                    >
                        <Printer className="size-4" />
                        Print Form / Save PDF
                    </button>
                </div>

                <div className="page-container mx-auto max-w-[210mm]">
                    <div className="border-[1.5px] border-black bg-white text-black">
                        {/* Header */}
                        <table
                            className="w-full border-collapse"
                            style={{ tableLayout: 'fixed' }}
                        >
                            <tbody>
                                <tr>
                                    <td
                                        className="border-b-[1.5px] border-black p-2 text-center align-middle"
                                        style={{ width: '15%' }}
                                    >
                                        <img
                                            src={ustpLogo}
                                            alt="USTP"
                                            className="mx-auto h-14 w-14 object-contain"
                                        />
                                    </td>
                                    <td
                                        className="border-r-[1.5px] border-b-[1.5px] border-l-[1.5px] border-black px-2 py-1.5 text-center align-middle"
                                        style={{ width: '70%' }}
                                    >
                                        <p className="text-[14px] leading-tight font-bold text-black">
                                            University of Science and Technology
                                            of Southern Philippines
                                        </p>
                                        <p className="mt-0.5 text-[8.5px] leading-tight text-black">
                                            {CAMPUSES.join(' | ')}
                                        </p>
                                    </td>
                                    <td
                                        className="border-b-[1.5px] border-black bg-[#002b66] text-white"
                                        style={{ width: '15%' }}
                                    >
                                        <table className="w-full border-collapse">
                                            <tbody>
                                                <tr>
                                                    <td className="border-b border-white/70 px-2 py-0.5">
                                                        <p className="text-[7.5px] font-bold tracking-widest uppercase">
                                                            Document Code No.
                                                        </p>
                                                        <p className="text-[10px] font-bold">
                                                            FM-USTP-ICT-001
                                                        </p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <table
                                                            className="w-full border-collapse"
                                                            style={{
                                                                tableLayout:
                                                                    'fixed',
                                                            }}
                                                        >
                                                            <tbody>
                                                                <tr>
                                                                    <td className="border-r border-white/70 px-1.5 py-0.5">
                                                                        <p className="text-[7.5px] font-bold tracking-widest uppercase">
                                                                            Rev.
                                                                            No.
                                                                        </p>
                                                                        <p className="text-[10px] font-bold">
                                                                            00
                                                                        </p>
                                                                    </td>
                                                                    <td className="border-r border-white/70 px-1.5 py-0.5">
                                                                        <p className="text-[7.5px] font-bold tracking-widest uppercase">
                                                                            Effective
                                                                            Date
                                                                        </p>
                                                                        <p className="text-[10px] font-bold">
                                                                            03.17.25
                                                                        </p>
                                                                    </td>
                                                                    <td className="px-1.5 py-0.5">
                                                                        <p className="text-[7.5px] font-bold tracking-widest uppercase">
                                                                            Page
                                                                            No.
                                                                        </p>
                                                                        <p className="text-[10px] font-bold">
                                                                            1 of
                                                                            1
                                                                        </p>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Title */}
                        <div className="border-b-[1.5px] border-black px-3 py-1 text-center">
                            <h1 className="text-[15px] leading-tight font-extrabold tracking-tight text-black">
                                INFORMATION AND COMMUNICATIONS TECHNOLOGY
                                SERVICES
                            </h1>
                            <h2 className="mt-0.5 inline-block border border-black px-3 py-0.5 text-[11px] font-bold tracking-[0.25em] text-black uppercase">
                                Job Request Form
                            </h2>
                        </div>

                        {/* I. Requestor Information */}
                        <table className="w-full border-collapse">
                            <tbody>
                                <tr>
                                    <td
                                        className="border border-black bg-black px-2 py-0.5 text-center text-[9.5px] font-bold tracking-widest text-white uppercase"
                                        colSpan={4}
                                    >
                                        REQUESTOR INFORMATION (Complete fields
                                        that marked with an asterisk (*))
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        className="border border-black p-0"
                                        style={{ width: '50%' }}
                                    >
                                        <div className="border-b border-black bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-black">
                                            *Requested By (Please print your
                                            name clearly)
                                        </div>
                                        <div className="min-h-[18px] px-1.5 py-0.5 text-[11px] text-black">
                                            {user?.name ?? ''}
                                        </div>
                                    </td>
                                    <td
                                        className="border border-black p-0"
                                        style={{ width: '50%' }}
                                    >
                                        <div className="border-b border-black bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-black">
                                            *Date / Time Requested
                                        </div>
                                        <div className="min-h-[18px] px-1.5 py-0.5 text-[11px] text-black">
                                            {formatDateTime(
                                                serviceRequest?.date_requested,
                                            )}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black p-0">
                                        <div className="border-b border-black bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-black">
                                            *Designation
                                        </div>
                                        <div className="min-h-[18px] px-1.5 py-0.5 text-[11px] text-black">
                                            {user?.department ?? ''}
                                        </div>
                                    </td>
                                    <td className="border border-black p-0">
                                        <div className="border-b border-black bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-black">
                                            *Contact Details (Local / Email /
                                            Landline / Mobile)
                                        </div>
                                        <div className="min-h-[18px] px-1.5 py-0.5 text-[11px] text-black">
                                            {serviceRequest?.contact_details ||
                                                user?.contact_no ||
                                                ''}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        className="border border-black p-0"
                                        colSpan={2}
                                    >
                                        <div className="border-b border-black bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-black">
                                            *Office / Service / Division
                                        </div>
                                        <div className="min-h-[18px] px-1.5 py-0.5 text-[11px] text-black">
                                            {serviceRequest?.location ?? ''}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        className="border border-black p-0"
                                        colSpan={2}
                                    >
                                        <div className="border-b border-black bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-black">
                                            Problem Description (Please provide
                                            relevant information) *
                                        </div>
                                        <div className="min-h-[40px] px-1.5 py-0.5 text-[11px] leading-relaxed text-black">
                                            {serviceRequest?.problem_description ??
                                                ''}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        className="border border-black px-1.5 py-0.5"
                                        colSpan={2}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <Bracket checked={hasAttachment} />
                                            <span className="text-[9px] font-semibold tracking-wide text-black">
                                                Check if with attachment (e.g.,
                                                print-outs)
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* II. ICT Services */}
                        <table className="w-full border-collapse">
                            <tbody>
                                <tr>
                                    <td className="border border-black bg-black px-2 py-0.5 text-center text-[9.5px] font-bold tracking-widest text-white uppercase">
                                        ICT SERVICES (Check the service(s) that
                                        has been requested)
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-black p-1">
                                        {CATEGORY_CONFIG.map((config) => (
                                            <ServiceCategory
                                                key={config.title}
                                                title={config.title}
                                                actions={config.actions}
                                                rows={config.rows}
                                                services={services}
                                            />
                                        ))}

                                        {/* Others */}
                                        <div className="mt-1">
                                            <p className="mb-0.5 text-[10.5px] font-bold text-black">
                                                OTHERS (Please specify)
                                            </p>
                                            <div className="min-h-[16px] border-b border-black px-1 py-0.5 text-[10px] text-black">
                                                {joinValues(
                                                    unmatchedServices.map(
                                                        (service) =>
                                                            service.specification,
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* III. For ICT Personnel Use Only */}
                        <table className="w-full border-collapse">
                            <tbody>
                                <tr>
                                    <td
                                        className="border border-black bg-black px-2 py-0.5 text-center text-[9.5px] font-bold tracking-widest text-white uppercase"
                                        colSpan={4}
                                    >
                                        FOR ICT PERSONNEL USE ONLY
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        className="border border-black p-0"
                                        style={{ width: '25%' }}
                                    >
                                        <div className="border-b border-black bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-black">
                                            Responded by (Name and Signature)
                                        </div>
                                        <div className="min-h-[18px] px-1.5 py-0.5 text-[11px] text-black">
                                            {technician?.name ?? ''}
                                        </div>
                                    </td>
                                    <td
                                        className="border border-black p-0"
                                        style={{ width: '25%' }}
                                    >
                                        <div className="border-b border-black bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-black">
                                            Designation
                                        </div>
                                        <div className="min-h-[18px] px-1.5 py-0.5 text-[11px] text-black">
                                            {technician?.department ?? ''}
                                        </div>
                                    </td>
                                    <td
                                        className="border border-black p-0"
                                        style={{ width: '25%' }}
                                    >
                                        <div className="border-b border-black bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-black">
                                            Date/Time Responded
                                        </div>
                                        <div className="min-h-[18px] px-1.5 py-0.5 text-[11px] text-black">
                                            {formatDateTime(respondedAt)}
                                        </div>
                                    </td>
                                    <td
                                        className="border border-black p-0"
                                        style={{ width: '25%' }}
                                    >
                                        <div className="border-b border-black bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-black">
                                            Date/Time Resolved
                                        </div>
                                        <div className="min-h-[18px] px-1.5 py-0.5 text-[11px] text-black">
                                            {formatDateTime(resolvedAt)}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        className="border border-black p-0"
                                        colSpan={4}
                                    >
                                        <div className="border-b border-black bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-black">
                                            Report
                                        </div>
                                        <div className="min-h-[40px] px-1.5 py-0.5 text-[11px] leading-relaxed text-black">
                                            {reportText ?? ''}
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* IV. For ICT Supervisor Use Only */}
                        <table className="w-full border-collapse">
                            <tbody>
                                <tr>
                                    <td
                                        className="border border-black bg-black px-2 py-0.5 text-center text-[9.5px] font-bold tracking-widest text-white uppercase"
                                        colSpan={3}
                                    >
                                        FOR ICT SUPERVISOR USE ONLY
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        className="border border-black p-0"
                                        style={{ width: '33.33%' }}
                                    >
                                        <div className="border-b border-black bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-black">
                                            Checked by (Name and Signature)
                                        </div>
                                        <div className="min-h-[18px] px-1.5 py-0.5 text-[11px] text-black">
                                            &nbsp;
                                        </div>
                                    </td>
                                    <td
                                        className="border border-black p-0"
                                        style={{ width: '33.33%' }}
                                    >
                                        <div className="border-b border-black bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-black">
                                            Designation
                                        </div>
                                        <div className="min-h-[18px] px-1.5 py-0.5 text-[11px] text-black">
                                            &nbsp;
                                        </div>
                                    </td>
                                    <td
                                        className="border border-black p-0"
                                        style={{ width: '33.34%' }}
                                    >
                                        <div className="border-b border-black bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-black">
                                            Date and Time
                                        </div>
                                        <div className="min-h-[18px] px-1.5 py-0.5 text-[11px] text-black">
                                            &nbsp;
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        className="border border-black p-1"
                                        colSpan={3}
                                    >
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                            <span className="text-[9.5px] font-bold text-black">
                                                Final Remarks
                                            </span>
                                            {FINAL_REMARKS.map((remark) => (
                                                <div
                                                    key={remark.key}
                                                    className="flex items-center gap-1"
                                                >
                                                    <Bracket
                                                        checked={
                                                            jobOrder.final_remarks ===
                                                            remark.key
                                                        }
                                                    />
                                                    <span className="text-[9.5px] text-black">
                                                        {remark.label}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Footer */}
                        <table className="w-full border-collapse">
                            <tbody>
                                <tr>
                                    <td className="border-t-[1.5px] border-black bg-slate-100 px-2 py-0.5">
                                        <table
                                            className="w-full border-collapse"
                                            style={{ tableLayout: 'fixed' }}
                                        >
                                            <tbody>
                                                <tr>
                                                    <td
                                                        className="text-[10px] font-semibold tracking-wide text-black"
                                                        style={{
                                                            width: '30%',
                                                        }}
                                                    >
                                                        FM-USTP-ICT-001
                                                    </td>
                                                    <td
                                                        className="text-right text-[10px] text-black"
                                                        style={{
                                                            width: '70%',
                                                        }}
                                                    >
                                                        Rev. No.: 00
                                                        &nbsp;|&nbsp; Effective
                                                        Date: 03.17.25
                                                        &nbsp;|&nbsp; Page 1 of
                                                        1
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
