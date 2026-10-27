import { Users } from 'lucide-react';
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
            portal="faculty"
            title="Faculty Sign In"
        />
    );
}

FacultyLogin.layout = {
    wide: false,
    title: 'Faculty Sign In',
    icon: Users,
    iconClassName:
        'bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
};
