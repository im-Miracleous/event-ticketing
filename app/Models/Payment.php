<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $table = 'payments';

    protected $fillable = ['payment_method', 'payment_status', 'transaction_time'];

    public function transaction() {
        return $this->hasOne(Transaction::class, 'payment_id', 'id');
    }
}
