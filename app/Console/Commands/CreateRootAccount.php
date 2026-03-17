<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CreateRootAccount extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:root';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Creates/Updates a Root account.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('====================================');
        $this->info('         ROOT ACCOUNT SETUP         ');
        $this->info('====================================');

        // Check if Root account already exists
        $existingRootCount = User::where('role', 'Root')->count();

        if ($existingRootCount > 0) {
            $this->warn('Root account already exists: '. $existingRootCount .'.');
            
            // Ask for login credentials
            if (!$this->authenticateRoot()) {
                $this->error('Authentication failed. You are not allowed to access this feature.');
                return 1;
            }

            $choice = $this->choice('What do you want to do?', [
                'Update existing Root account',
                'Create a new Root account',
                'Cancel'
            ], 0);

            if ($choice === 'Cancel') return 0;

            if ($choice === 'Update existing Root account') {
                return $this->updateExistingRoot();
            }
        }

        // If there is no Root OR user choose to create a new Root account
        return $this->createNewRoot();

    }

    /**
     * Logics to verify existing Root account.
     */
    private function authenticateRoot()
    {
        $this->info("\nPlease verify your Root account:");
        $identifier = $this->ask('Email or Username');
        $password   = $this->secret('Password');
        $user = User::where('role', 'Root')
                    ->where(function($q) use ($identifier) {
                        $q->where('email', $identifier)->orWhere('username', $identifier);
                    })->first();
        if ($user && Hash::check($password, $user->password)) {
            $this->info("Authentication Success. Hello, {$user->name}!");
            return true;
        }
        return false;
    }

     /**
     * Logics to create new Root account.
     */
    private function createNewRoot()
    {
        $this->info("\n--- Creating New Root Account ---");
        // 1. Data input
        $name = $this->ask('Full Name');
        $username = $this->ask('Username');
        $email = $this->ask('Email Address');
        $password = $this->secret('Password');
        $confirm = $this->secret('Password Confirmation');

        // 2. Password Match Validation
        if ($password !== $confirm) {
            $this->error('Passwords do not match!');
            return 1;
        }

        // 3. Unique Data Validation
        $validator = Validator::make([
            'username' => $username,
            'email' => $email,
            'password' => $password,
        ], [
            'username' => 'unique:users,username',
            'email' => 'email|unique:users,email',
            'password' => 'min:8',
        ]);

        if ($validator->fails()) {
            $this->error('Failed: Email/Username already exists or Password is too short.');
            foreach ($validator->errors()->all() as $error) {
                $this->line("- $error");
            }
            return 1;
        }

        // 4. Save to Database
        try {
            $user = User::create([
                'id' => (string) Str::uuid(),
                'name' => $name,
                'username' => $username,
                'email' => $email,
                'password' => $password,
                'role' => 'Root',
                'email_verified_at' => now(),
            ]);

            $this->info("-----------------------------------------");
            $this->info("SUCCESS! Root account has been created.");
            $this->info("Email: {$user->email}");
            $this->info("Role : {$user->role}");
            $this->info("-----------------------------------------");
        } catch (\Exception $e) {
            $this->error("Failed to create root account: " . $e->getMessage());
        }

        return 0;
    }

    /**
     * Logics to update existing Root account.
     */
    private function updateExistingRoot()
    {
        $email = $this->ask('Enter the email of the Root account you want to update');
        $user  = User::where('email', $email)->where('role', 'Root')->first();
        if (!$user) {
            $this->error('User not found!');
            return 1;
        }
        $this->info("Updating: {$user->name} ({$user->username})");
        
        $newName     = $this->ask('New Name (leave empty if you don\'t want to change)', $user->name);
        $newPassword = $this->secret('New Password (leave empty if you don\'t want to change)');
        $user->name = $newName;
        if ($newPassword) {
            $user->password = $newPassword; // Automatically hashed by model
        }
        
        $user->save();
        $this->info('Success! Root account has been updated.');
        return 0;
    }
}
