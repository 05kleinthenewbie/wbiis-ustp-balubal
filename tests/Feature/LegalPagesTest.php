<?php

use Inertia\Testing\AssertableInertia as Assert;

test('the terms of service page can be rendered', function () {
    $this->get(route('terms'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('terms'));
});

test('the privacy policy page can be rendered', function () {
    $this->get(route('privacy'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('privacy-policy'));
});
