<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Selesaikan Pembayaran Anda</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f8fafc; color: #1e293b; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <h2 style="color: #6366f1; margin-top: 0;">Selesaikan Pembayaran Anda Segera!</h2>
        
        <p>Halo,</p>
        <p>Terima kasih telah melakukan pemesanan tiket untuk event <strong>{{ $transaction->event->title }}</strong> di EventHive. Pesanan Anda berhasil dibuat dan sedang menunggu pembayaran.</p>
        
        <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>ID Transaksi:</strong> {{ $transaction->id }}</p>
            <p style="margin: 0 0 10px 0;"><strong>Batas Waktu Pembayaran:</strong> {{ \Carbon\Carbon::parse($transaction->expires_at)->format('d M Y H:i') }} (WIB)</p>
            <p style="margin: 0; font-size: 18px;"><strong>Total Tagihan:</strong> Rp {{ number_format($transaction->total_amount, 0, ',', '.') }}</p>
        </div>

        <p>Silakan klik tombol di bawah ini untuk melihat detail pesanan dan menyelesaikan pembayaran sebelum batas waktu berakhir. Jika melewati batas waktu, pesanan akan dibatalkan otomatis dan tiket akan kembali ke sistem kami.</p>

        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ url('/checkout/payment/' . $transaction->id) }}" style="background-color: #6366f1; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Bayar Sekarang</a>
        </div>

        <p style="font-size: 14px; color: #64748b; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            Jika Anda tidak merasa melakukan transaksi ini, silakan abaikan email ini atau hubungi support kami.<br>
            &copy; {{ date('Y') }} EventHive. All rights reserved.
        </p>
    </div>
</body>
</html>
