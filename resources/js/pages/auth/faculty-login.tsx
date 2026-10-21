import { Briefcase } from 'lucide-react';
import { login as portal } from '@/routes';
import Login from './login';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function FacultyLogin({ status, canResetPassword }: Props) {
    return (
        <Login
            status={status}
            canResetPassword={canResetPassword}
            showRegister
            title="Faculty Sign In"
        />
    );
}

FacultyLogin.layout = {
    title: 'Faculty Sign In',
    description:
        'Sign in with your official USTP email, or create a faculty account for ICT Admin approval.',
    icon: Briefcase,
    iconClassName:
        'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
    backHref: portal().url,
    backTestId: 'back-to-portal-button',
};
