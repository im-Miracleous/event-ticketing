<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventCategory extends Model
{
    protected $table = 'event_category';

    protected $fillable = ['name', 'description'];

    public function events() {
        return $this->hasMany(Event::class, 'event_category_id', 'id');
    }
}
