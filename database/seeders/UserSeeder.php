<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * NOTE: The User model has 'password' => 'hashed' cast,
     * so we pass PLAIN text passwords here — Eloquent will hash them automatically.
     */
    public function run(): void
    {
        // 1. Create Default Admin
        if (env('DEFAULT_ADMIN_EMAIL') && env('DEFAULT_ADMIN_PASSWORD')) {
            User::firstOrCreate(
                ['email' => env('DEFAULT_ADMIN_EMAIL')],
                [
                    'name' => 'System Admin',
                    'username' => 'testadmin',
                    'role' => 'Admin',
                    'password' => env('DEFAULT_ADMIN_PASSWORD'), // plain text, auto-hashed by cast
                    'email_verified_at' => now(),
                ]
            );
        }

        // 2. Create Default Organizer
        if (env('DEFAULT_ORGANIZER_EMAIL') && env('DEFAULT_ORGANIZER_PASSWORD')) {
            User::firstOrCreate(
                ['email' => env('DEFAULT_ORGANIZER_EMAIL')],
                [
                    'name' => 'Main Organizer',
                    'username' => 'testorganizer',
                    'role' => 'Organizer',
                    'password' => env('DEFAULT_ORGANIZER_PASSWORD'), // plain text, auto-hashed by cast
                    'email_verified_at' => now(),
                ]
            );
        }

        // 3. Create Default Test User
        User::firstOrCreate(
            ['email' => 'user@test.com'],
            [
                'name' => 'Test User',
                'username' => 'testuser',
                'role' => 'User',
                'password' => 'password123', // plain text, auto-hashed by cast
                'email_verified_at' => now(),
            ]
        );
    }
}
