<?php

namespace App\Exports;

use App\Models\Transaction;
use App\Models\Event;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class OrganizerSalesExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    protected $organizerId;

    public function __construct(int $organizerId)
    {
        $this->organizerId = $organizerId;
    }

    public function collection()
    {
        // Get all successful transactions for events owned by this organizer
        $eventIds = Event::where('organizer_id', $this->organizerId)->pluck('id');
        
        return Transaction::with(['user', 'event'])
            ->whereIn('event_id', $eventIds)
            ->where('transaction_status', 'success')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function headings(): array
    {
        return [
            'Transaction ID',
            'Event Name',
            'Buyer Name',
            'Buyer Email',
            'Purchase Date',
            'Total Amount (IDR)',
            'Status'
        ];
    }

    public function map($transaction): array
    {
        return [
            $transaction->id,
            $transaction->event->title ?? 'Unknown Event',
            $transaction->user->name ?? 'Guest',
            $transaction->user->email ?? '-',
            $transaction->created_at->format('Y-m-d H:i:s'),
            $transaction->total_amount,
            ucfirst($transaction->transaction_status)
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Style the first row as bold text.
            1    => ['font' => ['bold' => true]],
        ];
    }
}
