<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Promotion extends Model {
    protected $table = 'promotions';
    
    protected $fillable = [
        'code', 
        'discount_amount', 
        'discount_type',
        'max_discount_amount',
        'min_spending',
        'quota', 
        'start_date', 
        'end_date', 
        'event_id',
        'terms_and_conditions',
        'banner_path'
    ];

    public function event() {
        return $this->belongsTo(Event::class, 'event_id', 'id');
    }

    public function transactions() {
        return $this->hasMany(Transaction::class, 'promotion_id');
    }
}
