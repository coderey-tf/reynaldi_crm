import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

import { useState } from "react"
import { Plus, Search, Edit, Trash2, Phone, Mail, MapPin,Loader2Icon } from "lucide-react"

import { toast } from "sonner"

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
import { Lead } from '@/types/leads';



const statusColors = {
    baru: "bg-blue-100 text-blue-800",
    prospek: "bg-yellow-100 text-yellow-800",
    negosiasi: "bg-orange-100 text-orange-800",
    deal: "bg-green-100 text-green-800",
    ditolak: "bg-red-100 text-red-800",
}

const statusLabels = {
    baru: "Baru",
    prospek: "Prospek",
    negosiasi: "Negosiasi",
    deal: "Deal",
    ditolak: "Ditolak",
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Leads',
        href: '/leads',
    },
];

export default function Index({ leads }: { leads: Lead[] }) {
    console.log('leadssss',leads);
    const { data, setData, post,put, reset,processing ,delete:destroy} = useForm<Required<Lead>>({
        id:'',
        nama: '',
        kontak: '',
        email: '',
        alamat: '',
        kebutuhan: '',
        status: 'baru',
    });

    const [searchTerm, setSearchTerm] = useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editingLead, setEditingLead] = useState<Lead | null>(null)
    // const [data, setData] = useState({
    //     nama: "",
    //     kontak: "",
    //     email: "",
    //     alamat: "",
    //     kebutuhan: "",
    //     status: "baru" as Lead["status"],
    // })

    const filteredLeads = leads.filter(
        (lead) =>
            lead.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.kontak.includes(searchTerm) ||
            lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.kebutuhan.toLowerCase().includes(searchTerm.toLowerCase()),
    )



    const handleAdd = () => {
        // const newLead: Lead = {
        //     id: Date.now().toString(),
        //     ...data,
        //     // tanggalDibuat: new Date().toISOString().split("T")[0],
        // }
        console.log('newlead', data);
        post(route('leads.store'),{
            onSuccess: () => {

                toast.success('Berhasil menambahkan leads')

            }
        })
        setIsAddDialogOpen(false)
        reset()
        // setLeads([...leads, newLead])
    }

    const handleEdit = (lead: Lead) => {

        setEditingLead(lead)
        setData({
            id:lead.id,
            nama: lead.nama,
            kontak: lead.kontak,
            email: lead.email,
            alamat: lead.alamat,
            kebutuhan: lead.kebutuhan,
            status: lead.status,
        })
        setIsEditDialogOpen(true)
    }

    const handleUpdate = () => {
        console.log('datralead',data);

        if (editingLead) {

            put(route('leads.update',editingLead.id),{
                onSuccess: () => {
                    toast.success('Berhasil update leads')


                }
            })
            reset()
            setIsEditDialogOpen(false)
            setEditingLead(null)
            setData({
                id:'',
                nama: '',
                kontak: '',
                email: '',
                alamat: '',
                kebutuhan: '',
                status: 'baru',
            })
        }
    }

    const handleDelete = (id: string) => {
        destroy(route('leads.destroy',id),{
            onSuccess: () => {
                toast.success('Berhasil hapus leads')
            }
        })
        // setLeads(leads.filter((lead) => lead.id !== id))
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Leads" />
            <div className="container mx-auto space-y-6 p-6">
                {/* Header */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Manajemen Leads</h1>
                        <p className="text-muted-foreground">Kelola daftar calon customer Anda</p>
                    </div>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Lead
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>Tambah Lead Baru</DialogTitle>
                                <DialogDescription>Masukkan informasi calon customer baru</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nama">Nama Lengkap</Label>
                                        <Input
                                            id="nama"
                                            value={data.nama}
                                            onChange={(e) => setData({ ...data, nama: e.target.value })}
                                            placeholder="Masukkan nama lengkap"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="kontak">No. Telepon</Label>
                                        <Input
                                            id="kontak"
                                            value={data.kontak}
                                            onChange={(e) => setData({ ...data, kontak: e.target.value })}
                                            placeholder="08xxxxxxxxxx"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData({ ...data, email: e.target.value })}
                                        placeholder="email@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="alamat">Alamat</Label>
                                    <Textarea
                                        id="alamat"
                                        value={data.alamat}
                                        onChange={(e) => setData({ ...data, alamat: e.target.value })}
                                        placeholder="Masukkan alamat lengkap"
                                        className="min-h-[80px]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="kebutuhan">Kebutuhan</Label>
                                    <Textarea
                                        id="kebutuhan"
                                        value={data.kebutuhan}
                                        onChange={(e) => setData({ ...data, kebutuhan: e.target.value })}
                                        placeholder="Deskripsikan kebutuhan customer"
                                        className="min-h-[80px]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={data.status} onValueChange={(value: Lead['status']) => setData({ ...data, status: value })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="baru">Baru</SelectItem>
                                            <SelectItem value="prospek">Prospek</SelectItem>
                                            <SelectItem value="negosiasi">Negosiasi</SelectItem>
                                            <SelectItem value="deal">Deal</SelectItem>
                                            <SelectItem value="ditolak">Ditolak</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Batal
                                </Button>
                                <Button onClick={handleAdd} disabled={processing}>
                                    {processing ? <Loader2Icon className="animate-spin" /> :'Simpan'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{leads.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Baru</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{leads.filter((l) => l.status === 'baru').length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Prospek</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{leads.filter((l) => l.status === 'prospek').length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Negosiasi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{leads.filter((l) => l.status === 'negosiasi').length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Deal</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{leads.filter((l) => l.status === 'deal').length}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search */}
                <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari berdasarkan nama, kontak, email, atau kebutuhan..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                </div>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Leads</CardTitle>
                        <CardDescription>
                            Menampilkan {filteredLeads.length} dari {leads.length} leads
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Kontak</TableHead>
                                        <TableHead>Alamat</TableHead>
                                        <TableHead>Kebutuhan</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredLeads.map((lead, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{lead.nama}</div>
                                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                        <Mail className="h-3 w-3" />
                                                        {lead.email}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Phone className="h-3 w-3" />
                                                    {lead.kontak}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex max-w-[200px] items-start gap-1">
                                                    <MapPin className="mt-0.5 h-3 w-3 flex-shrink-0" />
                                                    <span className="truncate text-sm">{lead.alamat}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-[250px] text-sm">
                                                    {lead.kebutuhan.length > 50 ? `${lead.kebutuhan.substring(0, 50)}...` : lead.kebutuhan}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={statusColors[lead.status]}>{statusLabels[lead.status]}</Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {/*{new Date(lead.tanggalDibuat).toLocaleDateString("id-ID")}*/}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="outline" size="sm" onClick={() => handleEdit(lead)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="outline" size="sm">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Hapus Lead</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Apakah Anda yakin ingin menghapus lead {lead.nama}? Tindakan ini tidak dapat
                                                                    dibatalkan.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDelete(lead.id)}
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
                        {filteredLeads.length === 0 && (
                            <div className="py-8 text-center text-muted-foreground">
                                {searchTerm ? 'Tidak ada leads yang sesuai dengan pencarian' : 'Belum ada leads'}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Edit Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Edit Lead</DialogTitle>
                            <DialogDescription>Perbarui informasi lead</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-nama">Nama Lengkap</Label>
                                    <Input
                                        id="edit-nama"
                                        value={data.nama}
                                        onChange={(e) => setData({ ...data, nama: e.target.value })}
                                        placeholder="Masukkan nama lengkap"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-kontak">No. Telepon</Label>
                                    <Input
                                        id="edit-kontak"
                                        value={data.kontak}
                                        onChange={(e) => setData({ ...data, kontak: e.target.value })}
                                        placeholder="08xxxxxxxxxx"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-email">Email</Label>
                                <Input
                                    id="edit-email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData({ ...data, email: e.target.value })}
                                    placeholder="email@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-alamat">Alamat</Label>
                                <Textarea
                                    id="edit-alamat"
                                    value={data.alamat}
                                    onChange={(e) => setData({ ...data, alamat: e.target.value })}
                                    placeholder="Masukkan alamat lengkap"
                                    className="min-h-[80px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-kebutuhan">Kebutuhan</Label>
                                <Textarea
                                    id="edit-kebutuhan"
                                    value={data.kebutuhan}
                                    onChange={(e) => setData({ ...data, kebutuhan: e.target.value })}
                                    placeholder="Deskripsikan kebutuhan customer"
                                    className="min-h-[80px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-status">Status</Label>
                                <Select value={data.status} onValueChange={(value: Lead['status']) => setData({ ...data, status: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="baru">Baru</SelectItem>
                                        <SelectItem value="prospek">Prospek</SelectItem>
                                        <SelectItem value="negosiasi">Negosiasi</SelectItem>
                                        <SelectItem value="deal">Deal</SelectItem>
                                        <SelectItem value="ditolak">Ditolak</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                Batal
                            </Button>
                            <Button onClick={handleUpdate} disabled={processing}>
                                {processing ? <Loader2Icon className="animate-spin" /> : 'Perbarui'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
