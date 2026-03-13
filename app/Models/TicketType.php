<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TicketType extends Model
{
    protected $table = 'tickets_types';
    protected $primaryKey = 'tickettype_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'tickettype_id', 'name', 'price', 'quota', 'available_stock',
        'events_event_id', 'events_event_category_eventcategory_id'
    ];

    public function event() {
        return $this->belongsTo(Event::class, 'events_event_id', 'event_id');
    }
}
