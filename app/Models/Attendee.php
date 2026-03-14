<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Attendee extends Model {
    protected $table = 'attendees';
    protected $fillable = ['name', 'email', 'phone_number', 'identity_number', 'ticket_id'];

    public function ticket() {
        return $this->belongsTo(Ticket::class, 'ticket_id', 'id');
    }
}
