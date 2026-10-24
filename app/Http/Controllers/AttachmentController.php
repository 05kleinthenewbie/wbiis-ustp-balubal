<?php

namespace App\Http\Controllers;

use App\Models\Attachment;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AttachmentController extends Controller
{
    /**
     * Stream an attachment to its owner or an ICT administrator.
     */
    public function download(Attachment $attachment): StreamedResponse
    {
        $user = Auth::user();

        $attachment->loadMissing('serviceRequest');
        $isOwner = $attachment->serviceRequest?->user_id === $user->id;

        abort_unless($isOwner || $user->role->role_name === 'ict_admin', 403);

        abort_unless(Storage::disk('public')->exists($attachment->file_path), 404);

        return Storage::disk('public')->download($attachment->file_path, $attachment->file_name);
    }
}
