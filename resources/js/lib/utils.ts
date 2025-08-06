import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
export function formatCurrency(amount: number)  {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(amount)
}

export function date(paramDate?: Date): string {
    const date = paramDate ?? new Date()
    const pad = (n: number) => (n < 10 ? "0" + n : n);

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // bulan mulai dari 0
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


