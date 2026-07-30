<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RoleSeeder::class);

        $adminRole = \App\Models\Role::where('role_name', 'ict_admin')->first();

        User::firstOrCreate(
            ['email' => 'admin@ustp.edu.ph'],
            [
                'name' => 'ICT Administrator',
                'password' => bcrypt('password123'),
                'role_id' => $adminRole->id,
                'department' => 'ICT Office',
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
    }
}
