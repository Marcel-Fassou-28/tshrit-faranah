<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Class DetailsCommande
 * 
 * @property int $id
 * @property int $quantity
 * @property float $prix_total
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property int $produit_id
 * @property int $commandes_id
 *
 * @package App\Models
 */
class DetailsCommande extends Model
{
    protected $table = 'details_commandes';
    protected $primaryKey = 'id';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $casts = [
        'quantity' => 'int',
        'prix_total' => 'float',
        'produit_id' => 'int',
        'commandes_id' => 'int',
        'taille' => 'string',
    ];

    protected $fillable = [
        'quantity',
        'prix_total',
        'produit_id',
        'commandes_id',
        'taille',
    ];

    public function produit(): BelongsTo
    {
        return $this->belongsTo(Produit::class, 'produit_id');
    }

    public function commande(): BelongsTo
    {
        return $this->belongsTo(Commande::class, 'commandes_id');
    }
}
