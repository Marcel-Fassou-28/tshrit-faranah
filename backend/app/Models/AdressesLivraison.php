<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Class AdressesLivraison
 * 
 * @property int $id
 * @property string $nom_complet
 * @property string $telephone
 * @property string $ville
 * @property string $adresse_1
 * @property string $adresse_2
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property int $user_id
 *
 * @package App\Models
 */
class AdressesLivraison extends Model
{
    protected $table = 'adresses_livraison';
    protected $primaryKey = 'id';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $casts = [
        'user_id' => 'int'
    ];

    protected $fillable = [
        'nom_complet',
        'telephone',
        'ville',
        'adresse_1',
        'adresse_2',
        'user_id'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
