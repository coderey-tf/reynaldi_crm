<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        'nama_produk',
        'deskripsi_produk',
        'kategori',
        'hpp',
        'margin_sales',
        'harga_jual',
        'status'

    ];
}
