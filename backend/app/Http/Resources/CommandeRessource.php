<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommandeRessource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'customer' => $this->customer ?? 'N/A',
            'order_date' => $this->created_at->format('Y-m-d H:i:s'),
            'statut' => $this->statut,
            'total' => number_format($this->montant_total, 2, '.', '')
        ];
    }
}