<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('nama_produk');
            $table->text('deskripsi_produk');
            $table->enum('kategori', ['Paket Internet', 'Telepon', 'TV Kabel', 'Paket Bundling', 'Lainnya']);
            $table->integer('hpp');
            $table->integer('margin_sales');
            $table->integer('harga_jual');
            $table->enum('status', ['aktif', 'nonaktif']);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
