import {
    Plus,
    Trash2,
    ChevronsUpDown,
    Check, Minus, AlertTriangle
} from 'lucide-react';

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
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn, date, formatCurrency } from '@/lib/utils';
import { Dispatch, SetStateAction, useState } from 'react';
import { DealPipeline, DealProduct } from '@/types/deal-pipeline';
import { InertiaFormProps, usePage } from '@inertiajs/react';
import { Product } from '@/types/product';
import { Lead } from '@/types/leads';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import type { SharedData } from '@/types';

export default function FormDialog({isFormDialogOpen, setIsFormDialogOpen, form, products, leads}:
                                   {
                                       isFormDialogOpen: boolean,
                                       setIsFormDialogOpen: Dispatch<SetStateAction<boolean>>,
                                       form: InertiaFormProps<Required<DealPipeline>>,
                                       products:Product[],
                                       leads:Lead[]
                                   }){
    const { auth } = usePage<SharedData>().props;
    // console.log('auth',auth);
    const [selectedProducts, setSelectedProducts] = useState<DealProduct[]>([])
    const [selectedLead, setSelectedLead] = useState<Lead>("")
    const [leadSearchOpen, setLeadSearchOpen] = useState(false)
    const [leadSearchValue, setLeadSearchValue] = useState("")
    const [minimizedProducts, setMinimizedProducts] = useState<Set<string>>(new Set())
    const {data, setData, transform,post,processing,reset} = form

    const addProductToDeal = () => {
        const newProduct: DealProduct = {
            productId: "",
            productName: "",
            hpp: 0,
            hargaJualAsli: 0,
            hargaNegoisasi: 0,
            quantity: 1,
            needsApproval: false,
        }
        setSelectedProducts([...selectedProducts, newProduct])
    }

    const updateProduct = (index: number, field: keyof DealProduct, value: any) => {
        const updatedProducts = [...selectedProducts]
        updatedProducts[index] = { ...updatedProducts[index], [field]: value }

        // If product is selected, update prices
        if (field === "productId" && value) {
            const product = products.find((p) => p.id === value)
            if (product) {
                updatedProducts[index].productName = product.nama_produk
                updatedProducts[index].hargaJualAsli = product.harga_jual
                updatedProducts[index].hargaNegoisasi = product.harga_jual
                updatedProducts[index].hpp = product.hpp
                updatedProducts[index].needsApproval = false
            }
        }

        // Check if negotiated price is below selling price
        if (field === "hargaNegoisasi") {
            const needsApproval = value < updatedProducts[index].hargaJualAsli
            updatedProducts[index].needsApproval = needsApproval
            if (needsApproval) {
                updatedProducts[index].approvalStatus = "pending"
            }
        }

        setSelectedProducts(updatedProducts)
    }

    const removeProduct = (index: number) => {
        setSelectedProducts(selectedProducts.filter((_, i) => i !== index))
    }

    const calculateTotals = (products: DealProduct[]) => {
        const totalValue = products.reduce((sum, p) => sum + p.hargaNegoisasi * p.quantity, 0)
        const totalCost = products.reduce((sum, p) => sum + p.hpp * p.quantity, 0)
        const totalProfit = totalValue - totalCost
        const profitMargin = totalValue > 0 ? (totalProfit / totalValue) * 100 : 0

        return { totalValue, totalProfit, profitMargin }
    }

    const handleAdd = () => {
        const selectedLead = leads.find((l) => l.id === data.leadId)
        if (!selectedLead || selectedProducts.length === 0) return
        console.log('selectedProduc',selectedProducts);
        const { totalValue, totalProfit, profitMargin } = calculateTotals(selectedProducts)
        const needsApproval = selectedProducts.some((p) => p.needsApproval)

        transform(()=>({
            id: Date.now().toString(),
            leadId: data.leadId,
            // customerName: selectedLead.nama,
            // customerContact: selectedLead.kontak,
            // customerEmail: selectedLead.email,
            deal_product: selectedProducts,
            totalValue,
            totalProfit,
            profitMargin,
            status: needsApproval ? "waiting-approval" : "approved",
            notes: data.notes,
            approvedDate: date(),
            approvedBy: auth.user.name,
        }))
        console.log('newdeal', data);
        post(route('deal-pipeline.store'), {
            onSuccess: () => {
                toast.success('Berhasil menambahkan deal');
                setIsFormDialogOpen(false);
                resetForm();
            },
            // onError: (e) => {},
        });

        // setDeals([...deals, newDeal])
        // setIsFormDialogOpen(false)
        // resetForm()
    }

    const resetForm = () => {
        // setData({
        //     leadId: "",
        //     notes: "",
        //     products: [],
        // })
        setSelectedProducts([])
        reset()
        setLeadSearchOpen(false)
        setLeadSearchValue("")
        setMinimizedProducts(new Set())
    }



    const toggleMinimizeProduct = (productId: string) => {
        const newMinimized = new Set(minimizedProducts)
        if (newMinimized.has(productId)) {
            newMinimized.delete(productId)
        } else {
            newMinimized.add(productId)
        }
        setMinimizedProducts(newMinimized)
    }
    return (
        <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Buat Deal Baru
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Buat Deal Baru</DialogTitle>
                    <DialogDescription>Konversi lead menjadi deal dengan produk yang dipilih</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="leadId">Pilih Lead</Label>
                        <Popover open={leadSearchOpen} onOpenChange={setLeadSearchOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={leadSearchOpen}
                                    className="w-full justify-between bg-transparent"
                                >
                                    {data.leadId
                                        ? leads.find((lead) => lead.id === data.leadId)?.nama +
                                        " - " +
                                        leads.find((lead) => lead.id === data.leadId)?.email
                                        : "Pilih lead untuk dikonversi..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-(--radix-popover-trigger-width) max-h-[200px] p-0">
                                <Command>
                                    <CommandInput placeholder="Cari lead berdasarkan nama atau email..." />
                                    <CommandList>
                                        {" "}
                                        {/* Wrap CommandGroup and CommandEmpty in CommandList */}
                                        <CommandEmpty>Lead tidak ditemukan.</CommandEmpty>
                                        <CommandGroup>
                                            {leads.map((lead) => (
                                                <CommandItem
                                                    key={lead.id}
                                                    value={`${lead.nama} ${lead.email} ${lead.kontak}`}
                                                    onSelect={() => {
                                                        setData({ ...data, leadId: lead.id })
                                                        setLeadSearchOpen(false)
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            data.leadId === lead.id ? "opacity-100" : "opacity-0",
                                                        )}
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{lead.nama}</span>
                                                        <span className="text-sm text-muted-foreground">
                                  {lead.email} • {lead.kontak}
                                </span>
                                                    </div>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Produk dalam Deal</Label>
                            <Button type="button" variant="outline" size="sm" onClick={addProductToDeal}>
                                <Plus className="w-4 h-4 mr-2" />
                                Tambah Produk
                            </Button>
                        </div>

                        {selectedProducts.map((product, index) => {
                            const isMinimized = minimizedProducts.has(product.productId)
                            return (
                                <Card key={product.productId} className="p-4">
                                    {/* Header with minimize toggle */}
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleMinimizeProduct(product.productId)}
                                                className="p-1 h-6 w-6"
                                            >
                                                {isMinimized ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                                            </Button>
                                            <span className="font-medium text-sm">
                            Produk {index + 1}
                                                {product.productName && ` - ${product.productName}`}
                          </span>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeProduct(index)}
                                            className="text-red-600 hover:text-red-700 h-6 w-6 p-0"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>

                                    {/* Minimized view */}
                                    {isMinimized && product.productName && (
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="font-medium">{product.productName}</span>
                                                <div className="text-right">
                                                    <div className="font-semibold">
                                                        {formatCurrency(product.hargaNegoisasi * product.quantity)}
                                                    </div>
                                                    {product.hargaNegoisasi !== product.hargaJualAsli && product.hargaJualAsli > 0 && (
                                                        <div className="text-xs text-muted-foreground line-through">
                                                            {formatCurrency(product.hargaJualAsli * product.quantity)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center text-xs text-muted-foreground">
                                                <span>Qty: {product.quantity}</span>
                                                {product.needsApproval && (
                                                    <div className="flex items-center gap-1 text-yellow-600">
                                                        <AlertTriangle className="w-3 h-3" />
                                                        Perlu approval
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Expanded view */}
                                    {!isMinimized && (
                                        <>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Produk</Label>
                                                    <Select
                                                        value={product.productId}
                                                        onValueChange={(value) => updateProduct(index, "productId", value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Pilih produk" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {products.map((prod) => (
                                                                <SelectItem key={prod.id} value={prod.id}>
                                                                    {prod.nama_produk} - {formatCurrency(prod.harga_jual)}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Quantity</Label>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        value={product.quantity}
                                                        onChange={(e) => updateProduct(index, "quantity", Number(e.target.value) || 1)}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Harga Jual Asli</Label>
                                                    <Input value={formatCurrency(product.hargaJualAsli)} disabled />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Harga Negosiasi</Label>
                                                    <div className="relative">
                                                        <Input
                                                            type="number"
                                                            value={product.hargaNegoisasi || ""}
                                                            onChange={(e) => updateProduct(index, "hargaNegoisasi", Number(e.target.value) || 0)}
                                                            className={product.needsApproval ? "border-yellow-500" : ""}
                                                        />
                                                        {product.needsApproval && (
                                                            <div className="absolute -bottom-6 left-0 text-xs text-yellow-600 flex items-center gap-1">
                                                                <AlertTriangle className="w-3 h-3" />
                                                                Perlu approval (di bawah harga jual)
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center mt-4 pt-2 border-t">
                                                <div className="text-sm text-muted-foreground">
                                                    Subtotal: {formatCurrency(product.hargaNegoisasi * product.quantity)}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </Card>
                            )
                        })}
                        {selectedProducts.length > 0 && (
                            <Card className="p-4 bg-green-50 border-green-200">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="font-medium">Total Deal:</span>
                                        <span className="font-bold text-green-700">
                          {formatCurrency(calculateTotals(selectedProducts).totalValue)}
                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Profit:</span>
                                        <span>{formatCurrency(calculateTotals(selectedProducts).totalProfit)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Margin:</span>
                                        <span>{calculateTotals(selectedProducts).profitMargin.toFixed(2)}%</span>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Catatan</Label>
                        <Textarea
                            id="notes"
                            value={data.notes}
                            onChange={(e) => setData({ ...data, notes: e.target.value })}
                            placeholder="Catatan tambahan untuk deal ini"
                            className="min-h-[80px]"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsFormDialogOpen(false)}>
                        Batal
                    </Button>
                    <Button onClick={handleAdd} disabled={!data.leadId || selectedProducts.length === 0}>
                        Buat Deal
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
