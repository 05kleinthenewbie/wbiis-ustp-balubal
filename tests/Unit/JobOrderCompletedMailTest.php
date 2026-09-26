<?php

use App\Mail\JobOrderCompleted;
use Tests\TestCase;

uses(TestCase::class);

test('job order completed mailable has the expected subject', function () {
    $mailable = new JobOrderCompleted('Jane Doe', 9);

    expect($mailable->hasSubject('Job Order #9 Completed'))->toBeTrue();
});

test('job order completed mailable renders the completion email', function () {
    $html = (new JobOrderCompleted('Jane Doe', 9))->render();

    expect($html)
        ->toContain('Job Order Completed')
        ->toContain('Jane Doe')
        ->toContain('#9');
});
