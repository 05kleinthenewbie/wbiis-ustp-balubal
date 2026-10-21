<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ServiceRequestRejected extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $requesterName,
        public int $serviceRequestId,
        public ?string $rejectionReason = null,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Service Request #'.$this->serviceRequestId.' Rejected',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.service-request-rejected',
            with: [
                'requesterName' => $this->requesterName,
                'serviceRequestId' => $this->serviceRequestId,
                'rejectionReason' => $this->rejectionReason,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
