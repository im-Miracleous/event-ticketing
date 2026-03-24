<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class OrganizerFactory extends Factory
{
    protected $model = \App\Models\Organizer::class;

    public function definition(): array
    {
        return [
            'name'         => fake()->company(),
            'description'  => fake()->paragraph(2),
            'logo'         => null,
            'bank_account' => fake()->bankAccountNumber(),
            'user_id'      => \App\Models\User::factory(),
        ];
    }
}
