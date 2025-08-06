<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::latest()->get();

        return Inertia::render('products/index', [
            'products' => $products
        ]);
    }
    public function store(Request $request)
    {
        $request->validate([
            'nama_produk' => 'required|string|max:255',
            'deskripsi_produk' => 'required|string|max:255',
            'hpp' => 'required|numeric',
            'margin_sales' => 'required|numeric',
            'harga_jual' => 'required|numeric',
            'kategori' => 'required|in:Paket Internet,Telepon,TV Kabel,Paket Bundling,Lainnya',
            'status' => 'required|in:aktif,nonaktif',
        ]);

        Product::create($request->all());

        return redirect()->route('products.index')->with('success', 'Product berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {

        $lead = Product::findOrFail($id);

        $lead->update($request->all());

        return redirect()->route('products.index')->with('success', 'Product berhasil diperbarui.');
    }

    public function destroy($id)
    {
        Product::findOrFail($id)->delete();

        return redirect()->route('products.index')->with('success', 'Product berhasil dihapus.');
    }
}
