<x-mail::message>
# Technician Update

Hello {{ $requesterName }},

The technician **{{ $technicianName }}** has added an update to your job order **{{ $jobOrderNumber }}**.

Please log in to view the response and check the progress of your request.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
