<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryDistributionResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'name' => $this->name,
            'value' => number_format($this->value, 2, '.', ''),
        ];
    }
}