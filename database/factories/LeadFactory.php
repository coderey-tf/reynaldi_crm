<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Lead>
 */
class LeadFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama'       => $this->faker->name(),
            'kontak'     => $this->faker->phoneNumber(),
            'email'      => $this->faker->unique()->safeEmail(),
            'alamat'     => $this->faker->address(),
            'kebutuhan'  => $this->faker->randomElement(['Paket Internet', 'TV Kabel', 'Telepon', 'Paket Bundling']),
            'status'     => $this->faker->randomElement(['baru', 'prospek', 'negosiasi', 'deal', 'ditolak']),
            'userId'    => 1
        ];
    }
}
