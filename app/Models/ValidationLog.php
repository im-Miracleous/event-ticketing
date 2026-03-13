<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ValidationLog extends Model
{
    protected $table = 'validation_logs';
    protected $primaryKey = 'validationlog_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['validationlog_id', 'validation_time', 'result', 'tickets_ticket_id'];

    public function ticket() {
        return $this->belongsTo(Ticket::class, 'tickets_ticket_id', 'ticket_id');
    }
}
