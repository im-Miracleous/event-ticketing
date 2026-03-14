<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class TicketType extends Model {
    protected $table = 'tickets_types';
    protected $fillable = ['name', 'price', 'quota', 'available_stock', 'event_id'
    ];

    public function event() {
        return $this->belongsTo(Event::class, 'event_id', 'id');
    }

    public function transactionDetails() {
        return $this->hasMany(TransactionDetail::class, 'ticket_type_id', 'id');
    }

    public function tickets() {
        return $this->hasMany(Ticket::class, 'ticket_type_id', 'id');
    }

    public function waitingLists() {
        return $this->hasMany(WaitingList::class, 'ticket_type_id', 'id');
    }
}
