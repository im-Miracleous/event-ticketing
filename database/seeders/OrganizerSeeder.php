<?php

namespace Database\Seeders;

use App\Models\Organizer;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrganizerSeeder extends Seeder
{
    /**
     * Seed organizer records linked to Organizer-role users.
     */
    public function run(): void
    {
        $organizerUsers = User::where('role', 'Organizer')->orderBy('created_at')->get();

        foreach ($organizerUsers as $user) {
            Organizer::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'name'         => $user->name, // Same name as the User
                    'description'  => fake()->paragraph(2),
                    'logo'         => null,
                    'bank_account' => fake()->numerify('####-####-####'),
                ]
            );
        }
    }
}
