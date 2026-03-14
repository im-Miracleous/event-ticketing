<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Verify Your Email - EventHive</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap');
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; padding: 40px 20px; margin: 0; }
        .wrapper { max-width: 600px; margin: 0 auto; }
        .card { background: #ffffff; padding: 48px; border-radius: 24px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02); border: 1px solid #f1f5f9; }
        .logo-container { text-align: center; margin-bottom: 32px; }
        .logo { font-size: 28px; font-weight: 900; color: #0f172a; letter-spacing: -0.05em; font-style: italic; text-transform: uppercase; }
        .logo span { color: #7c3aed; }
        .header { text-align: center; margin-bottom: 32px; }
        .header h1 { font-size: 24px; font-weight: 800; color: #1e293b; margin: 0; text-transform: uppercase; letter-spacing: -0.02em; }
        .header p { color: #64748b; font-size: 16px; margin-top: 8px; }
        .otp-box { background: #f1f5f9; padding: 32px; border-radius: 20px; text-align: center; margin: 32px 0; border: 1px solid #e2e8f0; }
        .otp-code { font-size: 42px; font-weight: 800; color: #7c3aed; letter-spacing: 12px; margin: 0; }
        .divider { height: 1px; background: #f1f5f9; margin: 32px 0; }
        .footer { text-align: center; color: #94a3b8; font-size: 13px; font-weight: 500; }
        .security-note { color: #64748b; font-size: 14px; line-height: 1.5; text-align: center; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="card">
            <div class="logo-container">
                <div class="logo">EVENT<span>HIVE</span></div>
            </div>
            
            <div class="header">
                <h1>Verify Your Account</h1>
                <p>Use the secure code below to complete your sign up.</p>
            </div>

            <div class="otp-box">
                <p style="text-transform: uppercase; font-size: 12px; font-weight: 800; color: #94a3b8; letter-spacing: 0.1em; margin-bottom: 16px;">One-Time Password</p>
                <div class="otp-code">{{ $otpCode->code }}</div>
            </div>

            <div class="security-note">
                Hello <strong>{{ $user->name }}</strong>,<br>
                For your security, this code will expire in 10 minutes. 
                If you didn't attempt to register an account with us, please ignore this email.
            </div>

            <div class="divider"></div>

            <div class="footer">
                &copy; {{ date('Y') }} EventHive Platform. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>
