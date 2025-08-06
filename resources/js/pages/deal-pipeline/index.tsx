import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

import { Head, useForm } from '@inertiajs/react';
import { useState } from "react"
import {
    Plus,
    Search,
    Trash2,
    User,
    Package,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Clock,
    DollarSign,
    Check,
    ChevronsUpDown, Minus
} from 'lucide-react';

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
import { cn, formatCurrency } from '@/lib/utils';
import { Lead } from '@/types/leads';
import { Product } from '@/types/product';
import FormDialog from '@/pages/deal-pipeline/formDialog';
import { DealPipeline } from '@/types/deal-pipeline';


interface DealProduct {
    id: string
    productId: string
    productName: string
    hargaJualAsli: number
    hargaNegoisasi: number
    hpp: number
    quantity: number
    needsApproval: boolean
    approvalStatus?: "pending" | "approved" | "rejected"
}

interface Deal {
    id: string
    leadId: string
    customerName: string
    customerContact: string
    customerEmail: string
    products: DealProduct[]
    totalValue: number
    totalProfit: number
    profitMargin: number
    status: "draft" | "waiting-approval" | "approved" | "rejected" | "closed"
    notes: string
    createdDate: string
    approvedBy?: string
    approvedDate?: string
}

const statusColors = {
    draft: "bg-gray-100 text-gray-800",
    "waiting-approval": "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    closed: "bg-blue-100 text-blue-800",
}

const statusLabels = {
    draft: "Draft",
    "waiting-approval": "Menunggu Approval",
    approved: "Disetujui",
    rejected: "Ditolak",
    closed: "Selesai",
}

const statusIcons = {
    draft: Clock,
    "waiting-approval": AlertTriangle,
    approved: CheckCircle,
    rejected: XCircle,
    closed: CheckCircle,
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Deal Pipeline',
        href: '/deal-pipeline',
    },
];

export default function Index({ leads,products, dealPipeline }: { leads: Lead[],products: Product[], dealPipeline:DealPipeline[] }) {

    const form = useForm<Required<DealPipeline>>({
        id: "",
        leadId: "",
        deal_product: [],
        notes: "",
        totalValue: 0,
        totalProfit: 0,
        profitMargin: 0,
        status: "draft",
        approvedBy: '',
        approvedDate:''
    });
    console.log("leads",leads);
    console.log("dealPipeline",dealPipeline);
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState<string>("semua")
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)


    const filteredDeals = dealPipeline?.filter((deal) => {
        const matchesSearch =
            // deal.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            // deal.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            deal.deal_product.some((p) => p.product.nama_produk.toLowerCase().includes(searchTerm.toLowerCase()))
        const matchesStatus = filterStatus === "semua" || deal.status === filterStatus
        return matchesSearch && matchesStatus
    })






    const handleApprove = (dealId: string) => {
        // setDeals(
        //     deals.map((deal) =>
        //         deal.id === dealId
        //             ? {
        //                 ...deal,
        //                 status: "approved" as const,
        //                 approvedBy: "Manager Sales",
        //                 approvedDate: new Date().toISOString().split("T")[0],
        //                 products: deal.products.map((p) => ({ ...p, approvalStatus: "approved" as const })),
        //             }
        //             : deal,
        //     ),
        // )
    }

    const handleReject = (dealId: string) => {
        // setDeals(
        //     deals.map((deal) =>
        //         deal.id === dealId
        //             ? {
        //                 ...deal,
        //                 status: "rejected" as const,
        //                 products: deal.products.map((p) => ({ ...p, approvalStatus: "rejected" as const })),
        //             }
        //             : deal,
        //     ),
        // )
    }

    const handleDelete = (id: string) => {
        // setDeals(deals.filter((deal) => deal.id !== id))
    }



    const totalDeals = dealPipeline?.length
    const waitingApproval = dealPipeline?.filter((d) => d.status === "waiting-approval").length
    const approvedDeals = dealPipeline?.filter((d) => d.status === "approved").length
    const totalPipelineValue = dealPipeline?.filter((d) => d.status !== "rejected").reduce((sum, d) => sum + d.totalValue, 0)

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Deal Pipeline" />
            <div className="container mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Deal Pipeline</h1>
                        <p className="text-muted-foreground">Kelola proses konversi lead menjadi customer</p>
                    </div>
                    <FormDialog leads={leads} products={products} isFormDialogOpen={isFormDialogOpen} setIsFormDialogOpen={setIsFormDialogOpen} form={form}/>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Package className="w-4 h-4" />
                                Total Deals
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalDeals}</div>
                            <p className="text-xs text-muted-foreground">{approvedDeals} disetujui</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" />
                                Menunggu Approval
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{waitingApproval}</div>
                            <p className="text-xs text-muted-foreground">Perlu review</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                Pipeline Value
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg font-bold">{formatCurrency(totalPipelineValue??0)}</div>
                            <p className="text-xs text-muted-foreground">Total nilai deals</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {totalDeals > 0 ? ((approvedDeals / totalDeals) * 100).toFixed(1) : 0}%
                            </div>
                            <p className="text-xs text-muted-foreground">Lead to deal</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center space-x-2">
                        <Search className="w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari customer atau produk..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Filter status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="semua">Semua Status</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="waiting-approval">Menunggu Approval</SelectItem>
                            <SelectItem value="approved">Disetujui</SelectItem>
                            <SelectItem value="rejected">Ditolak</SelectItem>
                            <SelectItem value="closed">Selesai</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pipeline Deals</CardTitle>
                        <CardDescription>
                            Menampilkan {filteredDeals?.length} dari {dealPipeline?.length} deals
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Produk</TableHead>
                                        <TableHead className="text-right">Total Value</TableHead>
                                        <TableHead className="text-right">Profit</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDeals?.map((deal) => {
                                        const StatusIcon = statusIcons[deal.status]
                                        return (
                                            <TableRow key={deal.id}>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium flex items-center gap-2">
                                                            <User className="w-4 h-4" />
                                                            {deal.customer?.nama}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">{deal.customer?.email}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        {deal.deal_product.map((product, index) => (
                                                            <div key={index} className="text-sm">
                                                                <div className="flex items-center gap-2">
                                                                    <span>{product.product.nama_produk}</span>
                                                                    {product.needsApproval==1 && (
                                                                        <Badge className={'bg-yellow-100 text-yellow-800'}>

                                                                        <AlertTriangle  className="w-3 h-3 "  />
                                                                            {/*Perlu approval*/}
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {product.qty}x {formatCurrency(product.hargaNegoisasi)}
                                                                    {product.hargaNegoisasi < product.product.harga_jual && (
                                                                        <span className="text-yellow-600 ml-1">
                                    (diskon dari {formatCurrency(product.product.harga_jual)})
                                  </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right font-mono font-semibold">
                                                    {formatCurrency(deal.totalValue)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="text-sm">
                                                        <div className="font-semibold text-green-600">{formatCurrency(deal.totalProfit)}</div>
                                                        <div className="text-xs text-muted-foreground">{deal.profitMargin.toFixed(1)}%</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={statusColors[deal.status]}>
                                                        <StatusIcon className="w-3 h-3 mr-1" />
                                                        {statusLabels[deal.status]}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {/*<div>{new Date(dealPipeline?.createdDate).toLocaleDateString("id-ID")}</div>*/}
                                                    {deal.approvedDate && (
                                                        <div className="text-xs">
                                                            Approved: {new Date(deal.approvedDate).toLocaleDateString("id-ID")}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {deal.status === "waiting-approval" && (
                                                            <>
                                                                <Button variant="outline" size="sm" onClick={() => handleApprove(deal.id)}>
                                                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                                                </Button>
                                                                <Button variant="outline" size="sm" onClick={() => handleReject(deal.id)}>
                                                                    <XCircle className="w-4 h-4 text-red-600" />
                                                                </Button>
                                                            </>
                                                        )}
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="outline" size="sm">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Hapus Deal</AlertDialogTitle>
                                                                    {/*<AlertDialogDescription>*/}
                                                                    {/*    Apakah Anda yakin ingin menghapus deal untuk {deal.customerName}? Tindakan ini tidak*/}
                                                                    {/*    dapat dibatalkan.*/}
                                                                    {/*</AlertDialogDescription>*/}
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => handleDelete(deal.id)}
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
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                        {filteredDeals?.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                {searchTerm || filterStatus !== "semua" ? "Tidak ada deals yang sesuai dengan filter" : "Belum ada deals"}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>  </AppLayout>
    );
}
