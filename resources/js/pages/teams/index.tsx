import { Head, Link } from '@inertiajs/react';
import { Eye, LogOut, Pencil, Plus, Users } from 'lucide-react';
import { useState } from 'react';
import CreateTeamModal from '@/components/create-team-modal';
import Heading from '@/components/heading';
import LeaveTeamModal from '@/components/leave-team-modal';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { edit, index } from '@/routes/teams';
import type { Team } from '@/types';

type Props = {
    teams: Team[];
};

export default function TeamsIndex({ teams }: Props) {
    const [leaveTeamDialogOpen, setLeaveTeamDialogOpen] = useState(false);
    const [teamLeaving, setTeamLeaving] = useState<Team | null>(null);

    const openLeaveTeamDialog = (team: Team) => {
        setTeamLeaving(team);
        setLeaveTeamDialogOpen(true);
    };

    return (
        <>
            <Head title="Teams" />

            <h1 className="sr-only">Teams</h1>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Heading
                        variant="small"
                        title="Teams"
                        description="Manage your teams and team memberships"
                    />

                    <CreateTeamModal>
                        <Button
                            data-test="teams-new-team-button"
                            className="bg-ustp-navy text-white shadow-lg shadow-ustp-navy/20 hover:bg-ustp-navy-dark"
                        >
                            <Plus className="size-4" /> New team
                        </Button>
                    </CreateTeamModal>
                </div>

                <div className="space-y-3">
                    {teams.map((team) => {
                        const canLeaveTeam =
                            !team.isPersonal && team.role !== 'owner';

                        return (
                            <div
                                key={team.id}
                                data-test="team-row"
                                className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50/60"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex size-10 items-center justify-center rounded-xl bg-ustp-blue-accent/15 text-ustp-light-blue">
                                        <Users className="size-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-slate-900">
                                                {team.name}
                                            </span>
                                            {team.isPersonal ? (
                                                <span className="rounded-full bg-ustp-gold/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-ustp-gold-dark">
                                                    Personal
                                                </span>
                                            ) : null}
                                        </div>
                                        <span className="text-sm text-slate-500">
                                            {team.roleLabel}
                                        </span>
                                    </div>
                                </div>

                                <TooltipProvider>
                                    <div className="flex items-center gap-2">
                                        {canLeaveTeam ? (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button
                                                        data-test="team-leave-button"
                                                        onClick={() =>
                                                            openLeaveTeamDialog(
                                                                team,
                                                            )
                                                        }
                                                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                                                    >
                                                        <LogOut className="size-4" />
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Leave team</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        ) : null}

                                        {team.role === 'member' ? (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link
                                                        href={edit(team.slug)}
                                                        data-test="team-view-button"
                                                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
                                                    >
                                                        <Eye className="size-4" />
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>View team</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        ) : (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link
                                                        href={edit(team.slug)}
                                                        data-test="team-edit-button"
                                                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
                                                    >
                                                        <Pencil className="size-4" />
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Edit team</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        )}
                                    </div>
                                </TooltipProvider>
                            </div>
                        );
                    })}

                    {teams.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 py-12 text-center">
                            <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-xl bg-white">
                                <Users className="size-5 text-slate-300" />
                            </div>
                            <p className="text-sm text-slate-400">
                                You don't belong to any teams yet.
                            </p>
                        </div>
                    ) : null}
                </div>
            </div>

            <LeaveTeamModal
                team={teamLeaving}
                open={leaveTeamDialogOpen}
                onOpenChange={setLeaveTeamDialogOpen}
            />
        </>
    );
}

TeamsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Teams',
            href: index(),
        },
    ],
};
