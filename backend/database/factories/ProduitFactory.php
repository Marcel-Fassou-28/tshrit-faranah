<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Produit;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProduitFactory extends Factory
{
    protected $model = Produit::class;

    public function definition(): array
    {
    
        $categoryId = $this->faker->randomElement([1, 2, 3]);
        $category = Category::find($categoryId);
        $categoryName = $category ? $category->nom_categorie : 'Unknown';

        return [
            'nom_produit' => $this->faker->words(2, true),
            'categorie' => $categoryName,
            'prix' => $this->faker->randomFloat(2, 40000, 100000),
            'quantity' => $this->faker->numberBetween(1, 50),
            'description' => $this->faker->optional()->paragraph(),
            'image_produit' => 'defaut.jpg',
            'category_id' => $categoryId,
        ];
    }
}