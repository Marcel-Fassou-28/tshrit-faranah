<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryDistributionResource;
use App\Http\Resources\CategorySalesDistributionResource;
use App\Http\Resources\MonthlySalesResource;
use App\Http\Resources\StatisticsResource;
use App\Models\Commande;
use App\Models\Produit;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class StatisticsController extends Controller
{
    /**
     * Retrieve e-commerce statistics for total sales, new users, and total products.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $totalSales = Commande::where('statut', 'payé')->sum('montant_total');
            $newUsers = User::where('created_at', '>=', Carbon::now()->subDays(30))->count();
            $totalProducts = Produit::count();

            return response()->json([
                'status' => 'success',
                'data' => [
                    'total_sales' => $totalSales,
                    'new_users' => $newUsers,
                    'total_products' => $totalProducts,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve statistics.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Retrieve sales distribution by product category.
     *
     * @return JsonResponse
     */
    public function categories(): JsonResponse
    {

        try {
            $categorySales = DB::table('details_commandes')
    ->join('commandes', 'details_commandes.commandes_id', '=', 'commandes.id')
    ->join('produits', 'details_commandes.produit_id', '=', 'produits.id')
    ->join('categories', 'produits.category_id', '=', 'categories.id')
    ->where('commandes.statut', 'payé')
    ->selectRaw('categories.id as category_id, categories.nom_categorie as name, SUM(details_commandes.prix_total * details_commandes.quantity) as value')
    ->groupBy('categories.id', 'categories.nom_categorie') // Group by id for speed
    ->get();

            return response()->json([
                'status' => 'success',
                'data' => CategoryDistributionResource::collection($categorySales),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve category distribution.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Retrieve monthly sales data for the current year.
     *
     * @return JsonResponse
     */
    public function monthlySales(): JsonResponse
    {
        try {

            // Fetch sales data for the current year
            $salesData = DB::table('commandes')
                ->whereYear('created_at', Carbon::now()->year)
                ->groupBy(DB::raw('DATE_FORMAT(created_at, "%b"), MONTH(created_at)'))
                ->selectRaw('DATE_FORMAT(created_at, "%b") as name, SUM(montant_total) as sales')
                ->orderByRaw('MONTH(created_at)')
                ->pluck('sales', 'name')
                ->toArray();

            $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $formattedData = array_map(function ($month) use ($salesData) {
            return [
                'name' => $month,
                'sales' => isset($salesData[$month]) ? (float) $salesData[$month] : 0,
            ];
        }, $months);

        return response()->json([
            'status' => 'success',
            'data' => $formattedData,
        ], 200);

            return response()->json([
                'status' => 'success',
                'data' => MonthlySalesResource::collection($formattedData),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve monthly sales data.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Retrieve sales data by product category for bar chart.
     *
     * @return JsonResponse
     */
    public function categorySales(): JsonResponse
    {

        try {
            $categorySales = DB::table('details_commandes')
                ->join('commandes', 'details_commandes.commandes_id', '=', 'commandes.id')
                ->join('produits', 'details_commandes.produit_id', '=', 'produits.id')
                ->join('categories', 'produits.category_id', '=', 'categories.id')
                ->groupBy('categories.nom_categorie')
                ->selectRaw('categories.nom_categorie as name, SUM(details_commandes.prix_total * details_commandes.quantity) as value')
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => CategoryDistributionResource::collection($categorySales),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve category sales data.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}