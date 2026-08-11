<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\Request;
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

        return Inertia::render('audit-log/index', [
            'logs' => $query->paginate(25)->withQueryString(),
            'modules' => AuditLog::distinct()->pluck('module_name'),
            'filters' => $request->only('module'),
        ]);
    }
}
