import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import type { Team, User } from '@/types';

export function UserInfo({
    user,
    showEmail = false,
    showRole = false,
    team = null,
}: {
    user: User;
    showEmail?: boolean;
    showRole?: boolean;
    team?: Team | null;
}) {
    const getInitials = useInitials();
    const showAvatar = Boolean(user.avatar && user.avatar !== '');

    const role = (user.role as { role_name?: string } | undefined)?.role_name;

    return (
        <>
            <Avatar className="h-9 w-9 overflow-hidden rounded-lg ring-2 ring-ustp-gold/50 shadow-md shadow-black/20">
                {showAvatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                ) : null}
                <AvatarFallback className="rounded-lg bg-ustp-navy-light text-sm font-semibold text-ustp-gold">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-white">
                    {user.name}
                </span>
                {team ? (
                    <span className="truncate text-xs text-muted-foreground">
                        {team.name}
                    </span>
                ) : showRole && role ? (
                    <span className="mt-0.5 truncate text-[10px] font-medium uppercase tracking-wider text-ustp-gold">
                        {role.replace(/_/g, ' ')}
                    </span>
                ) : showEmail ? (
                    <span className="truncate text-xs text-muted-foreground">
                        {user.email}
                    </span>
                ) : null}
            </div>
        </>
    );
}
