<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProductResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'category' => $this->category,
            'price' => number_format($this->price, 2, '.', ''),
            'sales' => (int) $this->sales,
            'image' => Storage::disk('public')->exists('produits/' .$this->image) ? url('storage/produits/' .$this->image) : null,
        ];
    }
}
