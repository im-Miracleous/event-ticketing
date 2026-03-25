<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class EventCategoryFactory extends Factory
{
    protected $model = \App\Models\EventCategory::class;

    public function definition(): array
    {
        return [
            'name'        => fake()->unique()->word(),
            'description' => fake()->sentence(6),
        ];
    }
}
