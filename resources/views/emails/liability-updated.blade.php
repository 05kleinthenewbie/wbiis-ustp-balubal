<x-mail::message>
# Laboratory Incident Liability

Hello {{ $recipientName }},

{{ $messageText }}

@if ($description)
**Details:** {{ $description }}
@endif

@if ($amount !== null)
**Assessed amount:** PHP {{ number_format((float) $amount, 2) }}
@endif

<x-mail::button :url="route('liabilities.index', ['liability' => $liabilityId])">
View My Liability
</x-mail::button>

Sign in to review the record and acknowledge the assignment. Acknowledgment confirms receipt only; settlement or waiver must be recorded by the ICT Administrator.

{{ config('app.name') }}
</x-mail::message>
