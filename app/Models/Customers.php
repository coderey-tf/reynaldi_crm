<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Customers extends Model
{
    protected $fillable = [
        'nama',
        'kontak',
        'email',
        'alamat',
        'active',
        'leadId',

    ];

    public function lead(): HasOne
    {
        return $this->hasOne(Lead::class);
    }

    public function deals(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(DealPipeline::class, 'customerId');
    }

}
