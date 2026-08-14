<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;
use Symfony\Component\HttpFoundation\Response;

class RegisterResponse implements RegisterResponseContract
{
    public function toResponse($request): Response
    {
        $user = Auth::user();

        if ($user && $user->status === 'pending') {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return $request->wantsJson()
                ? new JsonResponse(['message' => 'Registration successful. Your account is pending ICT Admin approval.'], 201)
                : redirect()->route('login')->with(
                    'status',
                    'Registration successful! Your account is pending ICT Admin approval. You will be able to log in once approved.'
                );
        }

        return $request->wantsJson()
            ? new JsonResponse(['two_factor' => false], 201)
            : redirect()->intended('/dashboard');
    }
}
