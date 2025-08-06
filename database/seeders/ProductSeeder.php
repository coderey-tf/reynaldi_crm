<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
public function run(): void
{
    $products = [
        [
            'nama_produk' => 'Paket Internet 10 Mbps',
            'deskripsi_produk' => 'Internet cepat dengan kecepatan 10 Mbps',
            'kategori' => 'Paket Internet',
            'hpp' => 10000000,
            'margin_sales' => 15,
            'harga_jual' => 11500000,
            'status' => 'aktif',
        ],
        [
            'nama_produk' => 'Paket Internet 20 Mbps',
            'deskripsi_produk' => 'Internet cepat dengan kecepatan 20 Mbps',
            'kategori' => 'Paket Internet',
            'hpp' => 15000000,
            'margin_sales' => 20,
            'harga_jual' => 18000000,
            'status' => 'aktif',
        ],
        [
            'nama_produk' => 'TV Kabel Basic',
            'deskripsi_produk' => 'Paket TV kabel dengan 50+ channel lokal & internasional',
            'kategori' => 'TV Kabel',
            'hpp' => 7000000,
            'margin_sales' => 25,
            'harga_jual' => 8750000,
            'status' => 'aktif',
        ],
        [
            'nama_produk' => 'Paket Bundling Internet + TV',
            'deskripsi_produk' => 'Gabungan internet 20 Mbps + TV kabel 60 channel',
            'kategori' => 'Paket Bundling',
            'hpp' => 20000000,
            'margin_sales' => 10,
            'harga_jual' => 22000000,
            'status' => 'aktif',
        ],
        [
            'nama_produk' => 'Telepon Rumah Basic',
            'deskripsi_produk' => 'Layanan telepon rumah dengan tarif hemat',
            'kategori' => 'Telepon',
            'hpp' => 5000000,
            'margin_sales' => 20,
            'harga_jual' => 6000000,
            'status' => 'nonaktif',
        ],
    ];

    foreach ($products as $product) {
        Product::create($product);
    }
}
}
