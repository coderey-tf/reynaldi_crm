<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $hpp = $this->faker->numberBetween(500000, 2000000);
        $margin = $this->faker->numberBetween(10, 30);
        $harga_jual = (int) round($hpp + ($hpp * $margin / 100));

        return [
            'nama_produk'      => $this->faker->words(3, true),
            'deskripsi_produk' => $this->faker->sentence(),
            'kategori'         => $this->faker->randomElement([
                'Paket Internet', 'Telepon', 'TV Kabel', 'Paket Bundling', 'Lainnya'
            ]),
            'hpp'              => $hpp,
            'margin_sales'     => $margin,
            'harga_jual'       => $harga_jual,
            'status'           => $this->faker->randomElement(['aktif', 'nonaktif']),
        ];
    }
}
