<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\User;
use App\Models\UserLiability;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserLiabilityController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'status' => ['nullable', 'in:all,pending,settled,waived'],
            'liability' => ['nullable', 'integer', 'min:1'],
        ]);
        $query = UserLiability::where('user_id', $request->user()->id);
        $status = $filters['status'] ?? 'all';

        return Inertia::render('liabilities/index', [
            'liabilities' => $query->with('incidentReport:id,incident_type,incident_date')
                ->when($status !== 'all', fn ($query) => $query->where('liability_status', $status))
                ->when(isset($filters['liability']), fn ($query) => $query->whereKey($filters['liability']))
                ->latest('date_assigned')->orderByDesc('id')->paginate(20)->withQueryString(),
            'filters' => ['status' => $status, 'liability' => $filters['liability'] ?? null],
        ]);
    }

    public function acknowledge(Request $request, int $liability): RedirectResponse
    {
        $record = UserLiability::where('user_id', $request->user()->id)->findOrFail($liability);
        abort_unless($record->liability_status === 'pending', 422, 'Only pending liabilities can be acknowledged.');

        $updated = UserLiability::whereKey($record->id)->whereNull('acknowledged_at')->update(['acknowledged_at' => now()]);
        if ($updated) {
            User::whereHas('role', fn ($query) => $query->where('role_name', 'ict_admin'))->each(function (User $admin) use ($record, $request): void {
                Notification::create([
                    'user_id' => $admin->id,
                    'message' => $request->user()->name.' acknowledged liability #'.$record->id.'.',
                    'notification_type' => 'liability',
                    'link' => route('incidents.show', $record->incident_id, false),
                    'notification_status' => 'unread',
                ]);
            });
        }

        return back()->with('status', 'Liability assignment acknowledged.');
    }
}
