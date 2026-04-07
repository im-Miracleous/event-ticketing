<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ValidationLog extends Model {
    protected $table = 'validation_logs';

    protected $fillable = [
        'validation_time',
        'result',
        'ticket_id'
    ];

    public function ticket() { 
        return $this->belongsTo(Ticket::class, 'ticket_id'); 
    }
}
