<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Ticket extends Model {
    protected $table = 'tickets';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id', 
        'qr_code', 
        'ticket_status', 
        'issued_at', 
        'validated_at', 
        'transaction_detail_id', 
        'ticket_type_id'
    ];

    protected $casts = [
        'issued_at' => 'datetime',
        'validated_at' => 'datetime',
    ];

    public function detail() { 
        return $this->belongsTo(TransactionDetail::class, 'transaction_detail_id'); 
    }

    public function ticketType() { 
        return $this->belongsTo(TicketType::class, 'ticket_type_id'); 
    }

    public function attendee() { 
        return $this->hasOne(Attendee::class, 'ticket_id'); 
    }

    public function validationLogs() { 
        return $this->hasMany(ValidationLog::class, 'ticket_id'); 
    }
}
