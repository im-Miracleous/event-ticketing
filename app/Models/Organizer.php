<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Organizer extends Model {
    protected $table = 'organizers';
    
    protected $fillable = [
        'name', 
        'description', 
        'logo', 
        'bank_account', 
        'user_id'
    ];
    
    public function user() { 
        return $this->belongsTo(User::class, 'user_id'); 
    }

    public function events() { 
        return $this->hasMany(Event::class, 'organizer_id'); 
    }
}
