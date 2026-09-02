<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TechnicianAssigned extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $technicianName,
        public string $jobOrderNumber,
        public int $jobOrderId,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Job Order #'.$this->jobOrderNumber.' Assigned to You',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.technician-assigned',
            with: [
                'technicianName' => $this->technicianName,
                'jobOrderNumber' => $this->jobOrderNumber,
                'jobOrderId' => $this->jobOrderId,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
