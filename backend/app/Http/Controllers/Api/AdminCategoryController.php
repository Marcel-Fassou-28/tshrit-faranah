<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Commande;
use App\Models\Produit;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminCategoryController extends Controller
{
    public function add(Request $request) {
        $request->validate([
            'nom_categorie' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'photo.name' => 'nullable|string|max:255',
            'photo.data' => 'nullable|string',
        ]);
        
        try {
            if ($request->has('photo') && $request->photo['name'] &&  $request->photo['data']) {
                $photoData = $request->photo['data'];
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

                $fileName = 'categorie_' . time() . '_' . Str::random(20) . '.' . pathinfo(pathinfo($request->photo['name'], PATHINFO_BASENAME), PATHINFO_EXTENSION);
                $filePath = 'categories/' . $fileName;
                Storage::disk('public')->put($filePath, $imageData);
            }

            $category = Category::create([
                'nom_categorie' => $request->nom_categorie,
                'description' => $request->description,
                'photo' => $fileName ?: null,
            ]);

            $photoUrl = $category->photo && Storage::disk('public')->exists('categories/' . $category->photo)
                ? url('storage/categories/' . $category->photo)
                : url('storage/categories/tshirts.jpg');

            return response()->json([
                'success' => true,
                'message' => 'Catégorie créée avec succès.',
                'data' => [
                    'id' => $category->id,
                    'nom_categorie' => $category->nom_categorie,
                    'description' => $category->description,
                    'photo' => $photoUrl,
                ],
            ], 201);

            

            return response()->json([
                'status' => 'success',
                'message' => 'Category created successfully.',
                'data' => $category,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create category.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function index()
    {
        try {
            $categories = Category::withCount('produits')->get();
            $categories = $categories->map(function ($category) {
                $photoUrl = $category->photo && Storage::disk('public')->exists('categories/' . $category->photo)
                    ? url('storage/categories/' . $category->photo)
                    : url('/categories/tshirts.jpg'); // URL par défaut
                return [
                    'id' => $category->id,
                    'nom_categorie' => $category->nom_categorie,
                    'photo' => $photoUrl,
                    'description' => $category->description,
                    'products_count' => $category->produits_count,
                ];
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

    public function stats(): JsonResponse
    {
        try {
            $totalCategories = Category::count();
            $totalProducts = Produit::count();
            $totalRevenue = Commande::sum('montant_total');
            $formattedRevenue = number_format($totalRevenue, 2, '.', '');

            return response()->json([
                'success' => true,
                'message' => 'Statistiques récupérées avec succès.',
                'data' => [
                    'total_categorie' => $totalCategories,
                    'total_products' => $totalProducts,
                    'total_revenue' => $formattedRevenue,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de la récupération des statistiques.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id) {
        try {
            $category = Category::findOrFail($id);
            if ($category->photo && $category->photo != 'tshirts.jpg') {
                Storage::disk('public')->delete('categories/' .$category->photo);
            }
            $category->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'category deleted successfully.',
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
            $category = Category::findOrFail($id);
            $request->validate([
                'nom_categorie' => 'required|string|max:255',
                'id' => 'required|exists:categories,id',
                'photo.name' => 'nullable|string|max:255',
                'photo.data' => 'nullable|string',
            ]);
            
            if ($request->has('photo') && $request->photo['name'] &&  $request->photo['data']) {
                $photoData = $request->photo['data'];
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

                $fileName = 'categorie_' . time() . '_' . Str::random(20) . '.' . pathinfo(pathinfo($request->photo['name'], PATHINFO_BASENAME), PATHINFO_EXTENSION);
                $filePath = 'categories/' . $fileName;
                Storage::disk('public')->put($filePath, $imageData);
                if($category->photo && Storage::disk('public')->exists('categories/' . $category->photo) && $category->photo != 'defaut.jpg') {
                    Storage::disk('public')->delete('categories/' . $category->photo);
                }
            } else {
                $fileName = Produit::where('id', $id)->first()->image_produit;
            }

            $category->update([
                'nom_categorie' => $request->nom_produit,
                'id' => $request->category_id,
                'photo' => $fileName,
            ]);
           
            $photoUrl = $category->photo && Storage::disk('public')->exists('categories/' . $category->photo)
                ? url('storage/categories/' . $category->photo)
                : url('storage/categories/tshirts.jpg');

            return response()->json([
                'success' => true,
                'message' => 'Catégorie créée avec succès.',
                'data' => [
                    'id' => $category->id,
                    'nom_categorie' => $category->nom_categorie,
                    'description' => $category->description,
                    'photo' => $photoUrl,
                ],
            ], 201);

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
