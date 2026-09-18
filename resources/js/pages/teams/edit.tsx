import { Form, Head, router } from '@inertiajs/react';
import { ChevronDown, Mail, Trash2, UserPlus, Users, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import CancelInvitationModal from '@/components/cancel-invitation-modal';
import DeleteTeamModal from '@/components/delete-team-modal';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import InviteMemberModal from '@/components/invite-member-modal';
import RemoveMemberModal from '@/components/remove-member-modal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useInitials } from '@/hooks/use-initials';
import { edit, index, update } from '@/routes/teams';
import { update as updateMember } from '@/routes/teams/members';
import type {
    RoleOption,
    Team,
    TeamInvitation,
    TeamMember,
    TeamPermissions,
} from '@/types';

type Props = {
    team: Team;
    members: TeamMember[];
    invitations: TeamInvitation[];
    permissions: TeamPermissions;
    availableRoles: RoleOption[];
};

export default function TeamEdit({
    team,
    members,
    invitations,
    permissions,
    availableRoles,
}: Props) {
    const getInitials = useInitials();

    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [removeMemberDialogOpen, setRemoveMemberDialogOpen] = useState(false);
    const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(
        null,
    );
    const [cancelInvitationDialogOpen, setCancelInvitationDialogOpen] =
        useState(false);
    const [invitationToCancel, setInvitationToCancel] =
        useState<TeamInvitation | null>(null);

    const pageTitle = useMemo(
        () =>
            permissions.canUpdateTeam
                ? `Edit ${team.name}`
                : `View ${team.name}`,
        [permissions.canUpdateTeam, team.name],
    );

    const updateMemberRole = (member: TeamMember, newRole: string) => {
        router.visit(updateMember([team.slug, member.id]), {
            data: { role: newRole },
            preserveScroll: true,
        });
    };

    const confirmRemoveMember = (member: TeamMember) => {
        setMemberToRemove(member);
        setRemoveMemberDialogOpen(true);
    };

    const confirmCancelInvitation = (invitation: TeamInvitation) => {
        setInvitationToCancel(invitation);
        setCancelInvitationDialogOpen(true);
    };

    return (
        <>
            <Head title={pageTitle} />

            <h1 className="sr-only">{pageTitle}</h1>

            <div className="space-y-10">
                <div className="space-y-6">
                    {permissions.canUpdateTeam ? (
                        <>
                            <Heading
                                variant="small"
                                title="Team settings"
                                description="Update your team name and settings"
                            />

                            <Form
                                {...update.form(team.slug)}
                                className="space-y-6"
                            >
                                {({ errors, processing }) => (
                                    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor="name"
                                                className="text-slate-700"
                                            >
                                                Team name
                                            </Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                data-test="team-name-input"
                                                defaultValue={team.name}
                                                className="mt-1 block w-full"
                                                required
                                            />
                                            <InputError message={errors.name} />
                                        </div>

                                        <div className="mt-4 flex items-center gap-4">
                                            <Button
                                                type="submit"
                                                data-test="team-save-button"
                                                disabled={processing}
                                                className="bg-ustp-navy text-white shadow-lg shadow-ustp-navy/20 hover:bg-ustp-navy-dark"
                                            >
                                                Save
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </Form>
                        </>
                    ) : (
                        <Heading variant="small" title={team.name} />
                    )}
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <Heading
                            variant="small"
                            title="Team members"
                            description={
                                permissions.canCreateInvitation
                                    ? 'Manage who belongs to this team'
                                    : ''
                            }
                        />

                        {permissions.canCreateInvitation ? (
                            <Button
                                data-test="invite-member-button"
                                onClick={() => setInviteDialogOpen(true)}
                                className="bg-ustp-navy text-white shadow-lg shadow-ustp-navy/20 hover:bg-ustp-navy-dark"
                            >
                                <UserPlus className="size-4" /> Invite member
                            </Button>
                        ) : null}
                    </div>

                    <div className="space-y-3">
                        {members.map((member) => (
                            <div
                                key={member.id}
                                data-test="member-row"
                                className="flex items-center justify-between rounded-xl border border-[#1a2035] bg-[#0f1723] p-5 transition-all hover:border-white/10 hover:bg-[#111827]"
                            >
                                <div className="flex items-center gap-4">
                                    <Avatar className="size-10 border border-[#1a2035]">
                                        {member.avatar ? (
                                            <AvatarImage
                                                src={member.avatar}
                                                alt={member.name}
                                            />
                                        ) : null}
                                        <AvatarFallback className="bg-ustp-blue-accent/15 text-ustp-light-blue text-xs font-medium">
                                            {getInitials(member.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium text-white">
                                            {member.name}
                                        </div>
                                        <div className="text-sm text-white/40">
                                            {member.email}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {member.role !== 'owner' &&
                                    permissions.canUpdateMember ? (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button
                                                    data-test="member-role-trigger"
                                                    className="flex items-center gap-1.5 rounded-lg border border-[#1a2035] bg-[#070b18] px-3 py-1.5 text-xs font-medium text-white/70 transition-colors hover:border-white/10 hover:text-white"
                                                >
                                                    {member.role_label}
                                                    <ChevronDown className="size-3 opacity-50" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="border-[#1a2035] bg-[#0f1723]">
                                                {availableRoles.map((role) => (
                                                    <DropdownMenuItem
                                                        key={role.value}
                                                        data-test="member-role-option"
                                                        className="text-white/70 focus:bg-white/5 focus:text-white"
                                                        onSelect={() =>
                                                            updateMemberRole(
                                                                member,
                                                                role.value,
                                                            )
                                                        }
                                                    >
                                                        {role.label}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    ) : (
                                        <span className="rounded-full bg-ustp-blue-accent/15 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-ustp-light-blue">
                                            {member.role_label}
                                        </span>
                                    )}

                                    {member.role !== 'owner' &&
                                    permissions.canRemoveMember ? (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button
                                                        data-test="member-remove-button"
                                                        onClick={() =>
                                                            confirmRemoveMember(
                                                                member,
                                                            )
                                                        }
                                                        className="rounded-lg p-2 text-white/40 transition-colors hover:bg-red-400/10 hover:text-red-400"
                                                    >
                                                        <X className="size-4" />
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Remove member</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {invitations.length > 0 ? (
                    <div className="space-y-6">
                        <Heading
                            variant="small"
                            title="Pending invitations"
                            description="Invitations that haven't been accepted yet"
                        />

                        <div className="space-y-3">
                            {invitations.map((invitation) => (
                                <div
                                    key={invitation.code}
                                    data-test="invitation-row"
                                    className="flex items-center justify-between rounded-xl border border-[#1a2035] bg-[#0f1723] p-5 transition-all hover:border-white/10 hover:bg-[#111827]"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex size-10 items-center justify-center rounded-xl bg-ustp-gold/10 text-ustp-gold">
                                            <Mail className="size-5" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-white">
                                                {invitation.email}
                                            </div>
                                            <div className="text-sm text-white/40">
                                                {invitation.role_label}
                                            </div>
                                        </div>
                                    </div>

                                    {permissions.canCancelInvitation ? (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button
                                                        data-test="invitation-cancel-button"
                                                        onClick={() =>
                                                            confirmCancelInvitation(
                                                                invitation,
                                                            )
                                                        }
                                                        className="rounded-lg p-2 text-white/40 transition-colors hover:bg-red-400/10 hover:text-red-400"
                                                    >
                                                        <X className="size-4" />
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Cancel invitation</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null}

                {permissions.canDeleteTeam && !team.isPersonal ? (
                    <div className="space-y-6">
                        <Heading
                            variant="small"
                            title="Delete team"
                            description="Permanently delete your team"
                        />
                        <div className="rounded-xl border border-red-400/20 bg-red-400/[0.04] p-6">
                            <div className="space-y-1 text-red-400">
                                <p className="text-sm font-medium">Warning</p>
                                <p className="text-xs text-red-400/70">
                                    Please proceed with caution, this cannot be
                                    undone.
                                </p>
                            </div>
                            <Button
                                variant="destructive"
                                data-test="delete-team-button"
                                onClick={() => setDeleteDialogOpen(true)}
                                className="mt-4"
                            >
                                <Trash2 className="size-4" /> Delete team
                            </Button>
                        </div>
                    </div>
                ) : null}
            </div>

            {permissions.canCreateInvitation ? (
                <InviteMemberModal
                    team={team}
                    availableRoles={availableRoles}
                    open={inviteDialogOpen}
                    onOpenChange={setInviteDialogOpen}
                />
            ) : null}

            <RemoveMemberModal
                team={team}
                member={memberToRemove}
                open={removeMemberDialogOpen}
                onOpenChange={setRemoveMemberDialogOpen}
            />

            <CancelInvitationModal
                team={team}
                invitation={invitationToCancel}
                open={cancelInvitationDialogOpen}
                onOpenChange={setCancelInvitationDialogOpen}
            />

            {permissions.canDeleteTeam && !team.isPersonal ? (
                <DeleteTeamModal
                    team={team}
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                />
            ) : null}
        </>
    );
}

TeamEdit.layout = (props: { team: { name: string; slug: string } }) => ({
    breadcrumbs: [
        {
            title: 'Teams',
            href: index(),
        },
        {
            title: props.team.name,
            href: edit(props.team.slug),
        },
    ],
});
