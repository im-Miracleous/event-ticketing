<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $table = 'payments';
    protected $primaryKey = 'payment_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['payment_id', 'payment_method', 'payment_status', 'transaction_time'];

    public function transaction() {
        return $this->hasOne(Transaction::class, 'payments_payment_id', 'payment_id');
    }
}
