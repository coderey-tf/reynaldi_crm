<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Concerns\FromCollection;

class DealPipelineExport implements FromCollection
{
//    public function collection(): \Illuminate\Support\Collection
//    {
//        return DB::table('customers as cus')
//            ->join('deal_pipelines as dp', 'dp.customerId', '=', 'cus.id')
//            ->join('deal_pipeline_details as dpd', 'dpd.deal_pipelines_id', '=', 'dp.id')
//            ->select('cus.nama', 'cus.email', 'dp.totalValue', 'dpd.productId', 'dpd.qty')
//            ->get();
//    }
    public function export()
    {
        return Excel::download(new DealsExport, 'deals.xlsx');
    }

    public function collection()
    {
        // TODO: Implement collection() method.
    }
}
