<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\StatisticProductRessource;
use App\Models\Category;
use App\Models\Commande;
use App\Models\Produit;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request; // Corrigé : Utilisation correcte de Request
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class StatisticProductController extends Controller
{
    /**
     * Retrieve dashboard statistics for total products, new sales, low stock, and total revenue.
     *
     * @return JsonResponse
     */
    public function stats(): JsonResponse
    {
        try {
            $totalProducts = Produit::count();
            $newSales = Commande::where('statut', 'payé')
                ->where('created_at', '>=', Carbon::now()->subDays(30))
                ->count();
            $totalRevenue = Commande::sum('montant_total');

            return response()->json([
                'status' => 'success',
                'data' => [
                    'total_products' => $totalProducts,
                    'new_sales' => $newSales,
                    'total_revenue' => $totalRevenue,
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
     * Retrieve products with optional search and category filters.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {

        try {
            $search = $request->query('search');
            $categoryId = $request->query('category_id');

            $query = Produit::query()
                ->join('categories', 'produits.category_id', '=', 'categories.id')
                ->leftJoin('details_commandes', 'produits.id', '=', 'details_commandes.produit_id')
                ->leftJoin('commandes', 'details_commandes.commandes_id', '=', 'commandes.id')
                ->select(
                    'produits.id',
                    'produits.nom_produit as name',
                    'categories.nom_categorie as category',
                    'produits.prix as price',
                    DB::raw('COALESCE(SUM(details_commandes.quantity), 0) as sales'),
                    'produits.image_produit as image'
                )
                ->groupBy('produits.id', 'produits.nom_produit', 'categories.nom_categorie', 'produits.prix', 'produits.image_produit');

            // Appliquer les filtres de recherche et de catégorie
            if ($search) {
                $query->where('produits.nom_produit', 'like', '%' . $search . '%');
            }

            if ($categoryId) {
                $query->where('produits.category_id', $categoryId);
            }


            $products = $query->get();

            return response()->json([
                'status' => 'success',
                'data' => ProductResource::collection($products),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve products.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Create a new product.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'nom_produit' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'prix' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:1000',
            'image_produit.name' => 'nullable|string|max:255',
            'image_produit.data' => 'nullable|string',
        ]);
        
        try {
            if ($request->has('image_produit') && $request->image_produit['name'] &&  $request->image_produit['data']) {
                $photoData = $request->image_produit['data'];
                if (!preg_match('/^data:image\/(jpeg|png|jpg);base64,(.+)$/', $photoData, $matches)) {
                    return response()->json([
                        'message' => 'Format d\'image invalide',
                    ], 422);
                }
                
                $mimeType = $matches[1]; 
                $base64Data = $matches[2];

                $imageData = base64_decode($base64Data);
                if ($imageData === false) {
                    return response()->json([
                        'message' => 'Erreur lors du décodage de l\'image',
                    ], 422);
                };
                 
                if (strlen($imageData) > 5 * 1024 * 1024) {
                    return response()->json([
                        'message' => 'L\'image ne doit pas dépasser 5 Mo.',
                    ], 422);
                };

                $fileName = 'produit_' . time() . '_' . Str::random(20) . '.' . pathinfo(pathinfo($request->image_produit['name'], PATHINFO_BASENAME), PATHINFO_EXTENSION);
                $filePath = 'produits/' . $fileName;
                Storage::disk('public')->put($filePath, $imageData);
            }

            $productL = Produit::create([
                'nom_produit' => $request->nom_produit,
                'category_id' => $request->category_id,
                'description' => $request->description,
                'prix' => $request->prix,
                'image_produit' => $fileName ?: null,
            ]);

            $product = Produit::query()
                ->join('categories', 'produits.category_id', '=', 'categories.id')
                ->leftJoin('details_commandes', 'produits.id', '=', 'details_commandes.produit_id')
                ->leftJoin('commandes', 'details_commandes.commandes_id', '=', 'commandes.id')
                ->groupBy('produits.id', 'produits.nom_produit', 'categories.nom_categorie', 'produits.prix', 'produits.image_produit')
                ->select(
                    'produits.id',
                    'produits.nom_produit as name',
                    'categories.nom_categorie as category',
                    'produits.prix as price',
                    DB::raw('COALESCE(SUM(details_commandes.quantity), 0) as sales'),
                    'produits.image_produit as image'
                )->where('produits.id', $productL->id)->first();
                

            return response()->json([
                'status' => 'success',
                'message' => 'Product created successfully.',
                'data' => new ProductResource($product),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create product.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Retrieve all categories for filtering.
     *
     * @return JsonResponse
     */
    public function categories(): JsonResponse
    {

        try {
            $categories = Category::select('id', 'nom_categorie as name')->get();

            return response()->json([
                'status' => 'success',
                'data' => CategoryResource::collection($categories),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve categories.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $product = Produit::findOrFail($id);
            if ($product->image_produit && $product->image_produit != 'defaut.jpg') {
                Storage::disk('public')->delete('produits/' .$product->image_produit);
            }
            $product->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Product deleted successfully.',
            ], 204);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete product.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id): JsonResponse
    {
        try {
            $product = Produit::findOrFail($id);
            $request->validate([
                'nom_produit' => 'required|string|max:255',
                'category_id' => 'required|exists:categories,id',
                'prix' => 'required|numeric|min:0',
                'image_produit.name' => 'nullable|string|max:255',
                'image_produit.data' => 'nullable|string',
            ]);
            
            if ($request->has('image_produit') && $request->image_produit['name'] &&  $request->image_produit['data']) {
                $photoData = $request->image_produit['data'];
                if (!preg_match('/^data:image\/(jpeg|png|jpg);base64,(.+)$/', $photoData, $matches)) {
                    return response()->json([
                        'message' => 'Format d\'image invalide',
                    ], 422);
                }
                $mimeType = $matches[1]; 
                $base64Data = $matches[2];

                $imageData = base64_decode($base64Data);
                if ($imageData === false) {
                    return response()->json([
                        'message' => 'Erreur lors du décodage de l\'image',
                    ], 422);
                };

                if (strlen($imageData) > 5 * 1024 * 1024) {
                    return response()->json([
                        'message' => 'L\'image ne doit pas dépasser 5 Mo.',
                    ], 422);
                };

                $fileName = 'produit_' . time() . '_' . Str::random(20) . '.' . pathinfo(pathinfo($request->image_produit['name'], PATHINFO_BASENAME), PATHINFO_EXTENSION);
                $filePath = 'produits/' . $fileName;
                Storage::disk('public')->put($filePath, $imageData);
                if($product->image_produit && Storage::disk('public')->exists('produits/' . $product->image_produit) && $product->image_produit != 'defaut.jpg') {
                    Storage::disk('public')->delete('produits/' . $product->image_produit);
                }
            } else {
                $fileName = Produit::where('id', $id)->first()->image_produit;
            }

            $product->update([
                'nom_produit' => $request->nom_produit,
                'category_id' => $request->category_id,
                'prix' => $request->prix,
                'image_produit' => $fileName,
            ]);
            $product = Produit::query()
                    ->join('categories', 'produits.category_id', '=', 'categories.id')
                    ->leftJoin('details_commandes', 'produits.id', '=', 'details_commandes.produit_id')
                    ->leftJoin('commandes', 'details_commandes.commandes_id', '=', 'commandes.id')
                    ->orWhereNull('commandes.id')
                    ->groupBy('produits.id', 'produits.nom_produit', 'categories.nom_categorie', 'produits.prix', 'produits.quantity', 'produits.image_produit')
                    ->select(
                        'produits.id',
                        'produits.nom_produit as name',
                        'categories.nom_categorie as category',
                        'produits.prix as price',
                        DB::raw('COALESCE(SUM(details_commandes.quantity), 0) as sales'),
                        'produits.image_produit as image'
                    )->where('produits.id', $id)->first(); 

            return response()->json([
                'status' => 'success',
                'data' => new ProductResource($product),
            ], 200);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            Log::error($e);
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}