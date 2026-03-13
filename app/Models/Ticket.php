<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $table = 'tickets';
    protected $primaryKey = 'ticket_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'ticket_id', 'qr_code', 'ticket_status', 'issued_at', 'validated_at',
        'transaction_details_transactiondetail_id', 'transaction_details_transactions_transaction_id', 'tickets_types_tickettype_id'
    ];

    public function transactionDetail() {
        return $this->belongsTo(TransactionDetail::class, 'transaction_details_transactiondetail_id', 'transactiondetail_id');
    }

    public function ticketType() {
        return $this->belongsTo(TicketType::class, 'tickets_types_tickettype_id', 'tickettype_id');
    }

    public function validationLogs() {
        return $this->hasMany(ValidationLog::class, 'tickets_ticket_id', 'ticket_id');
    }
}
