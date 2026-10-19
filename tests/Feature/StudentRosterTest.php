<?php

use App\Models\Role;
use App\Models\StudentRoster;
use App\Models\User;
use Illuminate\Http\UploadedFile;

function rosterAdmin(): User
{
    $role = Role::firstOrCreate(['role_name' => 'ict_admin']);

    return User::factory()->create(['role_id' => $role->id]);
}

test('the lookup endpoint returns rostered student details', function () {
    StudentRoster::create([
        'id_number' => '2023303709',
        'name' => 'Juan S. Dela Cruz',
        'program' => 'BSIT',
    ]);

    $this->getJson('/register/students/2023303709')
        ->assertOk()
        ->assertJson(['found' => true, 'name' => 'Juan S. Dela Cruz', 'program' => 'BSIT']);
});

test('the lookup endpoint returns 404 for unknown id numbers', function () {
    $this->getJson('/register/students/9999999999')
        ->assertNotFound()
        ->assertJson(['found' => false]);
});

test('students cannot access the roster page', function () {
    $role = Role::firstOrCreate(['role_name' => 'student']);
    $student = User::factory()->create(['role_id' => $role->id]);

    $this->actingAs($student)->get(route('student-roster.index'))->assertForbidden();
    $this->actingAs($student)->post(route('student-roster.store'), [
        'id_number' => '2023303709',
        'name' => 'Juan Dela Cruz',
        'program' => 'BSIT',
    ])->assertForbidden();
});

test('admins can view the roster page', function () {
    StudentRoster::create([
        'id_number' => '2023303709',
        'name' => 'Juan S. Dela Cruz',
        'program' => 'BSIT',
    ]);

    $this->actingAs(rosterAdmin())
        ->get(route('student-roster.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('student-roster/index')
            ->has('students', 1)
            ->where('students.0.id_number', '2023303709')
            ->where('students.0.registered_user_id', null));
});

test('admins can add a student to the roster', function () {
    $admin = rosterAdmin();

    $this->actingAs($admin)->post(route('student-roster.store'), [
        'id_number' => '2023303709',
        'name' => 'Juan Dela Cruz',
        'program' => 'BSIT',
    ])->assertRedirect();

    $this->assertDatabaseHas('student_rosters', [
        'id_number' => '2023303709',
        'name' => 'Juan Dela Cruz',
        'program' => 'BSIT',
    ]);
});

test('roster additions require a unique valid id number', function () {
    $admin = rosterAdmin();
    StudentRoster::create([
        'id_number' => '2023303709',
        'name' => 'Juan S. Dela Cruz',
        'program' => 'BSIT',
    ]);

    $this->actingAs($admin)->post(route('student-roster.store'), [
        'id_number' => '2023303709',
        'name' => 'Duplicate Student',
        'program' => 'BSA',
    ])->assertSessionHasErrors('id_number');

    $this->actingAs($admin)->post(route('student-roster.store'), [
        'id_number' => '12345',
        'name' => 'Short ID',
        'program' => 'BSA',
    ])->assertSessionHasErrors('id_number');
});

test('admins can remove a student from the roster', function () {
    $admin = rosterAdmin();
    $entry = StudentRoster::create([
        'id_number' => '2023303709',
        'name' => 'Juan S. Dela Cruz',
        'program' => 'BSIT',
    ]);

    $this->actingAs($admin)
        ->delete(route('student-roster.destroy', $entry))
        ->assertRedirect();

    $this->assertDatabaseMissing('student_rosters', ['id_number' => '2023303709']);
});

test('admins can bulk import students from a csv', function () {
    $admin = rosterAdmin();
    StudentRoster::create([
        'id_number' => '2023303709',
        'name' => 'Existing Student',
        'program' => 'BSIT',
    ]);

    $csv = implode("\n", [
        'id_number,name,program',
        '2023303710,New Student One,BSA',
        '2023303711,New Student Two,BTLED',
        '2023303709,Duplicate Entry,BSIT',
        'invalid,Missing Program Check,XYZ',
    ]);

    $file = UploadedFile::fake()->createWithContent('roster.csv', $csv);

    $this->actingAs($admin)
        ->post(route('student-roster.import'), ['csv_file' => $file])
        ->assertRedirect()
        ->assertSessionHas('status');

    $this->assertDatabaseHas('student_rosters', ['id_number' => '2023303710', 'program' => 'BSA']);
    $this->assertDatabaseHas('student_rosters', ['id_number' => '2023303711', 'program' => 'BTLED']);
    expect(StudentRoster::count())->toBe(3);
});

test('csv imports require the expected header columns', function () {
    $admin = rosterAdmin();
    $file = UploadedFile::fake()->createWithContent(
        'roster.csv',
        "student_id,fullname\n2023303709,Juan Dela Cruz",
    );

    $this->actingAs($admin)
        ->post(route('student-roster.import'), ['csv_file' => $file])
        ->assertSessionHasErrors('csv_file');

    expect(StudentRoster::count())->toBe(0);
});

test('registered roster entries are flagged as registered', function () {
    $admin = rosterAdmin();
    $roster = StudentRoster::create([
        'id_number' => '2023303709',
        'name' => 'Juan S. Dela Cruz',
        'program' => 'BSIT',
    ]);
    User::factory()->create([
        'role_id' => Role::firstOrCreate(['role_name' => 'student'])->id,
        'id_number' => $roster->id_number,
        'status' => 'active',
    ]);

    $this->actingAs($admin)
        ->get(route('student-roster.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('student-roster/index')
            ->where('students.0.registered_user_id', fn ($id) => $id !== null));
});
