<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Verify your email address</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2>Verify your email address</h2>
    <p>Hi {{ $name }},</p>
    <p>Use the code below to finish creating your <strong>{{ $appName }}</strong> account:</p>
    <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; font-family: monospace; background: #f4f4f5; padding: 16px; text-align: center; border-radius: 8px; color: #1a1851;">{{ $code }}</p>
    <p>This code expires in {{ $expiresInMinutes }} minutes.</p>
    <p>If you didn't request this code, you can safely ignore this email — no account has been created yet.</p>
    <p>Thanks,<br>{{ $appName }} ICT Team</p>
</body>
</html>
