<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventCategory extends Model
{
    protected $table = 'event_category';
    protected $primaryKey = 'eventcategory_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['eventcategory_id', 'name', 'description'];

    public function events() {
        return $this->hasMany(Event::class, 'event_category_eventcategory_id', 'eventcategory_id');
    }
}
