<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Wishlist extends Model {
    protected $table = 'wishlists';

    public $incrementing = false;

    protected $fillable = [
        'user_id', 
        'event_id'
    ];

    public function user() { 
        return $this->belongsTo(User::class, 'user_id'); 
    }

    public function event() { 
        return $this->belongsTo(Event::class, 'event_id'); 
    }
}
