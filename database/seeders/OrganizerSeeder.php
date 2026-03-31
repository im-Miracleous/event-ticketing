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
        $organizerNames = [
            'PT Inovasi Digital', 'SoundWave Events', 'RunID Sports',
            'Kreasi Seni ID', 'Kuliner Nusantara',
        ];

        $organizerUsers = User::where('role', 'Organizer')->orderBy('created_at')->get();

        foreach ($organizerNames as $i => $name) {
            $userId = $i < $organizerUsers->count()
                ? $organizerUsers[$i]->id
                : ($organizerUsers->first()?->id ?? User::where('role', 'Organizer')->inRandomOrder()->first()?->id);

            Organizer::firstOrCreate(
                ['name' => $name],
                [
                    'description'  => fake()->paragraph(2),
                    'logo'         => null,
                    'bank_account' => fake()->numerify('####-####-####'),
                    'user_id'      => $userId,
                ]
            );
        }
    }
}
