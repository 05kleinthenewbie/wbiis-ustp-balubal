<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Account Approved — {{ $appName }}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2>Good news, {{ $name }}!</h2>
    <p>Your account at <strong>{{ $appName }}</strong> has been <strong>approved</strong> by the ICT admin team.</p>
    <p>You can now log in and submit service requests, facility bookings, and incident reports.</p>
    <p><a href="{{ $loginUrl }}" style="display: inline-block; padding: 10px 20px; background: #16a34a; color: #fff; text-decoration: none; border-radius: 6px;">Log In Now</a></p>
    <p>Thanks,<br>{{ $appName }} ICT Team</p>
</body>
</html>
