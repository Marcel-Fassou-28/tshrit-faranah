<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Class Commande
 * 
 * @property int $id
 * @property float $montant_total
 * @property string|null $status
 * @property Carbon|null $created_at
 *
 * @package App\Models
 */
class Commande extends Model
{
    protected $table = 'commandes';
    protected $primaryKey = 'id';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $casts = [
        'montant_total' => 'float',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $fillable = [
        'montant_total',
        'statut',
        'user_id',
    ];

    public function detailsCommandes(): HasMany
    {
        return $this->hasMany(DetailsCommande::class, 'commandes_id');
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class, 'id');
    }
}
