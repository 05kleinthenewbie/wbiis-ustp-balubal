import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const ALERT_PATTERN = /\bpending\b|deactivat|not approved/i;

export function isAlertMessage(message: string): boolean {
    return ALERT_PATTERN.test(message);
}

type StatusAlertProps = {
    message: string;
    className?: string;
};

export default function StatusAlert({ message, className }: StatusAlertProps) {
    const isAlert = isAlertMessage(message);
    const Icon = isAlert ? AlertTriangle : CheckCircle2;

    return (
        <div
            role="alert"
            className={cn(
                'flex items-start gap-2 rounded-lg border px-4 py-3 text-sm font-medium',
                isAlert
                    ? 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-950/50 dark:text-amber-300'
                    : 'border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-400',
                className,
            )}
        >
            <Icon className="mt-0.5 size-4 shrink-0" />
            <span>{message}</span>
        </div>
    );
}
