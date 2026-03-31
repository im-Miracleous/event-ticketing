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
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">

    @vite(['resources/css/app.css', 'resources/js/app.tsx'])

    <style>
        body {
            background-color: #030014 !important; /* Very deep dark */
            min-height: 100vh;
            overflow-x: hidden;
            font-family: 'Inter', sans-serif;
            color: #fff;
        }
        h1, h2, h3, .heading-font {
            font-family: 'Plus Jakarta Sans', sans-serif;
        }

        /* Ambient floating background glows */
        .ambient-bg {
            position: fixed;
            inset: 0;
            z-index: 0;
            background: 
                radial-gradient(circle at 15% 50%, rgba(124, 58, 237, 0.12), transparent 50%),
                radial-gradient(circle at 85% 30%, rgba(236, 72, 153, 0.10), transparent 50%),
                radial-gradient(circle at 50% -20%, rgba(59, 130, 246, 0.08), transparent 50%);
            animation: pulse-bg 15s ease-in-out infinite alternate;
        }
        @keyframes pulse-bg {
            0% { transform: scale(1); }
            100% { transform: scale(1.1); }
        }
        
        /* Subtle grid that fades out towards edges */
        .animated-grid {
            position: fixed;
            inset: 0;
            z-index: 1;
            background-image:
                linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
            background-size: 64px 64px;
            mask-image: radial-gradient(ellipse 100% 100% at 50% 50%, black 10%, transparent 70%);
            -webkit-mask-image: radial-gradient(ellipse 100% 100% at 50% 50%, black 10%, transparent 70%);
        }

        .logo-glow {
            filter: drop-shadow(0 0 30px rgba(124, 58, 237, 0.5));
        }

        /* Smooth reveal animations */
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(30px); filter: blur(8px); }
            to   { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .stagger-1 { animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.1s; opacity: 0; }
        .stagger-2 { animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.2s; opacity: 0; }
        .stagger-3 { animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.3s; opacity: 0; }
    </style>
</head>
<body class="antialiased selection:bg-purple-500/30 selection:text-white">

    <!-- Scenic Background -->
    <div class="ambient-bg"></div>
    <div class="animated-grid"></div>

    <!-- Content Area: No borders, no cards, just pure fluid layout -->
    <div class="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12 sm:px-12">
        
        <!-- Logo Region -->
        <a href="/" class="stagger-1 flex flex-col items-center gap-5 mb-14 group cursor-pointer outline-none">
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center logo-glow transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3"
                 style="background: linear-gradient(135deg, #7C3AED, #EC4899);">
                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z"/>
                </svg>
            </div>
            <span class="heading-font text-3xl font-extrabold tracking-tight text-white">
                Event<span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Hive</span>
            </span>
        </a>

        <!-- Form injection slot -->
        <div class="stagger-2 w-full max-w-[420px]">
            {{ $slot }}
        </div>

        <!-- Footer -->
        <div class="stagger-3 mt-20 text-center">
            <p class="text-sm text-slate-500/70 font-medium">
                &copy; {{ date('Y') }} EventHive. Make every moment count.
            </p>
        </div>
    </div>

</body>
</html>
