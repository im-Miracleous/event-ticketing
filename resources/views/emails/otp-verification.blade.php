<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify your EventHive email</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #F3F4F6; }
        .wrapper { max-width: 560px; margin: 40px auto; padding: 20px; }
        .card { background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #4C1D95 0%, #7C3AED 100%); padding: 40px 40px 32px; text-align: center; }
        .logo { display: inline-flex; align-items: center; gap: 10px; margin-bottom: 20px; }
        .logo-icon { width: 40px; height: 40px; background: rgba(255,255,255,0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
        .logo-text { font-size: 22px; font-weight: 800; color: #fff; letter-spacing: -0.5px; }
        .logo-accent { color: #C4B5FD; }
        .header h1 { color: #fff; font-size: 24px; font-weight: 700; margin-bottom: 8px; }
        .header p { color: rgba(255,255,255,0.75); font-size: 14px; line-height: 1.6; }
        .body { padding: 36px 40px; }
        .greeting { font-size: 16px; color: #374151; margin-bottom: 8px; }
        .desc { font-size: 14px; color: #6B7280; line-height: 1.7; margin-bottom: 28px; }
        .otp-wrapper { text-align: center; margin: 0 0 28px; }
        .otp-label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #9CA3AF; margin-bottom: 12px; }
        .otp-code { display: inline-flex; gap: 8px; }
        .otp-digit { width: 52px; height: 60px; background: #F5F3FF; border: 2px solid #DDD6FE; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 800; color: #7C3AED; }
        .otp-divider { align-self: center; font-size: 24px; color: #D1D5DB; padding: 0 4px; }
        .expiry-notice { text-align: center; background: #FFF7ED; border: 1px solid #FED7AA; border-radius: 10px; padding: 12px 16px; margin-bottom: 28px; }
        .expiry-notice p { font-size: 13px; color: #92400E; }
        .expiry-notice strong { color: #B45309; }
        .divider { border: none; border-top: 1px solid #F3F4F6; margin: 28px 0; }
        .footer { padding: 20px 40px 32px; text-align: center; background: #FAFAFA; }
        .footer p { font-size: 12px; color: #9CA3AF; line-height: 1.6; }
        .footer a { color: #7C3AED; text-decoration: none; font-weight: 500; }
        .not-you { font-size: 13px; color: #9CA3AF; text-align: center; margin-top: 4px; }
        @media (max-width: 600px) {
            .wrapper { padding: 10px; }
            .header, .body { padding-left: 24px; padding-right: 24px; }
            .otp-digit { width: 44px; height: 52px; font-size: 22px; }
        }
    </style>
</head>
<body>
<div class="wrapper">
    <div class="card">
        <!-- Header -->
        <div class="header">
            <div class="logo">
                <div class="logo-icon">🐝</div>
                <span class="logo-text">Event<span class="logo-accent">Hive</span></span>
            </div>
            <h1>Verify your email address</h1>
            <p>Use the code below to complete your registration on EventHive</p>
        </div>

        <!-- Body -->
        <div class="body">
            <p class="greeting">Hi, <strong>{{ $name }}</strong> 👋</p>
            <p class="desc">
                Thanks for signing up! To keep your account secure, please verify your email address by entering the code below in your browser.
            </p>

            <!-- OTP Code -->
            <div class="otp-wrapper">
                <p class="otp-label">Your verification code</p>
                <div class="otp-code">
                    @foreach(str_split($otp->code) as $i => $digit)
                        @if($i === 3)
                            <span class="otp-divider">–</span>
                        @endif
                        <div class="otp-digit">{{ $digit }}</div>
                    @endforeach
                </div>
            </div>

            <!-- Expiry -->
            <div class="expiry-notice">
                <p>⏱ This code expires in <strong>10 minutes</strong> ({{ $otp->expires_at->format('H:i') }} WIB)</p>
            </div>

            <p class="not-you">
                If you didn't create an EventHive account, you can safely ignore this email.
            </p>
        </div>

        <hr class="divider">

        <!-- Footer -->
        <div class="footer">
            <p>
                &copy; {{ date('Y') }} EventHive. All rights reserved.<br>
                <a href="#">Privacy Policy</a> &nbsp;·&nbsp; <a href="#">Terms of Service</a>
            </p>
        </div>
    </div>
</div>
</body>
</html>
