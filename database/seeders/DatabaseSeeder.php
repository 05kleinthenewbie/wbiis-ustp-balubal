<?php

namespace Database\Seeders;

use App\Actions\Teams\CreateTeam;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RoleSeeder::class);

        $adminRole = Role::where('role_name', 'ict_admin')->first();

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
            app(CreateTeam::class)->handle(
                $admin,
                $admin->name."'s Team",
                isPersonal: true
            );
        }

        $facultyRole = Role::where('role_name', 'faculty_staff')->first();

        $faculty = User::firstOrCreate(
            ['email' => 'faculty@ustp.edu.ph'],
            [
                'name' => 'Prof. Maria Santos',
                'password' => bcrypt('password123'),
                'role_id' => $facultyRole->id,
                'department' => 'College of Engineering',
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );

        if (! $faculty->current_team_id) {
            app(CreateTeam::class)->handle(
                $faculty,
                $faculty->name."'s Team",
                isPersonal: true
            );
        }

        $this->call(ServiceCategorySeeder::class);
        $this->call(ServiceTypeSeeder::class);
        $this->call(FacilitySeeder::class);
        $this->call(InventoryItemSeeder::class);
    }
}
