export type Product = {
    id: string
    nama_produk: string
    deskripsi_produk: string
    kategori: 'Paket Internet'| 'Telepon'| 'TV Kabel'| 'Paket Bundling'| 'Lainnya'
    hpp: number
    margin_sales: number
    harga_jual: number
    status: "aktif" | "nonaktif"

    // tanggalDibuat: string
}
