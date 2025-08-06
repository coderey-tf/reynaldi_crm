<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeadController extends Controller
{
    public function index()
    {
        if (auth()->user()->isManager()) {
            $leads = Lead::latest()->get();
        } else {
            $leads = Lead::where('userId', auth()->id())
                ->latest()
                ->get();
        }
//        $leads = Lead::latest()->get();

        return Inertia::render('leads/index', [
            'leads' => $leads
        ]);
    }
    public function store(Request $request)
    {
        $validated=  $request->validate([
            'nama' => 'required|string|max:255',
            'kontak' => 'required|string|max:20',
            'email' => 'required|email',
            'alamat' => 'required|string',
            'kebutuhan' => 'required|string',
            'status' => 'required|in:baru,prospek,negosiasi,deal,ditolak',
        ]);
        $validated['userId'] = auth()->id();
        Lead::create($validated);

        return redirect()->route('leads.index')->with('success', 'Lead berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $lead = Lead::findOrFail($id);

        $lead->update($request->all());

        return redirect()->route('leads.index')->with('success', 'Lead berhasil diperbarui.');
    }

    public function destroy($id)
    {
        Lead::findOrFail($id)->delete();

        return redirect()->route('leads.index')->with('success', 'Lead berhasil dihapus.');
    }
}
