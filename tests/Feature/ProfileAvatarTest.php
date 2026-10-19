<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * A real 1x1 PNG so the image validation rules pass without GD installed.
 */
function profileAvatarPng(): string
{
    return base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==');
}

test('guests cannot upload a profile photo', function () {
    $response = $this->patch(route('profile.avatar.update'), [
        'avatar' => UploadedFile::fake()->createWithContent('avatar.png', profileAvatarPng()),
    ]);

    $response->assertRedirect(route('login'));
});

test('users can upload a profile photo', function () {
    Storage::fake('public');
    $user = User::factory()->create();

    $response = $this->actingAs($user)->patch(route('profile.avatar.update'), [
        'avatar' => UploadedFile::fake()->createWithContent('avatar.png', profileAvatarPng()),
    ]);

    $response->assertRedirect(route('profile.edit'));

    $path = $user->refresh()->getRawOriginal('avatar');

    expect($path)->toStartWith('avatars/')
        ->and($user->avatar)->toEndWith($path);

    Storage::disk('public')->assertExists($path);
});

test('profile photos must be valid images', function () {
    Storage::fake('public');
    $user = User::factory()->create();

    $response = $this->actingAs($user)->patch(route('profile.avatar.update'), [
        'avatar' => UploadedFile::fake()->createWithContent('notes.txt', 'not an image'),
    ]);

    $response->assertSessionHasErrors('avatar');

    expect($user->refresh()->getRawOriginal('avatar'))->toBeNull()
        ->and(Storage::disk('public')->allFiles('avatars'))->toBe([]);
});

test('profile photos must be 2 MB or smaller', function () {
    Storage::fake('public');
    $user = User::factory()->create();

    $oversized = profileAvatarPng().str_repeat('a', 3 * 1024 * 1024);

    $response = $this->actingAs($user)->patch(route('profile.avatar.update'), [
        'avatar' => UploadedFile::fake()->createWithContent('avatar.png', $oversized),
    ]);

    $response->assertSessionHasErrors('avatar');

    expect($user->refresh()->getRawOriginal('avatar'))->toBeNull()
        ->and(Storage::disk('public')->allFiles('avatars'))->toBe([]);
});

test('uploading a new photo replaces the previous file', function () {
    Storage::fake('public');
    $user = User::factory()->create();

    $this->actingAs($user)->patch(route('profile.avatar.update'), [
        'avatar' => UploadedFile::fake()->createWithContent('first.png', profileAvatarPng()),
    ]);

    $oldPath = $user->refresh()->getRawOriginal('avatar');

    $this->actingAs($user)->patch(route('profile.avatar.update'), [
        'avatar' => UploadedFile::fake()->createWithContent('second.png', profileAvatarPng()),
    ]);

    $newPath = $user->refresh()->getRawOriginal('avatar');

    expect($newPath)->not->toBe($oldPath);

    Storage::disk('public')->assertMissing($oldPath)
        ->assertExists($newPath);
});

test('users can remove their profile photo', function () {
    Storage::fake('public');
    $user = User::factory()->create();

    $this->actingAs($user)->patch(route('profile.avatar.update'), [
        'avatar' => UploadedFile::fake()->createWithContent('avatar.png', profileAvatarPng()),
    ]);

    expect($user->refresh()->getRawOriginal('avatar'))->not->toBeNull();

    $response = $this->actingAs($user)->delete(route('profile.avatar.destroy'));

    $response->assertRedirect(route('profile.edit'));

    expect($user->refresh()->getRawOriginal('avatar'))->toBeNull()
        ->and(Storage::disk('public')->allFiles('avatars'))->toBe([]);
});

test('removing a photo when none exists still succeeds', function () {
    Storage::fake('public');
    $user = User::factory()->create();

    $response = $this->actingAs($user)->delete(route('profile.avatar.destroy'));

    $response->assertRedirect(route('profile.edit'));

    expect($user->refresh()->getRawOriginal('avatar'))->toBeNull();
});
