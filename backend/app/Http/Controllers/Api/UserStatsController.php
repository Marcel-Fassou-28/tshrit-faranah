<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserStatsController extends Controller
{
    /**
     * Retrieve dashboard statistics for users.
     *
     * @return JsonResponse
     */
    public function stats(): JsonResponse
    {
        try {
            $totalUsers = User::count();
            $newUsers = User::where('created_at', '>=', Carbon::now()->subDays(30))->count();
            $adminUsers = User::where('role', 'admin')->count();
            $clientUsers = User::where('role', 'client')->count();

            return response()->json([
                'status' => 'success',
                'data' => [
                    'total_users' => $totalUsers,
                    'new_users' => $newUsers,
                    'admin_users' => $adminUsers,
                    'client_users' => $clientUsers,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve user statistics.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Retrieve users with optional search and role filters.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $search = $request->query('search');
            $role = $request->query('role');

            $query = User::query()->select(
                'id',
                'nom',
                'prenom',
                'email',
                'telephone',
                'role',
                'created_at'
            );

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nom', 'like', '%' . $search . '%')
                      ->orWhere('prenom', 'like', '%' . $search . '%')
                      ->orWhere('email', 'like', '%' . $search . '%')
                      ->orWhere('telephone', 'like', '%' . $search . '%');
                });
            }

            if ($role) {
                $query->where('role', $role);
            }

            $users = $query->get();

            return response()->json([
                'status' => 'success',
                'data' => UserResource::collection($users),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve users.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Retrieve possible user roles.
     *
     * @return JsonResponse
     */
    public function categories(): JsonResponse
    {
        try {
            $roles = [
                ['id' => 'client', 'name' => 'Client'],
                ['id' => 'admin', 'name' => 'Administrateur'],
            ];

            return response()->json([
                'status' => 'success',
                'data' => $roles,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve user roles.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update a user's information.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $validated = $request->validate([
                'nom' => 'required|string|max:50',
                'prenom' => 'required|string|max:100',
                'email' => 'required|email|max:250|unique:users,email,' . $id,
                'telephone' => 'required|string|max:20|unique:users,telephone,' . $id,
                'role' => 'required|in:client,admin',
                'password' => 'nullable|string|min:8',
            ]);

            $user = User::findOrFail($id);
            $user->nom = $validated['nom'];
            $user->prenom = $validated['prenom'];
            $user->email = $validated['email'];
            $user->telephone = $validated['telephone'];
            $user->role = $validated['role'];

            if (!empty($validated['password'])) {
                $user->password = Hash::make($validated['password']);
            }

            $user->save();

            return response()->json([
                'status' => 'success',
                'data' => new UserResource($user),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update user.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete a user.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy($id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'User deleted successfully.',
            ], 204);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete user.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}