<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CommandeRessource;
use App\Models\Category;
use App\Models\Commande;
use App\Models\Produit;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CommandeController extends Controller
{
    /**
     * Retrieve dashboard statistics for total orders, new orders, low stock, and total revenue.
     *
     * @return JsonResponse
     */
    public function stats(): JsonResponse
    {
        try {
            $totalOrders = Commande::count();
            $newOrders = Commande::where('created_at', '>=', Carbon::now()->subDays(30))->count();
            $lowStock = Produit::where('quantity', '<=', 5)->count();
            $totalRevenue = Commande::sum('montant_total');
            return response()->json([
                'status' => 'success',
                'data' => [
                    'total_orders' => $totalOrders,
                    'new_orders' => $newOrders,
                    'low_stock' => $lowStock,
                    'total_revenue' => number_format($totalRevenue, 2, '.', ''),
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve dashboard statistics.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Retrieve orders with optional search and status filters.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $search = $request->query('search');
            $query = Commande::query()
                ->join('users', 'commandes.user_id', '=', 'users.id')
                ->select(
                    'commandes.*',
                    DB::raw('CONCAT(users.prenom, " ", users.nom) as customer')
                )
                ->with(['user', 'detailsCommandes.produit', 'user.adressesLivraison']); // Eager load relationships

            if ($search) {
                $query->where('commandes.id', 'like', '%' . $search . '%')
                    ->orWhere(DB::raw('CONCAT(users.prenom, " ", users.nom)'), 'like', '%' . $search . '%')
                    ->orWhere('users.email', 'like', '%' . $search . '%');
            }
            $orders = $query->distinct()->get();

            return response()->json([
                'status' => 'success',
                'data' => CommandeRessource::collection($orders),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve orders.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete an order.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy($id): JsonResponse
    {
        try {
            $order = Commande::findOrFail($id);
            $order->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Order deleted successfully.',
            ], 204);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete order.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id) {
        try {
        $validated = $request->validate([
            'statut' => 'required|in:en attente,payé,annulé',
        ]);
        
        $order = Commande::findOrFail($id);
        $order->statut = $validated['statut'];
        $order->save();
        $order->load(['user', 'detailsCommandes.produit', 'user.adressesLivraison']);

        $order = Commande::query()
    ->join('users', 'commandes.user_id', '=', 'users.id')
    ->select('commandes.*', DB::raw('CONCAT(users.prenom, " ", users.nom) as customer'))
    ->with(['user', 'detailsCommandes.produit', 'user.adressesLivraison'])
    ->where('commandes.id', '=', $id)
    ->first();

        return response()->json([
            'statut' => 'success',
            'message' => 'mise à jour reussie',
            'data' => new CommandeRessource($order)
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Failed to update order.',
            'error' => $e->getMessage(),
        ], 500);
    }
    }
}