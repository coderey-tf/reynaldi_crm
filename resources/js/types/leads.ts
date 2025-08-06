export type Lead = {
    id: string,
    nama: string
    kontak: string
    email: string
    alamat: string
    kebutuhan: string
    status: "baru" | "prospek" | "negosiasi" | "deal" | "ditolak"
    // tanggalDibuat: string
}
