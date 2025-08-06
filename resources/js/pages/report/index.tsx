import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Report', href: '/report' },
];

export default function Index() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleExport = () => {
        if (!startDate || !endDate) {
            alert("Pilih tanggal mulai dan selesai!");
            return;
        }

        // Kirim parameter ke backend (GET request)
        window.location.href = route('deal-pipeline.export', {
            start_date: startDate,
            end_date: endDate
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Report" />
            <div className="container mx-auto space-y-6 p-6">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Report</h1>

                        {/* Filter tanggal */}
                        <div className="flex gap-2 mt-4">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="border rounded px-2 py-1"
                            />
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="border rounded px-2 py-1"
                            />
                        </div>

                        <Button
                            onClick={handleExport}
                            className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded mt-4"
                        >
                            Export Excel
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
