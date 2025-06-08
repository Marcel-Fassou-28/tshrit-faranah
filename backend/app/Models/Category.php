<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Category
 * 
 * @property int $id
 * @property string $nom_categorie
 * @property string|null $description
 * @property string|null $photo
 * @package App\Models
 */
class Category extends Model
{
	protected $table = 'categories';
	protected $primaryKey = 'id';
    protected $keyType = 'int';
    public $incrementing = true;

	protected $fillable = [
		'nom_categorie',
		'description',
		'photo'
	];

	public function produits() {
        return $this->hasMany(Produit::class, 'category_id');
	}
}
