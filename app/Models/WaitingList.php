<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class WaitingList extends Model {
    protected $table = 'waiting_list';
    protected $fillable = ['status', 'event_id', 'ticket_type_id', 'user_id'];

    public function event() { return $this->belongsTo(Event::class, 'event_id'); }
    public function ticketType() { return $this->belongsTo(TicketType::class, 'ticket_type_id'); }
    public function user() { return $this->belongsTo(User::class, 'user_id'); }
}
