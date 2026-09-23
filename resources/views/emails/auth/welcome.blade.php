<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Welcome to {{ $appName }}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2>Welcome, {{ $name }}!</h2>
    <p>Thank you for registering at <strong>{{ $appName }}</strong>.</p>
    @if ($isApproved)
        <p>Your account is <strong>approved and ready</strong> — you can log in right away.</p>
        <p><strong>What can you do now?</strong></p>
        <ol>
            <li>Log in to your account.</li>
            <li>Submit service requests, facility bookings, and incident reports.</li>
        </ol>
    @else
        <p>Your account is currently <strong>pending approval</strong>. Our ICT admin team will review it shortly.</p>
        <p><strong>What's next?</strong></p>
        <ol>
            <li>Wait for admin approval of your account.</li>
            <li>Once approved, log in and submit service requests, bookings, and incident reports.</li>
        </ol>
    @endif
    <p><a href="{{ $loginUrl }}" style="display: inline-block; padding: 10px 20px; background: #4f46e5; color: #fff; text-decoration: none; border-radius: 6px;">Go to Login</a></p>
    <p>Thanks,<br>{{ $appName }} ICT Team</p>
</body>
</html>
