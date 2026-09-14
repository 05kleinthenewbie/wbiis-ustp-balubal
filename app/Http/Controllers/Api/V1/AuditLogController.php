<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuditLogController extends ApiController
{
    public function index(Request $request): JsonResponse
    {
        $this->ensureAdmin();

        $query = AuditLog::with('adminUser')->latest('action_date');

        if ($module = $request->input('module')) {
            $query->where('module_name', $module);
        }

        $logs = $query->paginate((int) $request->input('per_page', 25))->withQueryString();

        return response()->json([
            'data' => $logs->items(),
            'modules' => AuditLog::distinct()->pluck('module_name'),
            'meta' => collect($logs->toArray())->except(['data']),
        ]);
    }
}
