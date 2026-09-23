<?php

namespace App\Http\Controllers\Api\V1;

use App\Actions\Fortify\CreateNewUser;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends ApiController
{
    /**
     * Authenticate a user and return a JWT token.
     */
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => 'The provided credentials do not match our records.',
            ]);
        }

        if ($user->status === 'pending') {
            abort(403, 'Your account is pending ICT Admin approval. You will be able to log in once approved.');
        }

        if ($user->status === 'inactive') {
            abort(403, 'Your account has been deactivated. Please contact the ICT office.');
        }

        $token = auth('api')->login($user);

        return $this->respondWithToken($token, $user);
    }

    /**
     * Register a new user account.
     */
    public function register(Request $request): JsonResponse
    {
        $user = app(CreateNewUser::class)->create($request->only([
            'name',
            'email',
            'password',
            'password_confirmation',
            'role',
        ]));

        return response()->json([
            'message' => 'Account created successfully. Please wait for ICT Admin approval before logging in.',
            'user' => $user->load('role'),
        ], 201);
    }

    /**
     * Refresh the current JWT token.
     */
    public function refresh(): JsonResponse
    {
        $token = auth('api')->refresh();

        return $this->respondWithToken($token, auth('api')->user());
    }

    /**
     * Invalidate the current JWT token.
     */
    public function logout(): JsonResponse
    {
        auth('api')->logout();

        return response()->json(['message' => 'Successfully logged out.']);
    }

    /**
     * Return the authenticated user.
     */
    public function me(): JsonResponse
    {
        $user = $this->user()?->load('role');

        return response()->json(['user' => $user]);
    }

    /**
     * Build the standard JWT response payload.
     */
    protected function respondWithToken(string $token, ?User $user): JsonResponse
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => $user?->load('role'),
        ]);
    }
}
