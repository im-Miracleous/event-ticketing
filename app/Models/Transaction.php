<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $table = 'transactions';
    protected $primaryKey = 'transaction_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'transaction_id', 'total_amount', 'transaction_status',
        'users_user_id', 'payments_payment_id', 'events_event_id'
    ];

    public function user() {
        return $this->belongsTo(User::class, 'users_user_id', 'user_id');
    }

    public function payment() {
        return $this->belongsTo(Payment::class, 'payments_payment_id', 'payment_id');
    }

    public function event() {
        return $this->belongsTo(Event::class, 'events_event_id', 'event_id');
    }

    public function details() {
        return $this->hasMany(TransactionDetail::class, 'transactions_transaction_id', 'transaction_id');
    }
}
