<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reset your password — {{ $appName }}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2>Reset your password</h2>
    <p>Hi {{ $name }},</p>
    <p>We received a request to reset the password for your <strong>{{ $appName }}</strong> account. Open the link below to choose a new one:</p>
    <p><a href="{{ $resetUrl }}" style="display: inline-block; padding: 10px 20px; background: #fcb315; color: #1a1851; font-weight: bold; text-decoration: none; border-radius: 6px;">Reset My Password</a></p>
    <p style="word-break: break-all; color: #555;">{{ $resetUrl }}</p>
    <p>This link expires in {{ $expiresInMinutes }} minutes.</p>
    <p>If you didn't request a password reset, you can safely ignore this email — your password will not change.</p>
    <p>Thanks,<br>{{ $appName }} ICT Team</p>
</body>
</html>
