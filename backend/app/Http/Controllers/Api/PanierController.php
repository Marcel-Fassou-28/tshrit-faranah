<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdressesLivraison;
use App\Models\Commande;
use App\Models\DetailsCommande;
use App\Models\Panier;
use App\Models\Produit;
use App\Models\User;
use App\Notifications\NewCommandNotification;
use App\Notifications\OrderConfirmationNotification;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class PanierController extends Controller
{
    public function index()
    {
        $items = Panier::with('produits')->where('user_id', Auth::id())->get();
        return response()->json([
            'success' => true,
            'data' => [
                'items' => $items->map(function ($item) {
                    return [
                        'id' => $item->produit_id,
                        'name' => $item->produit->nom_produit,
                        'price' => $item->produit->prix,
                        'image' => $item->produit->image_produit,
                    ];
                })
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:produits,id',
            'name' => 'required|string|exists:produits,nom_produit',
            'price' => 'required|numeric|min:0',
            'size' => 'required|in:L,M,XL,XXL',
            'quantity' => 'required|int|min:1',
            'guest_id' => 'required|string',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $quantity = $request->input('quantity', 1); // par défaut 1
        $price = $request->input('price');
        $montantTotal = $price * $quantity;

        if ($request->user_id) {
            $item = Panier::where('user_id', $request->user_id)
            ->where('produit_id', $request->id)
            ->where('taille', $request->size)
            ->first();
        } else {
            $item = Panier::where('token', $request->guest_id)
            ->where('produit_id', $request->id)
            ->where('taille', $request->size)
            ->first();
        }
        if ($item) {
            $item->quantity += $quantity;
            $item->montant_total += $montantTotal;
            $item->save();
        } else {
            $item = Panier::create([
                'nom_produit' => $request->name,
                'quantity' => $quantity,
                'taille' => $request->size,
                'montant_total' => $montantTotal,
                'user_id' => $request->user_id ?? null,
                'token' => $request->guest_id,
                'produit_id' => $request->id,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Produit ajouté au panier avec succès.',
            'data' => $item
        ]);
    }

    public function update(Request $request, $produitId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
            'size' => 'required|in:L,M,XL,XXL',
            'guest_id' => 'required_without:user_id|string',
            'user_id' => 'nullable|exists:users,id',
        ]);
        $query = Panier::where('produit_id', $produitId)
            ->where('taille', $request->size);

        if ($request->user_id) {
            $query->where('user_id', $request->user_id);
        } else {
            $query->where('token', $request->guest_id);
        }

        $item = $query->firstOrFail();
        $item->update(['quantity' => $request->quantity]);

        return response()->json(['success' => true]);
    }


    public function updateSize(Request $request, $produitId)
    {
        try 
        {
            $request->validate([
            'taille' => 'required|in:L,M,XL,XXL',
            'guest_id' => 'required_without:user_id|string',
            'user_id' => 'nullable|exists:users,id',
            ]);

            $query = Panier::where('produit_id', $produitId);
            if ($request->user_id) {
                $query->where('user_id', $request->user_id);
            } else {
                $query->where('token', $request->guest_id);
            }

            $item = $query->firstOrFail();
            $item->update(['taille' => $request->taille]);
            return response()->json(['success' => true]);
        } catch (Exception $e) {
            return response()->json([
                'succes' => false,
                'error' => $e->getMessage(),
            ]);
        }
    }


    public function destroy(Request $request, $produitId)
    {
        $request->validate([
            'size' => 'required|in:L,M,XL,XXL',
            'guest_id' => 'required_without:user_id|string',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $query = Panier::where('produit_id', $produitId)
            ->where('taille', $request->size);

        if ($request->user_id) {
            $query->where('user_id', $request->user_id);
        } else {
            $query->where('token', $request->guest_id);
        }
        $query->delete();
        return response()->json(['success' => true]);
    }


    public function clear(Request $request)
    {
        try {
            $request->validate([
                'guest_id' => 'required_without:user_id|string',
                'user_id' => 'nullable|exists:users,id',
            ]);

            if ($request->user_id) {
                Panier::where('user_id', $request->user_id)->delete();
            } elseif ($request->guest_id) {
                Panier::where('token', $request->guest_id)->delete();
            }
            return response()->json(['success' => true]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }


    public function command(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'items' => 'required|array|min:1',
            'items.*.produit_id' => 'required|exists:produits,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.taille' => 'required|in:M,L,XL,XXL',
            'user.nom' => 'required|string|max:50',
            'user.prenom' => 'required|string|max:100',
            'user.email' => 'required|email|max:250',
            'user.telephone' => 'required|string|max:20',
            'delivery.telephone' => 'required|string|max:15',
            'delivery.ville' => 'required|string|max:255',
            'delivery.adresse_1' => 'required|string|max:250',
            'delivery.adresse_2' => 'nullable|string|max:255',
            'user_id' => 'nullable|exists:users,id',
            'guest_id' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            DB::beginTransaction();

            $user = User::firstOrCreate(
                ['email' => $request->user['email']],
                [
                    'nom' => $request->user['nom'],
                    'prenom' => $request->user['prenom'],
                    'telephone' => $request->user['telephone'],
                    'password' => bcrypt(Str::random(16)),
                    'role' => 'client',
                ]
            );

            $adresse = AdressesLivraison::create([
                'user_id' => $user->id,
                'nom_complet' => $request->user['nom'] . ' ' . $request->user['prenom'],
                'telephone' => $request->delivery['telephone'],
                'ville' => $request->delivery['ville'],
                'adresse_1' => $request->delivery['adresse_1'],
                'adresse_2' => $request->delivery['adresse_2'] ?? '',
            ]);

            $montant_total = 0;
            $orderDetails = ['items' => []];

            foreach ($request->items as $item) {
                $produit = Produit::findOrFail($item['produit_id']);
                $prix_total = $produit->prix * $item['quantity'];
                $montant_total += $prix_total;

                $orderDetails['items'][] = [
                    'name' => $produit->nom_produit,
                    'taille' => $item['taille'],
                    'quantity' => $item['quantity'],
                    'prix_total' => $prix_total,
                ];
            }

            $orderDetails['montant_total'] = $montant_total;

            $commande = Commande::create([
                'montant_total' => $montant_total,
                'user_id' => $user->id,
            ]);

            foreach ($request->items as $item) {
                $produit = Produit::findOrFail($item['produit_id']);
                $prix_total = $produit->prix * $item['quantity'];

                DetailsCommande::create([
                    'produit_id' => $item['produit_id'],
                    'commandes_id' => $commande->id,
                    'quantity' => $item['quantity'],
                    'taille' => $item['taille'],
                    'prix_total' => $prix_total,
                ]);
            }

            $user->notify(new OrderConfirmationNotification($orderDetails, $adresse));

            $admins = User::where('role', 'admin')->get();
            if ($admins->isNotEmpty()) {
                Notification::send($admins, new NewCommandNotification($orderDetails, $adresse, $user));
            }

            if ($request->filled('user_id')) {
                Panier::where('user_id', $request->user_id)->delete();
            } elseif ($request->filled('guest_id')) {
                Panier::where('token', $request->guest_id)->delete();
            }
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Commande passée avec succès.',
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la commande: ' . $e->getMessage(),
            ], 500);
        }
    }

}