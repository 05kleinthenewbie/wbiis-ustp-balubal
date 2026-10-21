<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
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

        if ($userId = $request->input('user_id')) {
            $query->where('admin_user_id', $userId);
        }

        if ($status = $request->input('status')) {
            $this->filterByActionType($query, $status);
        }

        if ($dateFrom = $request->input('date_from')) {
            $query->whereDate('action_date', '>=', $dateFrom);
        }

        if ($dateTo = $request->input('date_to')) {
            $query->whereDate('action_date', '<=', $dateTo);
        }

        if ($search = $request->input('search')) {
            $query->where(function (Builder $builder) use ($search) {
                $builder->where('action_taken', 'like', "%{$search}%")
                    ->orWhere('details', 'like', "%{$search}%")
                    ->orWhereHas('adminUser', fn (Builder $user) => $user->where('name', 'like', "%{$search}%"));
            });
        }

        $total = AuditLog::count();
        $todayCount = AuditLog::whereDate('action_date', Carbon::today())->count();
        $activeAdmins = AuditLog::distinct('admin_user_id')->whereDate('action_date', '>=', Carbon::now()->subDays(30))->count('admin_user_id');
        $modulesCount = AuditLog::distinct('module_name')->count('module_name');

        return Inertia::render('audit-log/index', [
            'logs' => $query->paginate(25)->withQueryString(),
            'modules' => AuditLog::distinct()->pluck('module_name'),
            'users' => User::query()
                ->whereIn('id', AuditLog::query()->select('admin_user_id')->distinct())
                ->orderBy('name')
                ->get(['id', 'name']),
            'filters' => $request->only('module', 'search', 'user_id', 'status', 'date_from', 'date_to'),
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
     * Restrict the query to the action category used by the UI indicators.
     */
    private function filterByActionType(Builder $query, string $status): void
    {
        $patterns = match ($status) {
            'created' => ['%creat%', '%add%', '%regist%', '%submit%', '%provision%'],
            'updated' => ['%updat%', '%edit%', '%modif%', '%chang%', '%set%', '%mark%', '%reset%', '%flag%'],
            'deleted' => ['%delet%', '%remov%'],
            default => [],
        };

        if ($patterns === []) {
            return;
        }

        $query->where(function (Builder $builder) use ($patterns) {
            foreach ($patterns as $pattern) {
                $builder->orWhere('action_taken', 'like', $pattern);
            }
        });
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
