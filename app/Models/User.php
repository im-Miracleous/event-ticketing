<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'id',
        'name',
        'username',
        'email',
        'password',
        'role',
        'status',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function transactions() {
        return $this->hasMany(Transaction::class, 'users_user_id', 'user_id');
    }

    public function events() {
        return $this->belongsToMany(Event::class, 'Register', 'users_user_id', 'events_event_id');
    }

    public function waitingLists() {
        return $this->belongsToMany(WaitingList::class, 'Register Waiting_List', 'users_user_id', 'waiting_list_waitinglist_id');
    }

    public function organizer() {
        return $this->hasOne(Organizer::class, 'user_id');
    }
}
