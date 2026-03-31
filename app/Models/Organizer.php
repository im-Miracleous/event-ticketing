<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Organizer extends Model {
    use HasUuids;

    protected $table = 'organizers';

    public $incrementing = false;

    protected $keyType = 'string';
    
    protected $fillable = [
        'id',
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
