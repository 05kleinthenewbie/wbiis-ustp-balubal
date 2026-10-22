<?php

use App\Mail\ServiceRequestApproved;
use App\Mail\ServiceRequestRejected;
use App\Models\Role;
use App\Models\ServiceCategory;
use App\Models\ServiceRequest;
use App\Models\ServiceType;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;

function srAdmin(): User
{
    $role = Role::firstOrCreate(['role_name' => 'ict_admin']);

    return User::factory()->create(['role_id' => $role->id]);
}

function srFaculty(): User
{
    $role = Role::firstOrCreate(['role_name' => 'faculty_staff']);

    return User::factory()->create(['role_id' => $role->id]);
}

function srServiceType(): ServiceType
{
    $category = ServiceCategory::firstOrCreate(
        ['category_name' => 'Hardware'],
    );

    return ServiceType::firstOrCreate(
        ['category_id' => $category->id, 'service_name' => 'PC Repair'],
    );
}

function srPayload(User $user, ServiceType $type): array
{
    return [
        'problem_description' => 'Lab PC not booting.',
        'location' => 'Lab 1',
        'contact_details' => '09171234567',
        'services' => [
            [
                'service_type_id' => $type->id,
                'specification' => 'Check PSU',
                'quantity' => 1,
            ],
        ],
    ];
}

function srStudent(): User
{
    $role = Role::firstOrCreate(['role_name' => 'student']);

    return User::factory()->create(['role_id' => $role->id]);
}

function srInformationServices(): ServiceCategory
{
    $category = ServiceCategory::firstOrCreate(
        ['category_name' => 'Information System Services'],
    );

    foreach ([['E-mail', 'Create New'], ['Office 365', 'Create New'], ['Others', null]] as [$name, $action]) {
        ServiceType::firstOrCreate(
            ['category_id' => $category->id, 'service_name' => $name],
            ['default_action' => $action],
        );
    }

    return $category;
}

test('guests are redirected to the login page from the create form', function () {
    $this->get(route('requests.create'))->assertRedirect(route('login'));
});

test('admin can view the service request create form', function () {
    $admin = srAdmin();
    srServiceType();

    $response = $this->actingAs($admin)->get(route('requests.create'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('requests/create')
        ->has('categories', 1),
    );
});

test('admin can submit a service request', function () {
    $admin = srAdmin();
    $type = srServiceType();

    $response = $this->actingAs($admin)->post(
        route('requests.store'),
        srPayload($admin, $type),
    );

    $response->assertRedirect(route('requests.index'));
    $response->assertSessionHas('status');

    $this->assertDatabaseHas('service_requests', [
        'user_id' => $admin->id,
        'problem_description' => 'Lab PC not booting.',
        'location' => 'Lab 1',
        'request_status' => 'pending',
    ]);

    $request = ServiceRequest::query()->latest('id')->firstOrFail();
    $this->assertDatabaseHas('request_services', [
        'request_id' => $request->id,
        'service_type_id' => $type->id,
        'quantity' => 1,
    ]);
});

test('faculty can still submit a service request', function () {
    $faculty = srFaculty();
    $type = srServiceType();

    $response = $this->actingAs($faculty)->post(
        route('requests.store'),
        srPayload($faculty, $type),
    );

    $response->assertRedirect(route('requests.index'));

    $this->assertDatabaseHas('service_requests', [
        'user_id' => $faculty->id,
        'request_status' => 'pending',
    ]);
});

test('service request store validates required fields', function () {
    $admin = srAdmin();

    $response = $this->actingAs($admin)->post(route('requests.store'), [
        'problem_description' => '',
        'services' => [],
    ]);

    $response->assertSessionHasErrors([
        'problem_description',
        'services',
    ]);
    $this->assertDatabaseCount('service_requests', 0);
});

test('requests index scopes non admin users to their own requests', function () {
    $faculty = srFaculty();
    $other = srFaculty();

    ServiceRequest::create([
        'user_id' => $faculty->id,
        'problem_description' => 'Mine',
        'request_status' => 'pending',
        'date_requested' => now(),
    ]);
    ServiceRequest::create([
        'user_id' => $other->id,
        'problem_description' => 'Not mine',
        'request_status' => 'pending',
        'date_requested' => now(),
    ]);

    $response = $this->actingAs($faculty)->get(route('requests.index'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('requests/index')
        ->where('requests.data', fn ($requests) => $requests->count() === 1)
        ->where('requests.data.0.problem_description', 'Mine'),
    );
});

test('admin sees every request on the index', function () {
    $admin = srAdmin();
    $faculty = srFaculty();

    ServiceRequest::create([
        'user_id' => $faculty->id,
        'problem_description' => 'Faculty request',
        'request_status' => 'pending',
        'date_requested' => now(),
    ]);

    $response = $this->actingAs($admin)->get(route('requests.index'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('requests/index')
        ->where('requests.data', fn ($requests) => $requests->count() === 1),
    );
});

test('student create form only offers email and office 365', function () {
    $student = srStudent();
    srInformationServices();
    $network = ServiceCategory::create(['category_name' => 'Network Services']);
    ServiceType::create(['category_id' => $network->id, 'service_name' => 'Network Connection']);

    $response = $this->actingAs($student)->get(route('requests.create'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('requests/create')
        ->where('isStudent', true)
        ->has('categories', 1)
        ->where('categories.0.category_name', 'Information System Services')
        ->has('categories.0.service_types', 2)
        ->where(
            'categories.0.service_types',
            fn ($types) => $types->pluck('service_name')->sort()->values()->all() === ['E-mail', 'Office 365'],
        ),
    );
});

test('student can submit an email request', function () {
    $student = srStudent();
    srInformationServices();
    $email = ServiceType::where('service_name', 'E-mail')->firstOrFail();

    $response = $this->actingAs($student)->post(route('requests.store'), [
        'problem_description' => 'Need an account for my research class.',
        'services' => [
            ['service_type_id' => $email->id, 'quantity' => 1],
        ],
    ]);

    $response->assertRedirect(route('requests.index'));
    $response->assertSessionHas('status');

    $this->assertDatabaseHas('service_requests', [
        'user_id' => $student->id,
        'problem_description' => 'Need an account for my research class.',
        'request_status' => 'pending',
    ]);
});

test('student cannot submit requests outside email and office 365', function () {
    $student = srStudent();
    $network = ServiceCategory::create(['category_name' => 'Network Services']);
    $type = ServiceType::create(['category_id' => $network->id, 'service_name' => 'Network Connection']);

    $response = $this->actingAs($student)->post(route('requests.store'), [
        'problem_description' => 'Please fix the lab network.',
        'services' => [
            ['service_type_id' => $type->id, 'quantity' => 1],
        ],
    ]);

    $response->assertSessionHasErrors('services.0.service_type_id');
    $this->assertDatabaseCount('service_requests', 0);
});

test('faculty create form still offers every service type', function () {
    $faculty = srFaculty();
    srInformationServices();

    $response = $this->actingAs($faculty)->get(route('requests.create'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('requests/create')
        ->where('isStudent', false)
        ->has('categories', 1)
        ->has('categories.0.service_types', 3),
    );
});

test('approving a pending request creates a job order and queues the approval email', function () {
    Mail::fake();

    $admin = srAdmin();
    $student = srStudent();
    $serviceRequest = ServiceRequest::create([
        'user_id' => $student->id,
        'problem_description' => 'Please create my email account.',
        'request_status' => 'pending',
    ]);

    $this->actingAs($admin)
        ->put(route('requests.update', $serviceRequest), [
            'request_status' => 'approved',
            'priority_level' => 'medium',
        ])
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    expect($serviceRequest->fresh()->request_status)->toBe('approved');
    expect($serviceRequest->jobOrders()->count())->toBe(1);

    Mail::assertQueued(ServiceRequestApproved::class, function (ServiceRequestApproved $mail) use ($student, $serviceRequest) {
        return $mail->requesterName === $student->name
            && $mail->serviceRequestId === $serviceRequest->id;
    });
});

test('approving a pending request requires a priority level', function () {
    $admin = srAdmin();
    $student = srStudent();
    $serviceRequest = ServiceRequest::create([
        'user_id' => $student->id,
        'problem_description' => 'Please create my email account.',
        'request_status' => 'pending',
    ]);

    $this->actingAs($admin)
        ->put(route('requests.update', $serviceRequest), [
            'request_status' => 'approved',
        ])
        ->assertSessionHasErrors('priority_level');

    expect($serviceRequest->fresh()->request_status)->toBe('pending');

    $this->actingAs($admin)
        ->put(route('requests.update', $serviceRequest), [
            'request_status' => 'approved',
            'priority_level' => 'urgent',
        ])
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    expect($serviceRequest->fresh()->priority_level)->toBe('urgent');
});

test('rejecting a pending request queues the rejection email', function () {
    Mail::fake();

    $admin = srAdmin();
    $faculty = srFaculty();
    $serviceRequest = ServiceRequest::create([
        'user_id' => $faculty->id,
        'problem_description' => 'Please replace the projector.',
        'request_status' => 'pending',
    ]);

    $this->actingAs($admin)
        ->put(route('requests.update', $serviceRequest), [
            'request_status' => 'rejected',
            'rejection_reason' => 'Budget not available.',
        ])
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    Mail::assertQueued(ServiceRequestRejected::class, function (ServiceRequestRejected $mail) use ($serviceRequest) {
        return $mail->serviceRequestId === $serviceRequest->id
            && $mail->rejectionReason === 'Budget not available.';
    });
});
