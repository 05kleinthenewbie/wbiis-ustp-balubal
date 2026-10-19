<?php

use App\Models\Role;
use App\Models\User;

test('guests are redirected to the login page', function () {
    User::factory()->create();

    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $role = Role::firstOrCreate(['role_name' => 'faculty_staff']);
    $user = User::factory()->create(['role_id' => $role->id]);

    $response = $this
        ->actingAs($user)
        ->get(route('dashboard'));

    $response->assertOk();
});
