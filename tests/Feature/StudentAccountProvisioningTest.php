<?php

use App\Models\Role;
use App\Models\StudentRoster;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;

function studentAccountAdmin(): User
{
    $role = Role::firstOrCreate(['role_name' => 'ict_admin']);

    return User::factory()->create(['role_id' => $role->id]);
}

function studentAccountFaculty(): User
{
    $role = Role::firstOrCreate(['role_name' => 'faculty_staff']);

    return User::factory()->create(['role_id' => $role->id]);
}

/**
 * @return array<string, string>
 */
function studentRosterPayload(array $overrides = []): array
{
    return array_merge([
        'id_number' => '2023303709',
        'name' => 'Juan S. Dela Cruz',
        'program' => 'BSIT',
        'email' => 'juan.delacruz@gmail.com',
    ], $overrides);
}

test('adding a student creates a linked, active student account that signs in with the id number', function () {
    $admin = studentAccountAdmin();

    $this->actingAs($admin)
        ->post(route('student-roster.store'), studentRosterPayload())
        ->assertRedirect()
        ->assertSessionHas('status')
        ->assertSessionHas('student_credentials');

    $user = User::where('id_number', '2023303709')->firstOrFail();
    $student = StudentRoster::where('id_number', '2023303709')->firstOrFail();

    $credentials = session('student_credentials');
    $plainPassword = $credentials[0]['password'];

    expect($user->role->role_name)->toBe('student')
        ->and($user->status)->toBe('active')
        ->and($user->email)->toBe('juan.delacruz@gmail.com')
        ->and($user->name)->toBe('Juan S. Dela Cruz')
        ->and($user->department)->toBe('BSIT')
        ->and($student->user_id)->toBe($user->id)
        ->and($credentials[0]['id_number'])->toBe('2023303709')
        ->and($plainPassword)->toBe('2023303709')
        ->and($user->password)->not->toBe($plainPassword)
        ->and(Hash::check('2023303709', $user->password))->toBeTrue();
});

test('guests can open the dedicated student login form', function () {
    $this->get(route('student.login'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('auth/student-login'));
});

test('students log in with their id number as username and password and land on the dashboard', function () {
    $role = Role::firstOrCreate(['role_name' => 'student']);
    $user = User::factory()->create([
        'role_id' => $role->id,
        'id_number' => '2023303709',
        'password' => '2023303709',
        'status' => 'active',
    ]);

    $this->post(route('student.authenticate'), [
        'id_number' => '2023303709',
        'password' => '2023303709',
    ])->assertRedirect(route('dashboard'));

    $this->assertAuthenticatedAs($user);

    $this->get(route('dashboard'))->assertOk();
});

test('the student login form rejects credentials that do not match', function () {
    $role = Role::firstOrCreate(['role_name' => 'student']);
    User::factory()->create([
        'role_id' => $role->id,
        'id_number' => '2023303709',
        'password' => '2023303709',
        'status' => 'active',
    ]);

    $this->post(route('student.authenticate'), [
        'id_number' => '2023303709',
        'password' => 'WrongPassword1',
    ])->assertSessionHasErrors('id_number');

    $this->assertGuest();
});

test('the student login form only accepts student accounts', function () {
    $role = Role::firstOrCreate(['role_name' => 'faculty_staff']);
    User::factory()->create([
        'role_id' => $role->id,
        'id_number' => '2023303709',
        'password' => '2023303709',
        'status' => 'active',
    ]);

    $this->post(route('student.authenticate'), [
        'id_number' => '2023303709',
        'password' => '2023303709',
    ])->assertSessionHasErrors('id_number');

    $this->assertGuest();
});

test('the student login form blocks deactivated accounts', function () {
    $role = Role::firstOrCreate(['role_name' => 'student']);
    User::factory()->create([
        'role_id' => $role->id,
        'id_number' => '2023303709',
        'password' => '2023303709',
        'status' => 'inactive',
    ]);

    $this->post(route('student.authenticate'), [
        'id_number' => '2023303709',
        'password' => '2023303709',
    ])->assertSessionHasErrors('id_number');

    $this->assertGuest();
});

test('admins can reset a student password back to their id number', function () {
    $admin = studentAccountAdmin();

    $this->actingAs($admin)->post(route('student-roster.store'), studentRosterPayload());

    $student = StudentRoster::where('id_number', '2023303709')->firstOrFail();
    $user = User::where('id_number', '2023303709')->firstOrFail();

    $this->actingAs($admin)
        ->post(route('student-roster.reset-password', $student))
        ->assertRedirect()
        ->assertSessionHas('student_credentials');

    $newPassword = session('student_credentials')[0]['password'];
    $user->refresh();

    expect($newPassword)->toBe('2023303709')
        ->and(Hash::check('2023303709', $user->password))->toBeTrue();

    $this->post(route('logout'));

    $this->post(route('student.authenticate'), [
        'id_number' => '2023303709',
        'password' => '2023303709',
    ])->assertRedirect(route('dashboard'));
});

test('non admins cannot reset student passwords', function () {
    $student = StudentRoster::create(studentRosterPayload());
    $faculty = studentAccountFaculty();

    $this->actingAs($faculty)
        ->post(route('student-roster.reset-password', $student))
        ->assertForbidden();
});

test('duplicate student accounts are prevented for the same id number', function () {
    $admin = studentAccountAdmin();

    $this->actingAs($admin)->post(route('student-roster.store'), studentRosterPayload());
    $this->actingAs($admin)
        ->post(route('student-roster.store'), studentRosterPayload(['name' => 'Duplicate']))
        ->assertSessionHasErrors('id_number');

    expect(User::where('id_number', '2023303709')->count())->toBe(1)
        ->and(StudentRoster::where('id_number', '2023303709')->count())->toBe(1);
});

test('importing students provisions an account for every imported row', function () {
    $admin = studentAccountAdmin();

    $csv = implode("\n", [
        'id_number,name,program,email',
        '2023303710,New Student One,BSA,one@gmail.com',
        '2023303711,New Student Two,BTLED,two@gmail.com',
        'invalid,Missing Program Check,XYZ,bad@gmail.com',
    ]);

    $this->actingAs($admin)->post(route('student-roster.import'), [
        'csv_file' => UploadedFile::fake()->createWithContent('roster.csv', $csv),
    ])->assertRedirect()->assertSessionHas('student_credentials');

    expect(User::whereIn('id_number', ['2023303710', '2023303711'])->count())->toBe(2)
        ->and(User::where('id_number', '2023303710')->first()->role->role_name)->toBe('student')
        ->and(User::where('id_number', '2023303710')->first()->email)->toBe('one@gmail.com')
        ->and(session('student_credentials'))->toHaveCount(2);
});

test('removed students can be re-added and keep the id number as their password', function () {
    $admin = studentAccountAdmin();

    $this->actingAs($admin)->post(route('student-roster.store'), studentRosterPayload());
    $firstPassword = session('student_credentials')[0]['password'];

    $student = StudentRoster::where('id_number', '2023303709')->firstOrFail();
    $this->actingAs($admin)->delete(route('student-roster.destroy', $student));

    $this->actingAs($admin)->post(route('student-roster.store'), studentRosterPayload());
    $secondPassword = session('student_credentials')[0]['password'];

    $user = User::where('id_number', '2023303709')->firstOrFail();

    expect(User::where('id_number', '2023303709')->count())->toBe(1)
        ->and($user->status)->toBe('active')
        ->and($firstPassword)->toBe('2023303709')
        ->and($secondPassword)->toBe('2023303709')
        ->and(Hash::check($secondPassword, $user->password))->toBeTrue();
});

test('students can authenticate through the api with their id number', function () {
    $role = Role::firstOrCreate(['role_name' => 'student']);
    User::factory()->create([
        'role_id' => $role->id,
        'id_number' => '2023303709',
        'password' => 'TempPass1234',
        'status' => 'active',
    ]);

    $this->postJson('/api/v1/auth/login', [
        'email' => '2023303709',
        'password' => 'TempPass1234',
    ])->assertOk()->assertJsonStructure(['access_token', 'token_type', 'user']);
});
