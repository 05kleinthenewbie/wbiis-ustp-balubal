<?php

use App\Models\Role;
use App\Models\StudentRoster;
use App\Models\User;
use Illuminate\Support\Facades\Route;

function rosterAdmin(): User
{
    $role = Role::firstOrCreate(['role_name' => 'ict_admin']);

    return User::factory()->create(['role_id' => $role->id]);
}

test('the retired lookup endpoint does not expose rostered student details', function () {
    StudentRoster::create([
        'id_number' => '2023303709',
        'name' => 'Juan S. Dela Cruz',
        'program' => 'BSIT',
    ]);

    $this->getJson('/register/students/2023303709')
        ->assertNotFound();
});

test('the lookup endpoint returns 404 for unknown id numbers', function () {
    $this->getJson('/register/students/9999999999')
        ->assertNotFound();
});

test('students cannot access the roster page', function () {
    $role = Role::firstOrCreate(['role_name' => 'student']);
    $student = User::factory()->create(['role_id' => $role->id]);

    $this->actingAs($student)->get('/student-roster')->assertNotFound();
    $this->actingAs($student)->post('/student-roster', [
        'id_number' => '2023303709',
        'name' => 'Juan Dela Cruz',
        'program' => 'BSIT',
        'email' => 'juan.delacruz@gmail.com',
    ])->assertNotFound();
});

test('the roster page is removed for admins', function () {
    StudentRoster::create([
        'id_number' => '2023303709',
        'name' => 'Juan S. Dela Cruz',
        'program' => 'BSIT',
    ]);

    $this->actingAs(rosterAdmin())
        ->get('/student-roster')
        ->assertNotFound();
});

test('retired roster additions cannot provision accounts', function () {
    $admin = rosterAdmin();

    $this->actingAs($admin)->post('/student-roster', [
        'id_number' => '2023303709',
        'name' => 'Juan Dela Cruz',
        'program' => 'BSIT',
        'email' => 'juan.delacruz@gmail.com',
    ])->assertNotFound();

    $this->assertDatabaseMissing('student_rosters', [
        'id_number' => '2023303709',
        'name' => 'Juan Dela Cruz',
        'program' => 'BSIT',
        'email' => 'juan.delacruz@gmail.com',
    ]);

    $this->assertDatabaseMissing('users', [
        'id_number' => '2023303709',
        'status' => 'active',
    ]);
});

test('retired roster additions do not create roster entries or accounts', function () {
    $admin = rosterAdmin();

    $this->actingAs($admin)->post('/student-roster', [
        'id_number' => '2023303709',
        'name' => 'Juan Dela Cruz',
        'program' => 'BSIT',
        'email' => 'juan.delacruz@gmail.com',
    ]);

    $student = StudentRoster::where('id_number', '2023303709')->first();
    $user = User::where('id_number', '2023303709')->first();

    expect($student)->toBeNull()->and($user)->toBeNull();
});

test('retired roster additions remain inaccessible for duplicate or malformed input', function () {
    $admin = rosterAdmin();
    StudentRoster::create([
        'id_number' => '2023303709',
        'name' => 'Juan S. Dela Cruz',
        'program' => 'BSIT',
    ]);

    $this->actingAs($admin)->post('/student-roster', [
        'id_number' => '2023303709',
        'name' => 'Duplicate Student',
        'program' => 'BSA',
        'email' => 'duplicate@gmail.com',
    ])->assertNotFound();

    $this->actingAs($admin)->post('/student-roster', [
        'id_number' => '12345',
        'name' => 'Short ID',
        'program' => 'BSA',
        'email' => 'short@gmail.com',
    ])->assertNotFound();

    $this->actingAs($admin)->post('/student-roster', [
        'id_number' => '2023303712',
        'name' => 'No Email',
        'program' => 'BSA',
    ])->assertNotFound();
});

test('retired roster additions cannot modify existing accounts', function () {
    $admin = rosterAdmin();
    $role = Role::firstOrCreate(['role_name' => 'faculty_staff']);
    User::factory()->create([
        'role_id' => $role->id,
        'email' => 'taken@gmail.com',
        'id_number' => null,
    ]);

    $this->actingAs($admin)->post('/student-roster', [
        'id_number' => '2023303709',
        'name' => 'Juan Dela Cruz',
        'program' => 'BSIT',
        'email' => 'taken@gmail.com',
    ])->assertNotFound();

    expect(StudentRoster::count())->toBe(0);
});

test('retired roster deletion preserves existing student accounts and data', function () {
    $admin = rosterAdmin();

    $user = User::factory()->create(['id_number' => '2023303709', 'status' => 'active']);
    $entry = StudentRoster::create(['id_number' => '2023303709', 'name' => 'Juan S. Dela Cruz', 'program' => 'BSIT', 'user_id' => $user->id]);

    $this->actingAs($admin)
        ->delete('/student-roster/'.$entry->id)
        ->assertNotFound();

    $this->assertDatabaseHas('student_rosters', ['id_number' => '2023303709']);
    expect($user->refresh()->status)->toBe('active');
});

test('the retired CSV import cannot create student accounts', function () {
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

    $this->actingAs($admin)
        ->post('/student-roster/import', ['csv' => $csv])
        ->assertNotFound();

    $this->assertDatabaseMissing('users', ['id_number' => '2023303710']);
    $this->assertDatabaseMissing('users', ['id_number' => '2023303711']);
    expect(StudentRoster::count())->toBe(1);
});

test('student roster named routes are no longer registered', function () {
    foreach (['student-roster.index', 'student-roster.store', 'student-roster.import', 'student-roster.destroy', 'student-roster.reset-password', 'register.student.lookup'] as $name) {
        expect(Route::has($name))->toBeFalse();
    }
});

test('retired roster password resets cannot change existing passwords', function () {
    $admin = rosterAdmin();

    $student = User::factory()->create();
    $entry = StudentRoster::create(['id_number' => '2023303709', 'name' => $student->name, 'program' => 'BSIT', 'user_id' => $student->id]);
    $password = $student->password;
    $this->actingAs($admin)->post('/student-roster/'.$entry->id.'/reset-password')->assertNotFound();
    expect($student->refresh()->password)->toBe($password);
});

test('existing pending student accounts are preserved after roster removal', function () {
    $admin = rosterAdmin();
    $studentRole = Role::firstOrCreate(['role_name' => 'student']);

    $student = User::factory()->create([
        'role_id' => $studentRole->id,
        'id_number' => '2023303709',
        'status' => 'pending',
    ]);

    StudentRoster::create([
        'id_number' => '2023303709',
        'name' => 'Juan S. Dela Cruz',
        'program' => 'BSIT',
        'user_id' => $student->id,
    ]);

    $this->actingAs($admin)
        ->get('/student-roster')
        ->assertNotFound();
    expect($student->refresh()->status)->toBe('pending');
});
