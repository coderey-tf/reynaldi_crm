import { InertiaFormProps } from '@inertiajs/react';

import { Calculator,  Loader2Icon } from 'lucide-react';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { Dispatch, SetStateAction } from 'react';
import { Product } from '@/types/product';

// interface Product {
//     id: string
//     nama_produk: string
//     deskripsi_produk: string
//     kategori: 'Paket Internet'| 'Telepon'| 'TV Kabel'| 'Paket Bundling'| 'Lainnya' | ''
//     hpp: number
//     margin_sales: number
//     harga_jual: number
//     status: "aktif" | "nonaktif"
// }
export default function FormDialog({
                                       state,
                                       isFormDialogOpen,
                                       setIsFormDialogOpen,
                                       form }:
{ state: string,
    isFormDialogOpen: boolean,
    setIsFormDialogOpen: Dispatch<SetStateAction<boolean>>,
    form:InertiaFormProps<Product> }) {
    const resetForm = () => {
        form.setData({
            id: '',
            nama_produk: '',
            deskripsi_produk: '',
            kategori: 'Paket Internet',
            hpp: 0,
            harga_jual: 0,
            margin_sales: 0,
            status: 'aktif',
        });
        // setCalculatedHargaJual(0)
    };

    const handleAdd = () => {
        const hargaJual = form.data.hpp + (form.data.hpp * form.data.margin_sales) / 100;

        form.transform(() => ({
            ...form.data,
            harga_jual: hargaJual,
        }));
        form.post(route('products.store'), {
            onSuccess: () => {
                toast.success('Berhasil menambahkan produk');
                setIsFormDialogOpen(false);
                resetForm();
            },
            // onError: (e) => {},
        });
    };

    const handleUpdate = () => {
        const hargaJual = form.data.hpp + (form.data.hpp * form.data.margin_sales) / 100;

        form.transform((data: Product) => ({
            ...data,
            harga_jual: hargaJual,
        }));
        form.put(route('products.update', form.data.id), {
            onSuccess: () => {
                toast.success('Berhasil perbarui produk');
                setIsFormDialogOpen(false);
                resetForm();
            },
            // onError: (e) => {},
        });
    };

    console.log('errosss', form.errors);
    return (
        <div>
            <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
                {/*<DialogTrigger asChild>*/}
                {/*    <Button className={'capitalize'}>*/}
                {/*        <Plus className="mr-2 h-4 w-4" />*/}
                {/*        Tambah Produk*/}
                {/*    </Button>*/}
                {/*</DialogTrigger>*/}
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className={'capitalize'}>{state} Produk </DialogTitle>
                        <DialogDescription>Masukkan informasi produk </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nama">Nama Produk</Label>
                                <Input
                                    id="nama"
                                    value={form.data.nama_produk}
                                    onChange={(e) => form.setData({ ...form.data, nama_produk: e.target.value })}
                                    placeholder="Contoh: Paket Internet 50 Mbps"
                                />
                                {form.errors.nama_produk && <p className="text-sm text-red-500">{form.errors.nama_produk}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="kategori">Kategori</Label>
                                <Select
                                    value={form.data.kategori}
                                    onValueChange={(value: Product['kategori']) => form.setData({ ...form.data, kategori: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Paket Internet">Paket Internet</SelectItem>
                                        <SelectItem value="TV Kabel">TV Kabel</SelectItem>
                                        <SelectItem value="Telepon">Telepon</SelectItem>
                                        <SelectItem value="Paket Bundling">Paket Bundling</SelectItem>
                                        <SelectItem value="Lainnya">Lainnya</SelectItem>
                                    </SelectContent>
                                </Select>
                                {form.errors.kategori && <p className="text-sm text-red-500">{form.errors.kategori}</p>}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="deskripsi">Deskripsi</Label>
                            <Textarea
                                id="deskripsi"
                                value={form.data.deskripsi_produk}
                                onChange={(e) => form.setData({ ...form.data, deskripsi_produk: e.target.value })}
                                placeholder="Deskripsikan produk secara detail"
                                className="min-h-[80px]"
                            />
                            {form.errors.deskripsi_produk && <p className="text-sm text-red-500">{form.errors.deskripsi_produk}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="hpp">HPP (Harga Pokok Penjualan)</Label>
                                <Input
                                    id="hpp"
                                    type="number"
                                    value={form.data.hpp || ''}
                                    onChange={(e) => form.setData({ ...form.data, hpp: Number(e.target.value) || 0 })}
                                    placeholder="0"
                                />
                                {form.errors.hpp && <p className="text-sm text-red-500">{form.errors.hpp}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="marginSales">Margin Sales (%)</Label>
                                <Input
                                    id="marginSales"
                                    type="number"
                                    value={form.data.margin_sales || ''}
                                    onChange={(e) => form.setData({ ...form.data, margin_sales: Number(e.target.value) || 0 })}
                                    placeholder="0"
                                    min="0"
                                    max="100"
                                />
                                {form.errors.margin_sales && <p className="text-sm text-red-500">{form.errors.margin_sales}</p>}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Harga Jual (Otomatis)</Label>
                            <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 p-3">
                                <Calculator className="h-4 w-4 text-green-600" />
                                <span className="font-semibold text-green-700">
                                    {formatCurrency(form.data.hpp + (form.data.hpp * form.data.margin_sales) / 100)}
                                </span>
                                <span className="text-sm text-green-600">
                                    (HPP: {formatCurrency(form.data.hpp)} + Margin {form.data.margin_sales}%)
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={form.data.status}
                                onValueChange={(value: Product['status']) => form.setData({ ...form.data, status: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="aktif">Aktif</SelectItem>
                                    <SelectItem value="nonaktif">Non-aktif</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsFormDialogOpen(false)}>
                            Batal
                        </Button>
                        <Button onClick={state == 'edit' ? handleUpdate : handleAdd} disabled={form.processing}>
                            {form.processing ? <Loader2Icon className="animate-spin" /> : state == 'edit' ? 'Perbarui' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
