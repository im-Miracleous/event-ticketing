<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Promotion extends Model {
    protected $table = 'promotions';
    
    protected $fillable = [
        'code', 
        'discount_amount', 
        'quota', 'start_date', 
        'end_date', 
        'event_id'
    ];

    public function event() {
        return $this->belongsTo(Event::class, 'event_id', 'id');
    }
}
