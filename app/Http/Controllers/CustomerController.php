<?php

namespace App\Http\Controllers;

use App\Models\Customers;
use App\Models\DealPipelineDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = DB::select("
                        SELECT cus.id cus_id,cus.*,dpd.*, p.nama_produk FROM `customers` cus
JOIN deal_pipelines dp on dp.customerId = cus.id
join deal_pipeline_details dpd on dpd.deal_pipelines_id = dp.id
join products p on p.id = dpd.productId ");
//dd($customers);
        $groupedData = [];

        foreach ($customers as $row) {
            $cusId = $row->cus_id;

            if (!isset($groupedData[$cusId])) {
                $groupedData[$cusId] = [];
            }

            $groupedData[$cusId]['customer_id'] = $row->cus_id;
            $groupedData[$cusId]['nama'] = $row->nama;
            $groupedData[$cusId]['kontak'] = $row->kontak;
            $groupedData[$cusId]['email'] = $row->email;
            $groupedData[$cusId]['active'] = $row->active;

            $groupedData[$cusId]['produk_dibeli'][] =  $row;
        }

        return Inertia::render('customers/index', [
            'customers' => array_values($groupedData)
        ]);
    }
    public function find($id)
    {
        return Customers::find($id);
    }
    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'kontak' => 'required|string|max:20',
            'email' => 'required|email',
            'alamat' => 'required|string',
            'active' => 'required|in:0,1',
            'leadId' => 'required|integer',
        ]);

        Customers::create($request->all());

        return redirect()->route('customers.index')->with('success', 'Customers berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $lead = Customers::findOrFail($id);

        $lead->update($request->all());

        return redirect()->route('customers.index')->with('success', 'Customers berhasil diperbarui.');
    }

    public function destroy($id)
    {
        Customers::findOrFail($id)->delete();

        return redirect()->route('customers.index')->with('success', 'Customers berhasil dihapus.');
    }
}
