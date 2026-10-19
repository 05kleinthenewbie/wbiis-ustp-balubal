<?php

namespace App\Http\Controllers;

use App\Models\StudentRoster;
use Illuminate\Http\JsonResponse;

class StudentLookupController extends Controller
{
    /**
     * Return the rostered name and program for a university ID number so the
     * registration form can auto-fill a student's details. Unknown IDs 404.
     */
    public function __invoke(string $idNumber): JsonResponse
    {
        $student = StudentRoster::where('id_number', $idNumber)->first();

        if ($student === null) {
            return response()->json(['found' => false], 404);
        }

        return response()->json([
            'found' => true,
            'name' => $student->name,
            'program' => $student->program,
        ]);
    }
}
