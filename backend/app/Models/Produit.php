<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Class Produit
 * 
 * @property int $id
 * @property string $nom_produit
 * @property float $prix
 * @property string|null $description
 * @property string $image_produit
 * @property int $category_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @package App\Models
 */
class Produit extends Model
{
    use HasFactory;

    protected $table = 'produits';
    protected $primaryKey = 'id';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $casts = [
        'prix' => 'float',
        'category_id' => 'int',
    ];

    protected $fillable = [
        'nom_produit',
        'prix',
        'description',
        'image_produit',
        'category_id',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id', 'id');
    }

    public function paniers(): HasMany
    {
        return $this->hasMany(Panier::class, 'produit_id');
    }

    public function detailsCommandes(): HasMany
    {
        return $this->hasMany(DetailsCommande::class, 'produit_id');
    }
}
