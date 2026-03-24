<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create Default Admin
        if (env('DEFAULT_ADMIN_EMAIL') && env('DEFAULT_ADMIN_PASSWORD')) {
            User::firstOrCreate(
                ['email' => env('DEFAULT_ADMIN_EMAIL')],
                [
                    'name' => 'System Admin',
                    'username' => 'sysadmin',
                    'role' => 'Admin',
                    'password' => Hash::make(env('DEFAULT_ADMIN_PASSWORD')),
                    'email_verified_at' => now(),
                    // Using fixed UUID or letting Model handle it via trait, 
                    // HasUuids trait in User model handles 'id' assignment.
                ]
            );
        }

        // 2. Create Default Organizer
        if (env('DEFAULT_ORGANIZER_EMAIL') && env('DEFAULT_ORGANIZER_PASSWORD')) {
            User::firstOrCreate(
                ['email' => env('DEFAULT_ORGANIZER_EMAIL')],
                [
                    'name' => 'Main Organizer',
                    'username' => 'eventorganizer',
                    'role' => 'Organizer',
                    'password' => Hash::make(env('DEFAULT_ORGANIZER_PASSWORD')),
                    'email_verified_at' => now(),
                ]
            );
        }
    }
}
