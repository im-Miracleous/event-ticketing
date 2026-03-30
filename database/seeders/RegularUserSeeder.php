<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class RegularUserSeeder extends Seeder
{
    /**
     * Seed regular users (Organizer + User roles).
     */
    public function run(): void
    {
        $userNames = [
            'Sarah Johnson', 'Ahmad Rizky', 'Budi Santoso', 'Citra Dewi',
            'Denny Prasetyo', 'Eka Putri', 'Fajar Nugroho', 'Grace Ling',
            'Hendra Wijaya', 'Indah Permata', 'Joko Susilo', 'Kartini Rahayu',
            'Lukman Hakim', 'Maya Sari', 'Nadia Putri', 'Oscar Tan',
            'Putra Wijaya', 'Rina Susanti', 'Sandi Pratama', 'Tania Hartono',
            'Umar Farid', 'Vera Anggraeni', 'Wahyu Nugroho', 'Xena Dewi',
            'Yoga Saputra', 'Zahra Amelia', 'Bagus Setiawan', 'Dewi Lestari',
            'Fikri Rahman', 'Gita Nirmala',
        ];

        foreach ($userNames as $idx => $name) {
            $slug = Str::slug($name);
            User::firstOrCreate(
                ['email' => "{$slug}@example.com"],
                [
                    'name'              => $name,
                    'username'          => str_replace('-', '.', $slug),
                    'role'              => $idx < 4 ? 'Organizer' : 'User',
                    'status'            => $idx === 7 ? 'Banned' : ($idx === 5 || $idx === 13 ? 'Suspended' : 'Active'),
                    'password'          => Hash::make('password'),
                    'email_verified_at' => now()->subDays(rand(1, 90)),
                ]
            );
        }
    }
}
