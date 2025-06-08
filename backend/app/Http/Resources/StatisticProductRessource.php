<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class StatisticProductRessource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'total_products' => (int) $this->total_products,
            'new_sales' => (int) $this->new_sales,
            'total_revenue' => number_format($this->total_revenue, 2, '.', ''),
        ];
    }
}