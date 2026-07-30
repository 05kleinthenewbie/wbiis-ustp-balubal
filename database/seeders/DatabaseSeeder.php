<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RoleSeeder::class);

        $adminRole = \App\Models\Role::where('role_name', 'ict_admin')->first();

        $admin = User::firstOrCreate(
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

        if (! $admin->current_team_id) {
            app(\App\Actions\Teams\CreateTeam::class)->handle(
                $admin,
                $admin->name."'s Team",
                isPersonal: true
            );
        }
    }
}
