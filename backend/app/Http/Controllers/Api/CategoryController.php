<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Commande;
use App\Models\Produit;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    /**
     * Permet de retourner toutes les categories existantes
     */
    public function all()
    {
        try {
            $categories = Category::all();
            $categories = $categories->map(function ($category) {
                $photoUrl = $category->photo && Storage::disk('public')->exists('categories/' . $category->photo)
                    ? url('storage/categories/' . $category->photo)
                    : null;
                $category->photo = $photoUrl;
                return $category;
            });

            return response()->json([
                'success' => true,
                'message' => 'Catégories récupérées avec succès.',
                'data' => $categories
            ], 200);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des catégories', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de la récupération des catégories.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Permet de retourner les details d'une categories
     */
    public function detailled(string $id) {
         try {

            $category = Category::with('produits')->find($id);
            if (!$category) {
                return response()->json([
                    'success' => false,
                    'message' => 'Catégorie non trouvée.'
                ], 404);
            }

            $category->photo = $category->photo && Storage::disk('public')->exists('categories/' . $category->photo)
                ? url('storage/categories/' . $category->photo)
                : null;

            $category->produits = $category->produits->map(function ($produit) {
                $produit->image_produit = $produit->image_produit && Storage::disk('public')->exists('produits/' . $produit->image_produit)
                    ? url('storage/produits/' . $produit->image_produit)
                    : null;
                return $produit;
            });

            return response()->json([
                'success' => true,
                'message' => 'Détails de la catégorie récupérés avec succès.',
                'data' => [
                    'category' => $category,
                    'produits' => $category->produits
                ]
            ], 200);
        } catch (Exception $e) {
            Log::error('Erreur lors de la récupération des détails de la catégorie', [
                'category_id' => $id,
                'error' => $e->getMessage()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de la récupération des détails de la catégorie.',
                'error' => $e->getMessage()
            ], 500);
        }
    }


}
