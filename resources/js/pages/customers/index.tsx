import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
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
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
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

const statusColors = {
    "1": "bg-green-100 text-green-800",
    '0': "bg-red-100 text-red-800",
}

const statusLabels = {
    "1": 'Aktif',
    "0": 'Nonaktif',
}

const statusIcons = {
    "1": CheckCircle,
    "0": XCircle,
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Customers',
        href: '/customers',
    },
];

export default function Index({ customers }: { customers:any }) {
    console.log('customer', customers);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('semua');

    const filteredCustomer = customers.filter((customer) => {
        const matchesSearch =
            customer.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase())
            // customer.products.some((p) => p.nama.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = filterStatus === 'semua' || customer.active === filterStatus;
        return matchesSearch && matchesStatus;
    });


    const totalCustomer = customers.length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Deal Pipeline" />
            <div className="container mx-auto space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Customers</h1>
                        <p className="text-muted-foreground">Customer Aktif</p>
                    </div>
                 </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                <Package className="h-4 w-4" />
                                Total Customer
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalCustomer}</div>
                            {/*<p className="text-xs text-muted-foreground">{approvedDeals} disetujui</p>*/}
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="flex items-center space-x-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari customer ..."
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
                            <SelectItem value="aktif">Aktif</SelectItem>
                            <SelectItem value="nonaktif">Nonaktif</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Customers</CardTitle>
                        <CardDescription>
                            Menampilkan {filteredCustomer.length} dari {customers.length} deals
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Produk</TableHead>
                                        <TableHead>Status</TableHead>
                                        {/*<TableHead className="text-right">Aksi</TableHead>*/}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCustomer.map((customer) => {
                                        const StatusIcon = statusIcons[customer.active]

                                        return (
                                            <TableRow key={customer.customer_id}>
                                                <TableCell>
                                                    <div>
                                                        <div className="flex items-center gap-2 font-medium">
                                                            <User className="h-4 w-4" />
                                                            {customer.nama}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">{customer.email}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        {customer.produk_dibeli.map((product, index) => (
                                                            <ul key={index} className="text-sm !list-disc !list-inside">
                                                                <li className="">
                                                                    {product.nama_produk}

                                                                </li>

                                                            </ul>
                                                        ))}
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <Badge className={statusColors[customer.active]}>
                                                        <StatusIcon className="mr-1 h-3 w-3" />
                                                        {statusLabels[customer.active]}
                                                    </Badge>
                                                </TableCell>

                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {/*{customer.active === 'waiting-approval' && (*/}
                                                        {/*    <>*/}
                                                        {/*        <Button variant="outline" size="sm" onClick={() => handleApprove(customer.id)}>*/}
                                                        {/*            <CheckCircle className="h-4 w-4 text-green-600" />*/}
                                                        {/*        </Button>*/}
                                                        {/*        <Button variant="outline" size="sm" onClick={() => handleReject(customer.id)}>*/}
                                                        {/*            <XCircle className="h-4 w-4 text-red-600" />*/}
                                                        {/*        </Button>*/}
                                                        {/*    </>*/}
                                                        {/*)}*/}
                                                        {/*<AlertDialog>*/}
                                                        {/*    <AlertDialogTrigger asChild>*/}
                                                        {/*        <Button variant="outline" size="sm">*/}
                                                        {/*            <Trash2 className="h-4 w-4" />*/}
                                                        {/*        </Button>*/}
                                                        {/*    </AlertDialogTrigger>*/}
                                                        {/*    <AlertDialogContent>*/}
                                                        {/*        <AlertDialogHeader>*/}
                                                        {/*            <AlertDialogTitle>Hapus Deal</AlertDialogTitle>*/}
                                                        {/*            <AlertDialogDescription>*/}
                                                        {/*                Apakah Anda yakin ingin menghapus customer untuk {customer.customerName}? Tindakan ini*/}
                                                        {/*                tidak dapat dibatalkan.*/}
                                                        {/*            </AlertDialogDescription>*/}
                                                        {/*        </AlertDialogHeader>*/}
                                                        {/*        <AlertDialogFooter>*/}
                                                        {/*            <AlertDialogCancel>Batal</AlertDialogCancel>*/}
                                                        {/*            <AlertDialogAction*/}
                                                        {/*                onClick={() => handleDelete(customer.id)}*/}
                                                        {/*                className="bg-red-600 hover:bg-red-700"*/}
                                                        {/*            >*/}
                                                        {/*                Hapus*/}
                                                        {/*            </AlertDialogAction>*/}
                                                        {/*        </AlertDialogFooter>*/}
                                                        {/*    </AlertDialogContent>*/}
                                                        {/*</AlertDialog>*/}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                        {filteredCustomer.length === 0 && (
                            <div className="py-8 text-center text-muted-foreground">
                                {searchTerm || filterStatus !== 'semua' ? 'Tidak ada deals yang sesuai dengan filter' : 'Belum ada deals'}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>{' '}
        </AppLayout>
    );
}
