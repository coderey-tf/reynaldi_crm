<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Lead extends Model
{
    use HasFactory;
    protected $fillable = [
        'nama',
        'kontak',
        'email',
        'alamat',
        'status',
        'kebutuhan',
        'userId'

    ];
    public function customer(): HasOne
    {
        return $this->hasOne(Customers::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function dealPipelines()
    {
        return $this->hasMany(DealPipeline::class, 'leadId');
    }

}
