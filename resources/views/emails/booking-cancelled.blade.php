<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Pesanan Dibatalkan: {{ $transaction->event->title }}</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f8fafc; color: #1e293b; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <h2 style="color: #ef4444; margin-top: 0;">Pesanan Anda Telah Dibatalkan</h2>
        
        <p>Halo,</p>
        <p>Kami informasikan bahwa pesanan tiket Anda untuk event <strong>{{ $transaction->event->title }}</strong> dengan ID <strong>{{ $transaction->id }}</strong> telah dibatalkan.</p>
        
        <p>Hal ini dapat terjadi karena alasan berikut:</p>
        <ul style="color: #475569; font-size: 14px; line-height: 1.6;">
            <li>Anda belum menyelesaikan pembayaran hingga batas waktu yang ditentukan (15 menit).</li>
            <li>Anda melakukan konfirmasi pembatalan pemesanan secara mandiri.</li>
        </ul>

        <p>Jika Anda masih ingin menghadiri event ini, silakan melakukan pemesanan ulang selama tiket masih tersedia.</p>

        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ url('/events/' . $transaction->event_id) }}" style="background-color: #6366f1; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Lihat Halaman Event</a>
        </div>

        <p style="font-size: 14px; color: #64748b; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            Terima kasih telah menggunakan EventHive.<br>
            &copy; {{ date('Y') }} EventHive. All rights reserved.
        </p>
    </div>
</body>
</html>
