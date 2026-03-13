<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransactionDetail extends Model
{
    protected $table = 'transaction_details';
    protected $primaryKey = 'transactiondetail_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'transactiondetail_id', 'subtotal', 'quantity',
        'transactions_transaction_id', 'tickets_types_tickettype_id'
    ];

    public function transaction() {
        return $this->belongsTo(Transaction::class, 'transactions_transaction_id', 'transaction_id');
    }

    public function ticketType() {
        return $this->belongsTo(TicketType::class, 'tickets_types_tickettype_id', 'tickettype_id');
    }
}
