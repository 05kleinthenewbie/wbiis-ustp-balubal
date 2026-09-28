<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        if (Auth::user()->role->role_name !== 'ict_admin') {
            abort(403, 'Only ICT Admins can view the audit log.');
        }

        $query = AuditLog::with('adminUser')->latest('action_date');

        if ($module = $request->input('module')) {
            $query->where('module_name', $module);
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('action_taken', 'like', "%{$search}%")
                    ->orWhere('details', 'like', "%{$search}%");
            });
        }

        $total = AuditLog::count();
        $todayCount = AuditLog::whereDate('action_date', Carbon::today())->count();
        $activeAdmins = AuditLog::distinct('admin_user_id')->whereDate('action_date', '>=', Carbon::now()->subDays(30))->count('admin_user_id');
        $modulesCount = AuditLog::distinct('module_name')->count('module_name');

        return Inertia::render('audit-log/index', [
            'logs' => $query->paginate(25)->withQueryString(),
            'modules' => AuditLog::distinct()->pluck('module_name'),
            'filters' => $request->only('module', 'search'),
            'suggestions' => $this->suggestions(),
            'stats' => [
                'total' => $total,
                'today' => $todayCount,
                'active_admins' => $activeAdmins,
                'modules' => $modulesCount,
            ],
        ]);
    }

    /**
     * Distinct action phrases, actor names and details offered by the search
     * field as the user types. Ordered by type so actions are suggested first.
     *
     * @return array<int, array{value: string, type: string}>
     */
    private function suggestions(): array
    {
        $suggestions = [];

        $add = function (string $value, string $type) use (&$suggestions): void {
            $value = trim($value);

            if ($value === '' || isset($suggestions[$value])) {
                return;
            }

            $suggestions[$value] = ['value' => $value, 'type' => $type];
        };

        AuditLog::query()
            ->whereNotNull('action_taken')
            ->distinct()
            ->orderBy('action_taken')
            ->limit(100)
            ->pluck('action_taken')
            ->each(fn (string $action) => $add($action, 'action'));

        User::whereIn(
            'id',
            AuditLog::query()->distinct()->pluck('admin_user_id'),
        )
            ->orderBy('name')
            ->limit(100)
            ->pluck('name')
            ->each(fn (string $name) => $add($name, 'actor'));

        AuditLog::query()
            ->whereNotNull('details')
            ->distinct()
            ->orderBy('details')
            ->limit(100)
            ->pluck('details')
            ->each(fn (string $details) => $add($details, 'details'));

        return array_values($suggestions);
    }
}
