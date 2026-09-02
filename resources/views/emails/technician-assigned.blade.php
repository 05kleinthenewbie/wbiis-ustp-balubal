<x-mail::message>
# Job Order Assigned

Hello {{ $technicianName }},

You have been assigned to job order **{{ $jobOrderNumber }}**.

Please log in to view the details and begin working on the request.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
