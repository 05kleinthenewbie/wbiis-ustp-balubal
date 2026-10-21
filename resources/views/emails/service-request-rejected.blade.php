<x-mail::message>
# Service Request Rejected

Hello {{ $requesterName }},

Your service request **#{{ $serviceRequestId }}** has been rejected.

@if ($rejectionReason)
**Reason:** {{ $rejectionReason }}
@endif

If you have questions, please contact the ICT Office.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
