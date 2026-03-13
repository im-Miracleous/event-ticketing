<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $table = 'events';
    protected $primaryKey = 'event_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'event_id', 'title', 'description', 'banner_image', 'event_date',
        'total_quota', 'start_time', 'end_time', 'location', 'event_category_eventcategory_id'
    ];

    public function category() {
        return $this->belongsTo(EventCategory::class, 'event_category_eventcategory_id', 'eventcategory_id');
    }

    public function ticketTypes() {
        return $this->hasMany(TicketType::class, 'events_event_id', 'event_id');
    }

    public function users() {
        return $this->belongsToMany(User::class, 'Register', 'events_event_id', 'users_user_id');
    }
}
