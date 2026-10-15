<x-mail::message>
# Booking {{ ucfirst($status) }}

Hello {{ $requesterName }},

Your facility booking for **{{ $facilityName }}** ({{ $bookingSummary }}) has been **{{ $status }}**.

Please log in to view the booking details.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
