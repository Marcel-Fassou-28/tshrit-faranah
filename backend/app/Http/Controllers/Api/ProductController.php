<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * Fetch products, optionally filtered by category.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            $category = $request->query('category');
            $query = Produit::with('category');

            if ($category) {
                $categoryModel = Category::whereRaw('LOWER(nom_categorie) = ?', [strtolower($category)])->first();
                if (!$categoryModel) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Catégorie non trouvée.'
                    ], 404);
                }
                $query->where('category_id', $categoryModel->id);
            }

            $products = $query->get()->map(function ($product) {
                // Generate image URL
                $imageUrl = $product->image_produit && Storage::disk('public')->exists('produits/' . $product->image_produit)
                    ? url('storage/produits/' . $product->image_produit)
                    : null;

                return [
                    'id' => $product->id,
                    'name' => $product->nom_produit,
                    'price' => (float) $product->prix,
                    'imageUrl' => $imageUrl,
                    'description' => $product->description,
                    'category' => $product->category->nom_categorie ?? $product->categorie,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $products
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des produits.'
            ], 500);
        }
    }


    public function show($id)
    {
        try {
            if (!is_numeric($id) || $id <= 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'ID du produit invalide.'
                ], 400);
            }
            $product = Produit::with('category')->find($id);
            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Produit non trouvé.'
                ], 404);
            }

            $imageUrl = $product->image_produit && Storage::disk('public')->exists('produits/' . $product->image_produit)
                ? url('storage/produits/' . $product->image_produit)
                : null;

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $product->id,
                    'name' => $product->nom_produit,
                    'price' => (float) $product->prix,
                    'imageUrl' => $imageUrl,
                    'description' => $product->description,
                    'category' => $product->category->nom_categorie ?? $product->categorie
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération du produit.'
            ], 500);
        }
    }
}