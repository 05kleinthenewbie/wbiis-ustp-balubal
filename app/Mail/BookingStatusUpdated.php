<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BookingStatusUpdated extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $requesterName,
        public string $facilityName,
        public string $bookingSummary,
        public string $status,
        public int $bookingId,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Facility Booking #'.$this->bookingId.' '.ucfirst($this->status),
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.booking-status-updated',
            with: [
                'requesterName' => $this->requesterName,
                'facilityName' => $this->facilityName,
                'bookingSummary' => $this->bookingSummary,
                'status' => $this->status,
                'bookingId' => $this->bookingId,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
