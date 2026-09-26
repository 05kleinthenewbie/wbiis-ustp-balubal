<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class JobOrderCompleted extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $requesterName,
        public int $jobOrderId,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Job Order #'.$this->jobOrderId.' Completed',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.job-order-completed',
            with: [
                'requesterName' => $this->requesterName,
                'jobOrderId' => $this->jobOrderId,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
