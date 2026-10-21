<x-mail::message>
# Service Request Approved

Hello {{ $requesterName }},

Your service request **#{{ $serviceRequestId }}** has been approved.

The ICT Office will assign a technician to work on your request. You can log in to track its progress.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
