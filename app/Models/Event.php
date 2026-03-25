<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Event extends Model {
    protected $table = 'events';

    protected $primaryKey = 'id';
    
    public $incrementing = true;
    
    protected $keyType = 'int';
    
    protected $fillable = [
        'id', 
        'title', 
        'description', 
        'banner_image', 
        'event_date', 
        'total_quota', 
        'start_time', 
        'end_time', 
        'location', 
        'format',
        'event_category_id', 
        'organizer_id',
        'status',
    ];
    
    public function category() { 
        return $this->belongsTo(EventCategory::class, 'event_category_id'); 
    }
    
    public function organizer() { 
        return $this->belongsTo(Organizer::class, 'organizer_id'); 
    }

    public function ticketTypes() { 
        return $this->hasMany(TicketType::class, 'event_id'); 
    }

    public function promotions() { 
        return $this->hasMany(Promotion::class, 'event_id'); 
    }

    public function transactions() { 
        return $this->hasMany(Transaction::class, 'event_id'); 
    }

    public function waitingLists() { 
        return $this->hasMany(WaitingList::class, 'event_id'); 
    }

    public function wishlists() { 
        return $this->hasMany(Wishlist::class, 'event_id'); 
    }
}
