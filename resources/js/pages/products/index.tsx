import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

import { useState } from "react"
import { Plus, Search, Edit, Trash2, Package, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import FormDialog from '@/pages/products/formDialog';
import { formatCurrency } from '@/lib/utils';
import { Product } from '@/types/product';



const kategoriLabels = {
    "Paket Internet": "Paket Internet",
    "TV Kabel": "TV Kabel",
    "Telepon": "Telepon",
    "Paket Bundling": "Paket Bundling",
    "Lainnya": "Lainnya",
}

const kategoriColors = {
    "Paket Internet": "bg-blue-100 text-blue-800",
    "TV Kabel": "bg-purple-100 text-purple-800",
    "Telepon": "bg-green-100 text-green-800",
    "Paket Bundling": "bg-orange-100 text-orange-800",
    "Lainnya": "bg-gray-100 text-gray-800",
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Products',
        href: '/products',
    },
];

export default function Index({ products }: { products: Product[] }) {
    const form = useForm<Required<Product>>({
        id:'',
        nama_produk: '',
        deskripsi_produk: '',
        kategori: 'Paket Internet',
        hpp: 0,
        margin_sales:0,
        harga_jual:0,
        status: 'aktif',
    });
    const [searchTerm, setSearchTerm] = useState("")
    const [filterKategori, setFilterKategori] = useState<string>("semua")
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)
    const [formState, setFormState] = useState('Tambah')

    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.nama_produk.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.deskripsi_produk.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesKategori = filterKategori === "semua" || product.kategori === filterKategori
        return matchesSearch && matchesKategori
    })



    const handleAdd = () => {

        setFormState('tambah')
        setIsFormDialogOpen(true)
    }

    const handleEdit = (product: Product) => {
        form.setData({
            nama_produk: product.nama_produk,
            deskripsi_produk: product.deskripsi_produk,
            kategori: product.kategori,
            hpp: product.hpp,
            harga_jual: product.harga_jual,
            id: product.id,
            margin_sales: product.margin_sales,
            status: product.status,
        })
        setFormState('edit')
        setIsFormDialogOpen(true)

    }


    const handleDelete = (id: string) => {
        form.delete(route('products.destroy', id))
    }


    const totalProducts = products.length
    const activeProducts = products.filter((p) => p.status === "aktif").length
    const avgMargin = products.length > 0 ? products.reduce((sum, p) => sum + p.margin_sales, 0) / products.length : 0
    const totalRevenue = products.reduce((sum, p) => sum + p.harga_jual, 0)

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
                    <FormDialog state={formState} form={form} isFormDialogOpen={isFormDialogOpen} setIsFormDialogOpen={setIsFormDialogOpen}  />
            <div className="container mx-auto p-6 space-y-6">

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Master Produk</h1>
                        <p className="text-muted-foreground">Kelola produk dan layanan Anda</p>
                    </div>
                    <Button className={'capitalize'} onClick={() => handleAdd()}>
                        <Plus className="mr-2 h-4 w-4" />
                        Tambah Produk
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Package className="w-4 h-4" />
                                Total Produk
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalProducts}</div>
                            <p className="text-xs text-muted-foreground">{activeProducts} aktif</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                Rata-rata Margin
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{avgMargin.toFixed(1)}%</div>
                            <p className="text-xs text-muted-foreground">Margin keuntungan</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Kategori Terbanyak</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Internet</div>
                            <p className="text-xs text-muted-foreground">
                                {products.filter((p) => p.kategori === "Paket Internet").length} produk
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Total Harga Jual</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-bold">{formatCurrency(totalRevenue)}</div>
                            <p className="text-xs text-muted-foreground">Semua produk</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center space-x-2">
                        <Search className="w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari produk..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>
                    <Select value={filterKategori} onValueChange={setFilterKategori}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Filter kategori" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="semua">Semua Kategori</SelectItem>
                            <SelectItem value="internet">Paket Internet</SelectItem>
                            <SelectItem value="tv-kabel">TV Kabel</SelectItem>
                            <SelectItem value="telepon">Telepon</SelectItem>
                            <SelectItem value="paket-bundling">Paket Bundling</SelectItem>
                            <SelectItem value="lainnya">Lainnya</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Produk</CardTitle>
                        <CardDescription>
                            Menampilkan {filteredProducts.length} dari {products.length} produk
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Produk</TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead className="text-right">HPP</TableHead>
                                        <TableHead className="text-right">Margin</TableHead>
                                        <TableHead className="text-right">Harga Jual</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProducts.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{product.nama_produk}</div>
                                                    <div className="text-sm text-muted-foreground max-w-[300px] truncate">{product.deskripsi_produk}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={kategoriColors[product.kategori]}>{kategoriLabels[product.kategori]}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-mono">{formatCurrency(product.hpp)}</TableCell>
                                            <TableCell className="text-right">
                                                <span className="font-semibold text-blue-600">{product.margin_sales}%</span>
                                            </TableCell>
                                            <TableCell className="text-right font-mono font-semibold text-green-600">
                                                {formatCurrency(product.harga_jual)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={product.status === "aktif" ? "default" : "secondary"}>
                                                    {product.status === "aktif" ? "Aktif" : "Non-aktif"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="outline" size="sm">
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Hapus Produk</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Apakah Anda yakin ingin menghapus produk "{product.nama_produk}"? Tindakan ini tidak dapat
                                                                    dibatalkan.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDelete(product.id)}
                                                                    className="bg-red-600 hover:bg-red-700"
                                                                >
                                                                    Hapus
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        {filteredProducts.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                {searchTerm || filterKategori !== "semua"
                                    ? "Tidak ada produk yang sesuai dengan filter"
                                    : "Belum ada produk"}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Edit Dialog */}
                {/*<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>*/}
                {/*    <DialogContent className="sm:max-w-[600px]">*/}
                {/*        <DialogHeader>*/}
                {/*            <DialogTitle>Edit Produk</DialogTitle>*/}
                {/*            <DialogDescription>Perbarui informasi produk</DialogDescription>*/}
                {/*        </DialogHeader>*/}
                {/*        <div className="grid gap-4 py-4">*/}
                {/*            <div className="grid grid-cols-2 gap-4">*/}
                {/*                <div className="space-y-2">*/}
                {/*                    <Label htmlFor="edit-nama">Nama Produk</Label>*/}
                {/*                    <Input*/}
                {/*                        id="edit-nama"*/}
                {/*                        value={data.nama_produk}*/}
                {/*                        onChange={(e) => setData({ ...data, nama_produk: e.target.value })}*/}
                {/*                        placeholder="Contoh: Paket Internet 50 Mbps"*/}
                {/*                    />*/}
                {/*                </div>*/}
                {/*                <div className="space-y-2">*/}
                {/*                    <Label htmlFor="edit-kategori">Kategori</Label>*/}
                {/*                    <Select*/}
                {/*                        value={data.kategori}*/}
                {/*                        onValueChange={(value: Product["kategori"]) => setData({ ...data, kategori: value })}*/}
                {/*                    >*/}
                {/*                        <SelectTrigger>*/}
                {/*                            <SelectValue />*/}
                {/*                        </SelectTrigger>*/}
                {/*                        <SelectContent>*/}
                {/*                            <SelectItem value="internet">Paket Internet</SelectItem>*/}
                {/*                            <SelectItem value="tv-kabel">TV Kabel</SelectItem>*/}
                {/*                            <SelectItem value="telepon">Telepon</SelectItem>*/}
                {/*                            <SelectItem value="paket-bundling">Paket Bundling</SelectItem>*/}
                {/*                            <SelectItem value="lainnya">Lainnya</SelectItem>*/}
                {/*                        </SelectContent>*/}
                {/*                    </Select>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*            <div className="space-y-2">*/}
                {/*                <Label htmlFor="edit-deskripsi">Deskripsi</Label>*/}
                {/*                <Textarea*/}
                {/*                    id="edit-deskripsi"*/}
                {/*                    value={data.deskripsi_produk}*/}
                {/*                    onChange={(e) => setData({ ...data, deskripsi_produk: e.target.value })}*/}
                {/*                    placeholder="Deskripsikan produk secara detail"*/}
                {/*                    className="min-h-[80px]"*/}
                {/*                />*/}
                {/*            </div>*/}
                {/*            <div className="grid grid-cols-2 gap-4">*/}
                {/*                <div className="space-y-2">*/}
                {/*                    <Label htmlFor="edit-hpp">HPP (Harga Pokok Penjualan)</Label>*/}
                {/*                    <Input*/}
                {/*                        id="edit-hpp"*/}
                {/*                        type="number"*/}
                {/*                        value={data.hpp || ""}*/}
                {/*                        onChange={(e) => setData({ ...data, hpp: Number(e.target.value) || 0 })}*/}
                {/*                        placeholder="0"*/}
                {/*                    />*/}
                {/*                </div>*/}
                {/*                <div className="space-y-2">*/}
                {/*                    <Label htmlFor="edit-margin_sales">Margin Sales (%)</Label>*/}
                {/*                    <Input*/}
                {/*                        id="edit-margin_sales"*/}
                {/*                        type="number"*/}
                {/*                        value={data.margin_sales || ""}*/}
                {/*                        onChange={(e) => setData({ ...data, margin_sales: Number(e.target.value) || 0 })}*/}
                {/*                        placeholder="0"*/}
                {/*                        min="0"*/}
                {/*                        max="100"*/}
                {/*                    />*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*            <div className="space-y-2">*/}
                {/*                <Label>Harga Jual (Otomatis)</Label>*/}
                {/*                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">*/}
                {/*                    <Calculator className="w-4 h-4 text-green-600" />*/}
                {/*                    <span className="font-semibold text-green-700">{formatCurrency(calculatedHargaJual)}</span>*/}
                {/*                    <span className="text-sm text-green-600">*/}
                {/*  (HPP: {formatCurrency(data.hpp)} + Margin {data.margin_sales}%)*/}
                {/*</span>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*            <div className="space-y-2">*/}
                {/*                <Label htmlFor="edit-status">Status</Label>*/}
                {/*                <Select*/}
                {/*                    value={data.status}*/}
                {/*                    onValueChange={(value: Product["status"]) => setData({ ...data, status: value })}*/}
                {/*                >*/}
                {/*                    <SelectTrigger>*/}
                {/*                        <SelectValue />*/}
                {/*                    </SelectTrigger>*/}
                {/*                    <SelectContent>*/}
                {/*                        <SelectItem value="aktif">Aktif</SelectItem>*/}
                {/*                        <SelectItem value="nonaktif">Non-aktif</SelectItem>*/}
                {/*                    </SelectContent>*/}
                {/*                </Select>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*        <DialogFooter>*/}
                {/*            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>*/}
                {/*                Batal*/}
                {/*            </Button>*/}
                {/*            <Button onClick={handleUpdate}>Perbarui</Button>*/}
                {/*        </DialogFooter>*/}
                {/*    </DialogContent>*/}
                {/*</Dialog>*/}
            </div>
        </AppLayout>
    );
}
