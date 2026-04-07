<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Selesaikan Pembayaran Anda – EventHive</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #F8FAFC; color: #1E293B; line-height: 1.6; }
        .wrapper { max-width: 600px; margin: 40px auto; padding: 20px; }
        .card { background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.04); border: 1px solid #E2E8F0; }
        .header { background: linear-gradient(135deg, #4C1D95 0%, #7C3AED 100%); padding: 48px 40px 40px; text-align: center; }
        .logo { display: inline-flex; align-items: center; gap: 8px; margin-bottom: 24px; }
        .logo-icon { width: 44px; height: 44px; background: rgba(255,255,255,0.15); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 22px; backdrop-filter: blur(4px); }
        .logo-text { font-size: 24px; font-weight: 800; color: #fff; letter-spacing: -0.5px; }
        .logo-accent { color: #C4B5FD; }
        .header h1 { color: #fff; font-size: 26px; font-weight: 800; margin-bottom: 12px; letter-spacing: -0.02em; }
        .header p { color: rgba(255,255,255,0.85); font-size: 15px; max-width: 320px; margin: 0 auto; }
        .body { padding: 40px; }
        .greeting { font-size: 18px; color: #0F172A; margin-bottom: 12px; font-weight: 700; }
        .desc { font-size: 15px; color: #64748B; margin-bottom: 32px; }
        .detail-card { background: #F1F5F9; border-radius: 16px; padding: 24px; margin-bottom: 32px; border: 1px solid #E2E8F0; }
        .detail-row { display: flex; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px dashed #CBD5E1; padding-bottom: 12px; }
        .detail-row:last-child { margin-bottom: 0; border-bottom: none; padding-bottom: 0; }
        .detail-label { font-size: 13px; font-weight: 600; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.05em; }
        .detail-value { font-size: 14px; font-weight: 700; color: #1E293B; text-align: right; }
        .total-row { margin-top: 16px; padding-top: 16px; border-top: 2px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center; }
        .total-label { font-size: 15px; font-weight: 800; color: #1E293B; }
        .total-value { font-size: 22px; font-weight: 900; color: #7C3AED; }
        .action-container { text-align: center; margin-bottom: 32px; }
        .btn { display: inline-block; background: #7C3AED; color: #ffffff !important; padding: 18px 36px; border-radius: 16px; font-weight: 800; text-decoration: none; font-size: 16px; transition: all 0.3s; box-shadow: 0 8px 24px rgba(124, 58, 237, 0.25); text-transform: uppercase; letter-spacing: 0.05em; }
        .warning { background: #FFF7ED; border-radius: 12px; padding: 16px; margin-bottom: 32px; border: 1px solid #FED7AA; display: flex; gap: 12px; align-items: center; }
        .warning p { font-size: 13px; color: #9A3412; font-weight: 500; }
        .footer { padding: 32px 40px; text-align: center; background: #F8FAFC; border-top: 1px solid #E2E8F0; }
        .footer p { font-size: 12px; color: #94A3B8; margin-bottom: 8px; }
        .footer a { color: #7C3AED; text-decoration: none; font-weight: 600; }
        @media (max-width: 600px) {
            .wrapper { padding: 12px; }
            .header, .body { padding-left: 24px; padding-right: 24px; }
            .logo-text { font-size: 20px; }
            .header h1 { font-size: 22px; }
            .total-value { font-size: 20px; }
        }
    </style>
</head>
<body>
<div class="wrapper">
    <div class="card">
        <div class="header">
            <div class="logo">
                <div class="logo-icon">🐝</div>
                <span class="logo-text">Event<span class="logo-accent">Hive</span></span>
            </div>
            <h1>Selesaikan Pembayaran</h1>
            <p>Tiket pesanan Anda hampir menjadi milik Anda!</p>
        </div>
        <div class="body">
            <p class="greeting">Halo, <strong>Pelanggan Setia</strong> 👋</p>
            <p class="desc">Terima kasih telah memesan tiket untuk event <strong>{{ $transaction->event->title }}</strong>. Pesanan Anda saat ini sedang menunggu pembayaran agar tiket dapat segera kami terbitkan.</p>
            
            <div class="detail-card">
                <div class="detail-row">
                    <span class="detail-label">ID Transaksi</span>
                    <span class="detail-value">#{{ $transaction->id }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Event</span>
                    <span class="detail-value">{{ $transaction->event->title }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Batas Waktu</span>
                    <span class="detail-value text-red-500">{{ \Carbon\Carbon::parse($transaction->expires_at)->format('d M Y H:i') }} WIB</span>
                </div>
                <div class="total-row">
                    <span class="total-label">Total Tagihan</span>
                    <span class="total-value">Rp {{ number_format($transaction->total_amount, 0, ',', '.') }}</span>
                </div>
            </div>

            <div class="warning">
                <p>⚠️ Mohon selesaikan pembayaran sebelum batas waktu berakhir. Jika melewati batas waktu, pesanan akan dibatalkan otomatis oleh sistem.</p>
            </div>

            <div class="action-container">
                <a href="{{ url('/checkout/payment/' . $transaction->id) }}" class="btn">Bayar Sekarang</a>
            </div>

            <p class="desc" style="text-align: center; font-size: 13px; margin-bottom: 0;">Jika Anda memiliki pertanyaan, silakan hubungi tim support kami.</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} EventHive. All rights reserved.</p>
            <p><a href="{{ url('/') }}">Privacy Policy</a> &nbsp;·&nbsp; <a href="{{ url('/') }}">Terms of Service</a></p>
        </div>
    </div>
</div>
</body>
</html>
