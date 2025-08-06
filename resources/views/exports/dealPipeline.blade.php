<table>
    <thead>
    <tr>
        <th>Nama Customer</th>
        <th>Email Customer</th>
        <th>Total Value</th>
        <th>Total Profit</th>
        <th>Profit Margin (%)</th>
        <th>Status Deal</th>
        <th>Tanggal Approve</th>
        <th>Disetujui Oleh</th>
        <th>Produk</th>
        <th>Qty</th>
        <th>Harga Negoisasi</th>
        <th>Kategori Produk</th>
    </tr>
    </thead>
    <tbody>
    @foreach($deals as $deal)
        @php
            $rowspan = $deal->dealProduct->count();
        @endphp

        @foreach($deal->dealProduct as $index => $dp)
            <tr>
                @if($index === 0)
                    <td rowspan="{{ $rowspan }}">{{ $deal->customer->nama ?? '' }}</td>
                    <td rowspan="{{ $rowspan }}">{{ $deal->customer->email ?? '' }}</td>
                    <td rowspan="{{ $rowspan }}">{{ $deal->totalValue }}</td>
                    <td rowspan="{{ $rowspan }}">{{ $deal->totalProfit }}</td>
                    <td rowspan="{{ $rowspan }}">{{ $deal->profitMargin }}</td>
                    <td rowspan="{{ $rowspan }}">{{ $deal->status }}</td>
                    <td rowspan="{{ $rowspan }}">{{ $deal->approvedDate }}</td>
                    <td rowspan="{{ $rowspan }}">{{ $deal->approvedBy }}</td>
                @endif
                <td>{{ $dp->product->nama_produk ?? '' }}</td>
                <td>{{ $dp->qty ?? '' }}</td>
                <td>{{ $dp->hargaNegoisasi ?? '' }}</td>
                <td>{{ $dp->product->kategori ?? '' }}</td>
            </tr>
        @endforeach
    @endforeach
    </tbody>
</table>
