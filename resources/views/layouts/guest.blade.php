<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="description" content="EventHive – Sign in to discover extraordinary events">

        <title>{{ config('app.name', 'EventHive') }} – @yield('title', 'Auth')</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="font-sans antialiased min-h-screen">
        <div class="min-h-screen flex">

            <!-- Left decorative panel -->
            <div class="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden"
                 style="background: linear-gradient(135deg, #0D0D1A 0%, #1A1A2E 40%, #4C1D95 100%);">
                <!-- Decorative circles -->
                <div class="absolute -top-20 -left-20 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl"></div>
                <div class="absolute bottom-0 right-0 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl"></div>
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-400/10 rounded-full blur-2xl"></div>

                <!-- Grid pattern overlay -->
                <div class="absolute inset-0 opacity-10"
                     style="background-image: linear-gradient(rgba(124,58,237,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.3) 1px, transparent 1px); background-size: 40px 40px;"></div>

                <!-- Content -->
                <div class="relative z-10 flex flex-col justify-between p-12 w-full">
                    <!-- Logo -->
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-600/40 animate-glow">
                            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z"/>
                            </svg>
                        </div>
                        <span class="text-2xl font-bold text-white tracking-tight">
                            Event<span class="text-primary-400">Hive</span>
                        </span>
                    </div>

                    <!-- Center message -->
                    <div class="space-y-6">
                        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-600/20 border border-primary-500/30 text-primary-300 text-sm font-medium">
                            <span class="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></span>
                            Discover Extraordinary Events
                        </div>
                        <h1 class="text-4xl xl:text-5xl font-bold text-white leading-tight">
                            Your gateway to<br/>
                            <span class="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-pink-400">
                                unforgettable
                            </span><br/>
                            experiences
                        </h1>
                        <p class="text-gray-400 text-lg leading-relaxed max-w-md">
                            Join thousands of event lovers. Create, discover, and attend events that matter to you.
                        </p>

                        <!-- Stats row -->
                        <div class="flex gap-8 pt-4">
                            <div>
                                <p class="text-2xl font-bold text-white">10K+</p>
                                <p class="text-gray-400 text-sm">Events</p>
                            </div>
                            <div class="w-px bg-white/10"></div>
                            <div>
                                <p class="text-2xl font-bold text-white">50K+</p>
                                <p class="text-gray-400 text-sm">Users</p>
                            </div>
                            <div class="w-px bg-white/10"></div>
                            <div>
                                <p class="text-2xl font-bold text-white">98%</p>
                                <p class="text-gray-400 text-sm">Satisfaction</p>
                            </div>
                        </div>
                    </div>

                    <!-- Floating cards (decorative) -->
                    <div class="flex items-center gap-4">
                        <div class="glass-card px-4 py-3 flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                </svg>
                            </div>
                            <div>
                                <p class="text-white text-xs font-semibold">Secure & Trusted</p>
                                <p class="text-gray-400 text-xs">SSL Encrypted</p>
                            </div>
                        </div>
                        <div class="glass-card px-4 py-3 flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-secondary-500 flex items-center justify-center">
                                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                                    <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/>
                                </svg>
                            </div>
                            <div>
                                <p class="text-white text-xs font-semibold">Easy Tickets</p>
                                <p class="text-gray-400 text-xs">Instant Booking</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right form panel -->
            <div class="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white relative">
                <!-- Mobile logo -->
                <div class="lg:hidden flex items-center gap-3 mb-10">
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z"/>
                        </svg>
                    </div>
                    <span class="text-2xl font-bold text-gray-900">Event<span class="text-primary-600">Hive</span></span>
                </div>

                <div class="w-full max-w-md animate-slide-up">
                    {{ $slot }}
                </div>
            </div>
        </div>
    </body>
</html>
