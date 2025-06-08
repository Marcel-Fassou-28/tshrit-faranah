<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Class Panier
 * 
 * @property int $id
 * @property string $nom_produit
 * @property int $quantity
 * @property float $montant_total
 * @property int $user_id
 * @property int $produit_id
 * @property string|null $status
 * @property Carbon|null $created_at
 *
 * @package App\Models
 */
class Panier extends Model
{
    protected $table = 'paniers';
    protected $primaryKey = 'id';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $casts = [
        'quantity' => 'int',
        'montant_total' => 'float',
        'user_id' => 'int',
        'produit_id' => 'int',
        'taille' => 'string',
    ];

    protected $fillable = [
        'nom_produit',
        'quantity',
        'montant_total',
        'user_id',
        'produit_id',
        'status',
        'taille',
        'token',
    ];

    protected $hidden = [
        'token',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function produit(): BelongsTo
    {
        return $this->belongsTo(Produit::class, 'produit_id');
    }
}
