<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $table = 'transactions';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'total_amount', 'transaction_status',
        'user_id', 'payment_id', 'event_id', 'promotion_id'
    ];

    public function user() {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function payment() {
        return $this->belongsTo(Payment::class, 'payment_id', 'id');
    }

    public function event() {
        return $this->belongsTo(Event::class, 'event_id', 'id');
    }

    public function details() {
        return $this->hasMany(TransactionDetail::class, 'transaction_id', 'id');
    }
}
