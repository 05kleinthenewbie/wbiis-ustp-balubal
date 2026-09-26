<x-mail::message>
# Job Order Completed

Hello {{ $requesterName }},

Your job order **#{{ $jobOrderId }}** has been completed.

Please log in to view the details, rate the service, and verify the job order.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
