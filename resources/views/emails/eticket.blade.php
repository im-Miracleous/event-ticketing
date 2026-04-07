<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>E-Ticket: {{ $transaction->event->title }}</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f8fafc; color: #1e293b; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <h2 style="color: #6366f1; margin-top: 0;">E-Ticket Anda Siap! 🎉</h2>
        
        <p>Halo,</p>
        <p>Pembayaran untuk pesanan <strong>{{ $transaction->id }}</strong> telah berhasil diverifikasi. Berikut adalah E-Ticket Anda untuk event:</p>
        
        <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 5px 0; font-size: 18px;"><strong>{{ $transaction->event->title }}</strong></p>
            <p style="margin: 0 0 5px 0;">📅 {{ \Carbon\Carbon::parse($transaction->event->start_time)->format('l, d M Y - H:i') }}</p>
            <p style="margin: 0;">📍 {{ $transaction->event->location }}</p>
        </div>

        <h3 style="margin-top: 30px; margin-bottom: 15px;">Daftar Tiket:</h3>
        
        @foreach($transaction->details as $detail)
            @foreach($detail->tickets as $ticket)
            <div style="border: 2px dashed #cbd5e1; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
                <p style="text-transform: uppercase; font-weight: bold; margin: 0 0 5px 0; color: #6366f1; letter-spacing: 1px;">{{ $detail->ticketType->name }}</p>
                <p style="margin: 0 0 15px 0; font-size: 14px; color: #64748b;">Attendee: {{ $ticket->attendee->name }}</p>
                
                <img src="https://quickchart.io/qr?size=200&text={{ $ticket->qr_code }}" alt="QR Code" style="display: block; margin: 0 auto; border-radius: 4px;" />
                
                <p style="margin: 15px 0 0 0; font-family: monospace; font-size: 16px; letter-spacing: 2px;">{{ $ticket->id }}</p>
            </div>
            @endforeach
        @endforeach

        <p style="font-size: 14px; margin-top: 30px;">Tunjukkan QR Code di atas saat check-in di lokasi venue. Pastikan tingkat kecerahan layar HP Anda cukup agar QR mudah di-scan.</p>

        <p style="font-size: 14px; color: #64748b; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            Terima kasih telah menggunakan EventHive.<br>
            &copy; {{ date('Y') }} EventHive. All rights reserved.
        </p>
    </div>
</body>
</html>
