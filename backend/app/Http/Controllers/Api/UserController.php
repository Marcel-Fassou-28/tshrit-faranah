<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\UserRequest;
use App\Models\User;
use App\Notifications\WelcomeNotification;
use Exception;
use Illuminate\Support\Str;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;

class UserController extends Controller
{
    
    /**
     * Inscription d’un nouvel User.
     */
    public function register(UserRequest $request): JsonResponse
    {
        
        try {
            $user = $request->validated();
            $user['password'] = Hash::make($user['password']);
            $user = User::create($user);
            $user->notify(new WelcomeNotification($user));

            return response()->json([
                'success' => true,
                'message' => 'utilisateur créé avec succès.',
                'User'    => $user,
            
            ], 201);

        } catch(Exception $e) {
            return response()->json($e);
        } 
    }

    /**
     * Connexion d’un utilisateur.
     */
    public function login(Request $request): JsonResponse
    {
        try {
            /*$contact = $request->input('contact');
            $field = filter_var($contact, FILTER_VALIDATE_EMAIL) ? 'email' : 'telephone';*/

            
            if (Auth::attempt($request->only('email', 'password'))) {
                $user = Auth::user();
                $token = $user->createToken('MA_CLEE_SECRETE')->plainTextToken;
                return response()->json([
                    'success' => true,
                    'message' => 'Connexion réussie.',
                    'user'    => $user,
                    'token'   => $token,
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Identifiants incorrects.',
                ], 401);
            }
        } catch (Exception $e) {
            Log::error($e);
            return response()->json(['sucess' => false, 'message' => 'Une erreur est survenu']);
        }

    }

    /**
     * Deconnexion d'un utilisateur
     */
    public function logout(Request $request)
    {
        try {
            $user = Auth::guard('api')->user();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }
            $request->user()->currentAccessToken()->delete();
            $request->user()->tokens()->delete();

            return response()->json(['success' => true, 'message' => 'Successfully logged out'], 200);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'error' => 'Logout failed'], 500);
        }
    }

    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $status = Password::sendResetLink($request->only('email'));
        return $status === Password::RESET_LINK_SENT
            ? response()->json(['success' => true, 'message' => __($status)], 200)
            : response()->json(['success' => false, 'message' => __($status)], 422);
    }

    public function reset(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required',
            'password' => 'required|confirmed|min:8',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill(['password' => bcrypt($password)])
                    ->setRememberToken(Str::random(60));
                $user->save();
                event(new PasswordReset($user));
            }
        );

        return $status === Password::PASSWORD_RESET
            ? response()->json(['success' => true, 'message' => __($status)], 200)
            : response()->json(['success' => false, 'message' => __($status)], 422);
    }

}
