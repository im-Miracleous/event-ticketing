<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;

class CreateUserCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:create';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new user with a specific role via terminal prompts';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $name = $this->ask('Full name: ');
        $username = $this->ask('Username: ');
        $email = $this->ask('Email: ');
        
        $password = $this->secret('Password: ');
        
        $role = $this->choice(
            'Role: ',
            ['Root', 'Admin', 'Organizer', 'User'],
            'User' // Default value
        );

        // Validation
        $validator = Validator::make([
            'name' => $name,
            'username' => $username,
            'email' => $email,
            'password' => $password,
            'role' => $role,
        ], [
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', 'unique:users'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', 'string', Rule::in(['Root', 'Admin', 'Organizer', 'User'])],
        ]);

        if ($validator->fails()) {
            $this->error('User creation failed due to validation errors:');
            foreach ($validator->errors()->all() as $error) {
                $this->error("- $error");
            }
            return self::FAILURE;
        }

        $user = User::create([
            'name' => $name,
            'username' => $username,
            'email' => $email,
            'password' => Hash::make($password),
            'role' => $role,
            'email_verified_at' => now(), // Auto-verify accounts made via terminal
        ]);

        $this->info("Successfully created $role account for {$user->email}!");
        return self::SUCCESS;
    }
}
