<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DealPipelineDetail extends Model
{
    protected $fillable = [
        'deal_pipelines_id',
        'productId',
        'qty',
        'hargaNegoisasi',
        'needsApproval',
        'statusApproval',
    ];

    public function product(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Product::class, 'productId');
    }
}
