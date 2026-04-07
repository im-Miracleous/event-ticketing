<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model {
    protected $table = 'payments';

    protected $fillable = [
        'payment_method', 
        'payment_status', 
        'transaction_time',
        'doku_invoice_number',
        'doku_payment_url',
        'doku_va_number',
        'doku_channel',
        'doku_raw_response',
    ];

    protected function casts(): array
    {
        return [
            'doku_raw_response' => 'array',
        ];
    }

    public function transactions() { 
        return $this->hasMany(Transaction::class, 'payment_id'); 
    }
}
