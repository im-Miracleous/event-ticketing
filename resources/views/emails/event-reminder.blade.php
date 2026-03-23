<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Pengingat: {{ $event->title }} Besok!</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f8fafc; color: #1e293b; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <h2 style="color: #6366f1; margin-top: 0;">Bersiaplah, Event Anda Besok! 🎉</h2>
        
        <p>Halo {{ $user->name }},</p>
        <p>Ini adalah pengingat bahwa event <strong>{{ $event->title }}</strong> akan berlangsung besok. Kami sangat antusias menyambut kehadiran Anda!</p>
        
        <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 5px 0;">📅 <strong>Waktu:</strong> {{ \Carbon\Carbon::parse($event->start_time)->format('l, d M Y - H:i') }}</p>
            <p style="margin: 0 0 5px 0;">📍 <strong>Lokasi:</strong> {{ $event->location }}</p>
        </div>

        <h3 style="margin-top: 30px; margin-bottom: 10px;">Informasi Penting:</h3>
        <ul style="color: #475569; font-size: 14px; line-height: 1.6;">
            <li>Siapkan E-Ticket / QR Code Anda di handphone. Buka email E-Ticket sebelumnya atau buka menu "My Tickets" di website EventHive.</li>
            <li>Datanglah lebih awal untuk menghindari antrean panjang saat check-in.</li>
            <li>Dilarang membawa senjata tajam, obat-obatan terlarang, atau makanan/minuman dari luar (kecuali diizinkan oleh panitia).</li>
        </ul>

        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ url('/my-tickets') }}" style="background-color: #6366f1; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Lihat Tiket Saya</a>
        </div>

        <p style="font-size: 14px; color: #64748b; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            Sampai jumpa besok!<br>
            &copy; {{ date('Y') }} EventHive. All rights reserved.
        </p>
    </div>
</body>
</html>
