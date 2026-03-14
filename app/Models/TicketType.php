<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TicketType extends Model
{
    protected $table = 'tickets_types';

    protected $fillable = [
        'name', 'price', 'quota', 'available_stock', 'event_id'
    ];

    public function event() {
        return $this->belongsTo(Event::class, 'event_id', 'id');
    }
}
