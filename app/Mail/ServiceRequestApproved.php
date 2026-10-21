<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ServiceRequestApproved extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $requesterName,
        public int $serviceRequestId,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Service Request #'.$this->serviceRequestId.' Approved',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.service-request-approved',
            with: [
                'requesterName' => $this->requesterName,
                'serviceRequestId' => $this->serviceRequestId,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
