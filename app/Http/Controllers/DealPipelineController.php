<?php

namespace App\Http\Controllers;

use App\Exports\DealsExport;
use App\Models\Customers;
use App\Models\DealPipeline;
use App\Models\DealPipelineDetail;
use App\Models\Lead;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Http\Controllers\DealPipelineExport;
use Maatwebsite\Excel\Facades\Excel;

class DealPipelineController extends Controller
{
    public function index()
    {

        if (auth()->user()->isManager()) {
            $leads = Lead::latest()->get();
            $queryDeal = DealPipeline::with(['customer', 'dealProduct.product'])->get();
            $dealsPipeline = response()->json($queryDeal);
        } else {
            $leads = Lead::where('userId', auth()->id())
                ->latest()
                ->get();
            $queryDeal = DealPipeline::with(['customer', 'dealProduct.product'])->get();

            $dealsPipeline = response()->json($queryDeal);
        }
        $products = Product::latest()->get();
        return Inertia::render('deal-pipeline/index', [
            'dealPipeline' => $dealsPipeline->getData(),
            'leads' => $leads,
            'products' => $products,
        ]);
    }
    public function store(Request $request)
    {
        $lead = Lead::find($request->leadId);


        $customer = Customers::create([
            'nama'      => $lead->nama,
            'kontak'    => $lead->kontak,
            'alamat'    => $lead->alamat,
            'email'    => $lead->email,
            'active'    => 1,
            'leadId'    => $request->leadId,
        ]);

        $request->validate([
            'id'              => 'required|string',
            'leadId'          => 'required|integer|exists:leads,id',
            'deal_product'     => 'required|array|min:1',
            'deal_product.*.productId'    => 'required|integer|exists:products,id',
            'deal_product.*.productName'  => 'required|string',
            'deal_product.*.hpp'          => 'required|numeric|min:0',
            'deal_product.*.hargaJualAsli'=> 'required|numeric|min:0',
            'deal_product.*.hargaNegoisasi'=> 'required|numeric|min:0',
            'deal_product.*.quantity'     => 'required|integer|min:1',
            'deal_product.*.needsApproval'=> 'required|boolean',
            'totalValue'     => 'required|numeric|min:0',
            'totalProfit'    => 'required|numeric|min:0',
            'profitMargin'   => 'required|numeric|min:0',
            'status'         => 'required|in:waiting-approval,approved,rejected',
            'notes'          => 'nullable|string',
            'approvedDate'   => 'nullable|date',
            'approvedBy'     => 'nullable|string',
        ]);

        $deal = DealPipeline::create([
            'leadId'        => $request->leadId,
            'customerId'    => $customer->id,
            'totalValue'    => $request->totalValue,
            'totalProfit'   => $request->totalProfit,
            'profitMargin'  => $request->profitMargin,
            'status'        => $request->status,
            'notes'         => $request->notes,
            'approvedDate'  => $request->approvedDate,
            'approvedBy'    => $request->approvedBy,
        ]);

        foreach ($request->deal_product as $item) {
            DealPipelineDetail::create([
                'deal_pipelines_id' => $deal->id,
                'productId'         => $item['productId'],
                'qty'               => $item['quantity'],
                'hargaNegoisasi'    => $item['hargaNegoisasi'],
                'needsApproval'     => $item['needsApproval'],
                'statusApproval'    => $item['needsApproval'] ? 'waiting' : 'approved',
            ]);
        }




        return redirect()->route('deal-pipeline.index')->with('success', 'Lead berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $lead = Lead::findOrFail($id);

        $lead->update($request->all());

        return redirect()->route('deal-pipeline.index')->with('success', 'Lead berhasil diperbarui.');
    }

    public function destroy($id)
    {
        Lead::findOrFail($id)->delete();

        return redirect()->route('deal-pipeline.index')->with('success', 'Lead berhasil dihapus.');
    }
    public function export(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate   = $request->input('end_date');

        return Excel::download(new DealsExport($startDate, $endDate), 'deal-pipelines.xlsx');
    }
}
