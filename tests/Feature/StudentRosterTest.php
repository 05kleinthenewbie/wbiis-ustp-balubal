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
        'email' => 'juan.delacruz@gmail.com',
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
            ->where('students.0.account_status', 'no_account')
            ->where('students.0.registered_user_id', null));
});

test('admins can add a student to the roster and provision an account', function () {
    $admin = rosterAdmin();

    $this->actingAs($admin)->post(route('student-roster.store'), [
        'id_number' => '2023303709',
        'name' => 'Juan Dela Cruz',
        'program' => 'BSIT',
        'email' => 'juan.delacruz@gmail.com',
    ])->assertRedirect()->assertSessionHas('student_credentials');

    $this->assertDatabaseHas('student_rosters', [
        'id_number' => '2023303709',
        'name' => 'Juan Dela Cruz',
        'program' => 'BSIT',
        'email' => 'juan.delacruz@gmail.com',
    ]);

    $this->assertDatabaseHas('users', [
        'id_number' => '2023303709',
        'status' => 'active',
    ]);
});

test('the roster addition and account provisioning share a transaction', function () {
    $admin = rosterAdmin();

    $this->actingAs($admin)->post(route('student-roster.store'), [
        'id_number' => '2023303709',
        'name' => 'Juan Dela Cruz',
        'program' => 'BSIT',
        'email' => 'juan.delacruz@gmail.com',
    ]);

    $student = StudentRoster::where('id_number', '2023303709')->first();
    $user = User::where('id_number', '2023303709')->first();

    expect($student->user_id)->toBe($user->id);
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
        'email' => 'duplicate@gmail.com',
    ])->assertSessionHasErrors('id_number');

    $this->actingAs($admin)->post(route('student-roster.store'), [
        'id_number' => '12345',
        'name' => 'Short ID',
        'program' => 'BSA',
        'email' => 'short@gmail.com',
    ])->assertSessionHasErrors('id_number');

    $this->actingAs($admin)->post(route('student-roster.store'), [
        'id_number' => '2023303712',
        'name' => 'No Email',
        'program' => 'BSA',
    ])->assertSessionHasErrors('email');
});

test('roster additions reject emails that already belong to another account', function () {
    $admin = rosterAdmin();
    $role = Role::firstOrCreate(['role_name' => 'faculty_staff']);
    User::factory()->create([
        'role_id' => $role->id,
        'email' => 'taken@gmail.com',
        'id_number' => null,
    ]);

    $this->actingAs($admin)->post(route('student-roster.store'), [
        'id_number' => '2023303709',
        'name' => 'Juan Dela Cruz',
        'program' => 'BSIT',
        'email' => 'taken@gmail.com',
    ])->assertSessionHasErrors('email');

    expect(StudentRoster::count())->toBe(0);
});

test('admins can remove a student from the roster and disable their account', function () {
    $admin = rosterAdmin();

    $this->actingAs($admin)->post(route('student-roster.store'), [
        'id_number' => '2023303709',
        'name' => 'Juan S. Dela Cruz',
        'program' => 'BSIT',
        'email' => 'juan.delacruz@gmail.com',
    ]);

    $entry = StudentRoster::where('id_number', '2023303709')->firstOrFail();
    $user = User::where('id_number', '2023303709')->firstOrFail();

    $this->actingAs($admin)
        ->delete(route('student-roster.destroy', $entry))
        ->assertRedirect();

    $this->assertDatabaseMissing('student_rosters', ['id_number' => '2023303709']);
    expect($user->refresh()->status)->toBe('inactive');
});

test('admins can bulk import students from a csv', function () {
    $admin = rosterAdmin();
    StudentRoster::create([
        'id_number' => '2023303709',
        'name' => 'Existing Student',
        'program' => 'BSIT',
    ]);

    $csv = implode("\n", [
        'id_number,name,program,email',
        '2023303710,New Student One,BSA,one@gmail.com',
        '2023303711,New Student Two,BTLED,two@gmail.com',
        '2023303709,Duplicate Entry,BSIT,duplicate@gmail.com',
        'invalid,Missing Program Check,XYZ,bad@gmail.com',
    ]);

    $file = UploadedFile::fake()->createWithContent('roster.csv', $csv);

    $this->actingAs($admin)
        ->post(route('student-roster.import'), ['csv_file' => $file])
        ->assertRedirect()
        ->assertSessionHas('status');

    $this->assertDatabaseHas('student_rosters', ['id_number' => '2023303710', 'program' => 'BSA', 'email' => 'one@gmail.com']);
    $this->assertDatabaseHas('student_rosters', ['id_number' => '2023303711', 'program' => 'BTLED', 'email' => 'two@gmail.com']);
    $this->assertDatabaseHas('users', ['id_number' => '2023303710', 'email' => 'one@gmail.com']);
    $this->assertDatabaseHas('users', ['id_number' => '2023303711', 'email' => 'two@gmail.com']);
    expect(StudentRoster::count())->toBe(3)
        ->and(User::whereIn('id_number', ['2023303710', '2023303711'])->count())->toBe(2);
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

test('roster entries show the provisioned account status', function () {
    $admin = rosterAdmin();

    $this->actingAs($admin)->post(route('student-roster.store'), [
        'id_number' => '2023303709',
        'name' => 'Juan S. Dela Cruz',
        'program' => 'BSIT',
        'email' => 'juan.delacruz@gmail.com',
    ]);

    $this->actingAs($admin)
        ->get(route('student-roster.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('student-roster/index')
            ->where('students.0.registered_user_id', fn ($id) => $id !== null)
            ->where('students.0.account_status', 'active'));
});
