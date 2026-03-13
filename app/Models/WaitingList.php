<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WaitingList extends Model
{
    protected $table = 'waiting_list';
    protected $primaryKey = 'waitinglist_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'waitinglist_id', 'waitinglist_status', 'events_event_id',
        'events_event_category_eventcategory_id', 'tickets_types_tickettype_id'
    ];

    public function event() {
        return $this->belongsTo(Event::class, 'events_event_id', 'event_id');
    }

    public function ticketType() {
        return $this->belongsTo(TicketType::class, 'tickets_types_tickettype_id', 'tickettype_id');
    }

    public function users() {
        return $this->belongsToMany(User::class, 'Register Waiting_List', 'waiting_list_waitinglist_id', 'users_user_id');
    }
}
