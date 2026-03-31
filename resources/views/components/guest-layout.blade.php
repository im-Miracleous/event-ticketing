@props([])

<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="description" content="EventHive – Sign in to discover extraordinary events">

    <title>{{ config('app.name', 'EventHive') }} – Auth</title>

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%237C3AED%22/><path d=%22M30 30h20v10h-20v10h20v10h-20v10h40v-10h-10v-10h10v-10h-10v-10h10v-10h-40z%22 fill=%22white%22/></svg>">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    @vite(['resources/css/app.css', 'resources/js/app.tsx'])

    <style>
        body {
            background-color: #030014 !important;
            min-height: 100vh;
            overflow-x: hidden;
            font-family: 'Inter', sans-serif;
            color: #fff;
        }
        h1, h2, h3, .heading-font {
            font-family: 'Plus Jakarta Sans', sans-serif;
        }

        /* ═══════ AMBIENT BACKGROUND ═══════ */
        .ambient-bg {
            position: fixed;
            inset: 0;
            z-index: 0;
            overflow: hidden;
        }

        /* Multiple animated gradient orbs */
        .orb {
            position: absolute;
            border-radius: 50%;
            filter: blur(100px);
            will-change: transform;
        }
        .orb-1 {
            width: 600px; height: 600px;
            background: rgba(124, 58, 237, 0.15);
            top: -15%; left: -10%;
            animation: orbit-1 25s ease-in-out infinite;
        }
        .orb-2 {
            width: 500px; height: 500px;
            background: rgba(236, 72, 153, 0.10);
            bottom: -10%; right: -10%;
            animation: orbit-2 30s ease-in-out infinite;
        }
        .orb-3 {
            width: 350px; height: 350px;
            background: rgba(59, 130, 246, 0.08);
            top: 30%; right: 20%;
            animation: orbit-3 22s ease-in-out infinite;
        }
        .orb-4 {
            width: 250px; height: 250px;
            background: rgba(167, 139, 250, 0.08);
            bottom: 20%; left: 25%;
            animation: orbit-4 28s ease-in-out infinite;
        }

        @keyframes orbit-1 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(80px, 40px) scale(1.1); }
            50% { transform: translate(-30px, 80px) scale(0.9); }
            75% { transform: translate(60px, -20px) scale(1.05); }
        }
        @keyframes orbit-2 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(-60px, -50px) scale(1.05); }
            50% { transform: translate(40px, -80px) scale(0.95); }
            75% { transform: translate(-30px, 30px) scale(1.1); }
        }
        @keyframes orbit-3 {
            0%, 100% { transform: translate(0, 0); }
            33% { transform: translate(-50px, 30px); }
            66% { transform: translate(30px, -40px); }
        }
        @keyframes orbit-4 {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(40px, -30px); }
        }

        /* Subtle grid that fades out towards edges */
        .animated-grid {
            position: fixed;
            inset: 0;
            z-index: 1;
            background-image:
                linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
            background-size: 64px 64px;
            mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 10%, transparent 70%);
            -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 10%, transparent 70%);
        }

        /* Floating particles */
        .particles-container {
            position: fixed;
            inset: 0;
            z-index: 1;
            overflow: hidden;
            pointer-events: none;
        }
        .particle {
            position: absolute;
            border-radius: 50%;
            background: rgba(167, 139, 250, 0.4);
            animation: particle-float linear infinite;
        }
        @keyframes particle-float {
            0%   { transform: translateY(100vh) rotate(0deg); opacity: 0; }
            10%  { opacity: 1; }
            90%  { opacity: 0.8; }
            100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
        }

        /* ═══════ NOISE TEXTURE ═══════ */
        .noise-overlay {
            position: fixed;
            inset: 0;
            z-index: 2;
            opacity: 0.03;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
            pointer-events: none;
        }

        /* ═══════ BACK TO HOME BUTTON ═══════ */
        .back-home-btn {
            position: fixed;
            top: 1.75rem;
            left: 2rem;
            z-index: 50;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.6rem 1.2rem;
            border-radius: 9999px;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            color: #94a3b8;
            font-size: 0.82rem;
            font-weight: 500;
            text-decoration: none;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
        }
        .back-home-btn:hover {
            background: rgba(124, 58, 237, 0.12);
            border-color: rgba(124, 58, 237, 0.3);
            color: #c4b5fd;
            transform: translateX(-4px);
            box-shadow: 0 0 25px rgba(124, 58, 237, 0.15);
        }
        .back-home-btn svg {
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .back-home-btn:hover svg {
            transform: translateX(-3px);
        }

        /* ═══════ LOGO GLOW ═══════ */
        .logo-wrapper {
            position: relative;
        }
        .logo-wrapper::after {
            content: '';
            position: absolute;
            inset: -15px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(124, 58, 237, 0.25), transparent 70%);
            z-index: -1;
            animation: logo-pulse 4s ease-in-out infinite alternate;
        }
        @keyframes logo-pulse {
            0% { opacity: 0.5; transform: scale(0.9); }
            100% { opacity: 1; transform: scale(1.15); }
        }

        .logo-icon {
            width: 72px;
            height: 72px;
            border-radius: 1.25rem;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #7C3AED 0%, #a855f7 50%, #EC4899 100%);
            box-shadow:
                0 0 40px rgba(124, 58, 237, 0.4),
                0 0 80px rgba(124, 58, 237, 0.15),
                inset 0 1px 1px rgba(255,255,255,0.2);
            transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .logo-link:hover .logo-icon {
            transform: scale(1.08) rotate(5deg);
            box-shadow:
                0 0 50px rgba(124, 58, 237, 0.5),
                0 0 100px rgba(124, 58, 237, 0.2),
                inset 0 1px 1px rgba(255,255,255,0.3);
        }

        .brand-name {
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 2rem;
            font-weight: 800;
            letter-spacing: -0.02em;
            color: #fff;
        }
        .brand-accent {
            background: linear-gradient(135deg, #a78bfa 0%, #f472b6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        /* ═══════ GLASSMORPHISM CARD ═══════ */
        .glass-form-card {
            background: rgba(255, 255, 255, 0.025);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 1.75rem;
            padding: 2.5rem;
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            box-shadow:
                0 25px 60px rgba(0, 0, 0, 0.3),
                0 0 0 1px rgba(255, 255, 255, 0.03) inset,
                0 1px 0 rgba(255, 255, 255, 0.05) inset;
            position: relative;
            overflow: hidden;
        }
        /* Top accent line on card */
        .glass-form-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 10%;
            right: 10%;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.5), rgba(236, 72, 153, 0.5), transparent);
        }
        /* Inner glow */
        .glass-form-card::after {
            content: '';
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 200px;
            height: 150px;
            background: radial-gradient(ellipse, rgba(124, 58, 237, 0.06), transparent 70%);
            pointer-events: none;
        }

        /* ═══════ SMOOTH ANIMATIONS ═══════ */
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(30px); filter: blur(8px); }
            to   { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes fade-in-down {
            from { opacity: 0; transform: translateY(-15px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        .stagger-0 { animation: fade-in-down 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.05s; opacity: 0; }
        .stagger-1 { animation: fade-in-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.15s; opacity: 0; }
        .stagger-2 { animation: fade-in-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.3s; opacity: 0; }
        .stagger-3 { animation: fade-in-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.45s; opacity: 0; }

        /* Footer */
        .auth-footer {
            color: rgba(100, 116, 139, 0.4);
            font-size: 0.78rem;
            font-weight: 500;
            letter-spacing: 0.02em;
        }
        .auth-footer a {
            color: rgba(167, 139, 250, 0.5);
            text-decoration: none;
            transition: color 0.3s;
        }
        .auth-footer a:hover {
            color: rgba(167, 139, 250, 0.8);
        }
    </style>
</head>
<body class="antialiased selection:bg-purple-500/30 selection:text-white">

    {{-- ══ Background Layers ══ --}}
    <div class="ambient-bg">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
        <div class="orb orb-4"></div>
    </div>
    <div class="animated-grid"></div>
    <div class="noise-overlay"></div>

    {{-- Floating particles --}}
    <div class="particles-container">
        @for ($i = 0; $i < 15; $i++)
            <div class="particle" style="
                left: {{ rand(5, 95) }}%;
                width: {{ rand(2, 4) }}px;
                height: {{ rand(2, 4) }}px;
                animation-duration: {{ rand(12, 25) }}s;
                animation-delay: {{ rand(0, 20) }}s;
                opacity: {{ rand(2, 5) / 10 }};
            "></div>
        @endfor
    </div>

    {{-- ══ Back to Home Button ══ --}}
    <a href="/" class="back-home-btn stagger-0" id="back-to-home">
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
        Kembali ke Beranda
    </a>

    {{-- ══ Main Content ══ --}}
    <div class="relative z-10 min-h-screen flex flex-col items-center justify-center px-5 py-14 sm:px-10">

        {{-- Logo --}}
        <a href="/" class="stagger-1 logo-link flex flex-col items-center gap-5 mb-12 group cursor-pointer outline-none" style="text-decoration: none;">
            <div class="logo-wrapper">
                <div class="logo-icon">
                    <svg style="width: 34px; height: 34px; color: white;" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z"/>
                    </svg>
                </div>
            </div>
            <span class="brand-name">
                Event<span class="brand-accent">Hive</span>
            </span>
        </a>

        {{-- Glassmorphism Form Card --}}
        <div class="stagger-2 glass-form-card w-full max-w-[440px]">
            {{ $slot }}
        </div>

        {{-- Footer --}}
        <div class="stagger-3 mt-16 text-center auth-footer">
            <p>&copy; {{ date('Y') }} EventHive. Make every moment count.</p>
        </div>
    </div>

</body>
</html>
