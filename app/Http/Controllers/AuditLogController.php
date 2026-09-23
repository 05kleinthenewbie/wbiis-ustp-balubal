<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
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
            'stats' => [
                'total' => $total,
                'today' => $todayCount,
                'active_admins' => $activeAdmins,
                'modules' => $modulesCount,
            ],
        ]);
    }
}
