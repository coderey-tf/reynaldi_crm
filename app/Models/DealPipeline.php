<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DealPipeline extends Model
{
    protected $fillable = [
        'leadId',
        'customerId',
        'totalValue',
        'totalProfit',
        'profitMargin',
        'status',
        'notes',
        'approvedDate',
        'approvedBy',
    ];

    public function lead(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Lead::class, 'leadId','id');
    }

    public function customer(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
//        return $this->belongsToMany(Customers::class, 'id');
      return  $this->belongsTo(Customers::class, 'customerId');
    }

    public function dealProduct(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(DealPipelineDetail::class, 'deal_pipelines_id');
    }
}
