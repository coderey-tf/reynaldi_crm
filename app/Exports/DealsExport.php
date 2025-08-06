<?php

namespace App\Exports;

use App\Models\DealPipeline;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class DealsExport implements FromView, WithStyles, ShouldAutoSize
{
    protected $startDate;
    protected $endDate;

    public function __construct($startDate, $endDate)
    {
        $this->startDate = $startDate;
        $this->endDate   = $endDate;
    }

    public function view(): View
    {
//        $deals = DealPipeline::with(['customer', 'dealProduct.product'])->get();
        $query = DealPipeline::with(['customer', 'dealProduct.product'])
            ->whereDate('created_at', '>=', $this->startDate)
            ->whereDate('created_at', '<=', $this->endDate);

//        if (! auth()->user()->isManager()) {
//            $query->whereHas('lead', function ($q) {
//                $q->where('user_id', auth()->id());
//            });
//        }
        $deals = $query->get();

        return view('exports.dealPipeline', compact('deals'));
    }

    public function styles(Worksheet $sheet)
    {
        // Styling header
        $sheet->getStyle('A1:L1')->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF'],
            ],
            'fill' => [
                'fillType' => 'solid',
                'color' => ['rgb' => '4B5563'],
            ],
            'alignment' => [
                'horizontal' => 'center',
                'vertical' => 'center',
            ],
        ]);

        $highestRow = $sheet->getHighestRow();
        $highestColumn = $sheet->getHighestColumn();
        $sheet->getStyle("A1:{$highestColumn}{$highestRow}")->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => 'thin',
                    'color' => ['rgb' => '000000'],
                ],
            ],
        ]);

        return [];
    }
}
