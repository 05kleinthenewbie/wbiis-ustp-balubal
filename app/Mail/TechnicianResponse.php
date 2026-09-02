<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TechnicianResponse extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $requesterName,
        public string $jobOrderNumber,
        public int $jobOrderId,
        public string $technicianName,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Technician Update on Job Order #'.$this->jobOrderNumber,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.technician-response',
            with: [
                'requesterName' => $this->requesterName,
                'jobOrderNumber' => $this->jobOrderNumber,
                'jobOrderId' => $this->jobOrderId,
                'technicianName' => $this->technicianName,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
