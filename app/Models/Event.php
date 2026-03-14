<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $table = 'events';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id', 'title', 'description', 'banner_image', 'event_date',
        'total_quota', 'start_time', 'end_time', 'location', 'status', 'event_category_id'
    ];

    public function category() {
        return $this->belongsTo(EventCategory::class, 'event_category_id', 'id');
    }

    public function ticketTypes() {
        return $this->hasMany(TicketType::class, 'event_id', 'id');
    }

    public function users() {
        return $this->belongsToMany(User::class, 'wishlists', 'event_id', 'user_id');
    }
}
