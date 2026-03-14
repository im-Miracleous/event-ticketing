<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="EventHive – Discover and create extraordinary events. The ultimate platform for event lovers.">
    <title>EventHive – Discover & Create Extraordinary Events</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <style>
        /* Particle background */
        .hero-bg {
            background: linear-gradient(135deg, #0D0D1A 0%, #1A1A2E 40%, #4C1D95 100%);
            position: relative;
            overflow: hidden;
        }
        .hero-bg::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image:
                radial-gradient(circle at 20% 20%, rgba(124,58,237,0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(239,68,68,0.15) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(167,139,250,0.1) 0%, transparent 60%);
        }
        .grid-overlay {
            position: absolute;
            inset: 0;
            opacity: 0.07;
            background-image:
                linear-gradient(rgba(124,58,237,0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(124,58,237,0.5) 1px, transparent 1px);
            background-size: 50px 50px;
        }
        .blob {
            position: absolute;
            border-radius: 50%;
            filter: blur(60px);
            animation: float 8s ease-in-out infinite;
        }
        .navbar-scroll {
            transition: all 0.3s ease;
        }
        .navbar-scroll.scrolled {
            background: rgba(13,13,26,0.9);
            backdrop-filter: blur(20px);
            box-shadow: 0 1px 0 rgba(255,255,255,0.1);
        }
        .event-card:hover .event-image {
            transform: scale(1.05);
        }
        .stat-number {
            background: linear-gradient(135deg, #A78BFA, #7C3AED);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .feature-icon-bg {
            background: linear-gradient(135deg, rgba(124,58,237,0.2), rgba(124,58,237,0.05));
        }
    </style>
</head>
<body class="font-sans antialiased bg-dark text-white">

    <!-- ========== NAVBAR ========== -->
    <nav id="navbar" class="navbar-scroll fixed top-0 inset-x-0 z-50 py-4">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between">
                <!-- Logo -->
                <a href="/" class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-600/40">
                        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z"/>
                        </svg>
                    </div>
                    <span class="text-xl font-bold tracking-tight text-white">Event<span class="text-primary-400">Hive</span></span>
                </a>

                <!-- Desktop nav links -->
                <div class="hidden md:flex items-center gap-8">
                    <a href="#features" class="text-sm font-medium text-gray-300 hover:text-white transition-colors">Features</a>
                    <a href="#events" class="text-sm font-medium text-gray-300 hover:text-white transition-colors">Events</a>
                    <a href="#about" class="text-sm font-medium text-gray-300 hover:text-white transition-colors">About</a>
                    <a href="#testimonials" class="text-sm font-medium text-gray-300 hover:text-white transition-colors">Reviews</a>
                </div>

                <!-- Auth actions -->
                <div class="hidden md:flex items-center gap-3">
                    @auth
                        <a href="{{ route('dashboard') }}" class="btn-primary text-sm px-5 py-2.5">Go to Dashboard</a>
                    @else
                        <a href="{{ route('login') }}" class="text-sm font-medium text-gray-300 hover:text-white transition-colors px-4 py-2">Sign In</a>
                        <a href="{{ route('register') }}" class="btn-primary text-sm px-5 py-2.5">Get Started Free</a>
                    @endauth
                </div>

                <!-- Mobile menu button -->
                <button id="mobile-menu-btn" class="md:hidden p-2 rounded-xl text-gray-300 hover:bg-white/10 transition-colors">
                    <svg id="menu-icon" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                    <svg id="close-icon" class="w-6 h-6 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>

            <!-- Mobile menu -->
            <div id="mobile-menu" class="md:hidden hidden mt-4 pb-4 border-t border-white/10">
                <div class="flex flex-col gap-3 pt-4">
                    <a href="#features" class="text-sm text-gray-300 hover:text-white py-2">Features</a>
                    <a href="#events" class="text-sm text-gray-300 hover:text-white py-2">Events</a>
                    <a href="#about" class="text-sm text-gray-300 hover:text-white py-2">About</a>
                    <a href="#testimonials" class="text-sm text-gray-300 hover:text-white py-2">Reviews</a>
                    <div class="flex flex-col gap-2 pt-2 border-t border-white/10">
                        @auth
                            <a href="{{ route('dashboard') }}" class="btn-primary justify-center">Dashboard</a>
                        @else
                            <a href="{{ route('login') }}" class="btn-secondary justify-center">Sign In</a>
                            <a href="{{ route('register') }}" class="btn-primary justify-center">Get Started Free</a>
                        @endauth
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <!-- ========== HERO SECTION ========== -->
    <section class="hero-bg min-h-screen flex items-center pt-20">
        <div class="grid-overlay"></div>
        <!-- Blobs -->
        <div class="blob w-96 h-96 bg-primary-600/30 top-10 -left-20" style="animation-delay:0s;"></div>
        <div class="blob w-72 h-72 bg-secondary-500/20 bottom-20 right-10" style="animation-delay:3s;"></div>
        <div class="blob w-64 h-64 bg-primary-400/20 top-1/2 left-1/2" style="animation-delay:5s;"></div>

        <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <!-- Left content -->
                <div class="animate-slide-up space-y-8">
                    <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-600/20 border border-primary-500/30 text-primary-300 text-sm font-medium">
                        <span class="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></span>
                        🎉 Over 10,000 events listed
                    </div>

                    <h1 class="text-4xl sm:text-5xl xl:text-6xl font-bold leading-tight text-white text-balance">
                        Discover &amp; Create
                        <span class="block bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-purple-300 to-pink-400">
                            Extraordinary
                        </span>
                        Events
                    </h1>

                    <p class="text-gray-400 text-lg leading-relaxed max-w-lg">
                        EventHive is your ultimate platform to discover amazing events, create unforgettable experiences, and connect with like-minded people.
                    </p>

                    <div class="flex flex-col sm:flex-row gap-4">
                        @auth
                            <a href="{{ route('dashboard') }}" class="btn-primary text-base px-8 py-4 gap-2">
                                Go to Dashboard
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                                </svg>
                            </a>
                        @else
                            <a href="{{ route('register') }}" class="btn-primary text-base px-8 py-4 gap-2">
                                Get Started Free
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                                </svg>
                            </a>
                            <a href="{{ route('login') }}" class="btn-secondary text-base px-8 py-4">
                                Sign In
                            </a>
                        @endauth
                    </div>

                    <!-- Trust badges -->
                    <div class="flex items-center gap-6 pt-2">
                        <div class="flex -space-x-2">
                            @foreach(['EF','AK','BR','CL'] as $i)
                            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-{{ $loop->index % 2 == 0 ? '400' : '600' }} to-primary-700 border-2 border-dark flex items-center justify-center text-xs font-bold text-white">
                                {{ $i[0] }}
                            </div>
                            @endforeach
                        </div>
                        <div>
                            <div class="flex text-yellow-400 text-sm">★★★★★</div>
                            <p class="text-gray-400 text-xs">Trusted by 50,000+ users</p>
                        </div>
                    </div>
                </div>

                <!-- Right visual — floating event cards -->
                <div class="relative hidden lg:block">
                    <!-- Main card -->
                    <div class="glass-card p-6 max-w-sm ml-auto shadow-2xl shadow-primary-600/20 animate-float">
                        <div class="flex items-center justify-between mb-4">
                            <span class="badge-primary">🔥 Trending</span>
                            <svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                            </svg>
                        </div>
                        <div class="h-32 rounded-xl bg-gradient-to-br from-primary-600 to-primary-900 mb-4 flex items-center justify-center">
                            <svg class="w-12 h-12 text-white/40" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                            </svg>
                        </div>
                        <h3 class="text-white font-semibold text-sm mb-1">Jakarta Music Festival 2026</h3>
                        <p class="text-gray-400 text-xs mb-3">📍 GBK, Jakarta &nbsp;·&nbsp; 🗓 Mar 28–30</p>
                        <div class="flex items-center justify-between">
                            <span class="text-primary-400 font-bold text-sm">Rp 350.000</span>
                            <button class="btn-primary text-xs px-4 py-2">Buy Ticket</button>
                        </div>
                    </div>

                    <!-- Floating mini card 1 -->
                    <div class="absolute -top-6 -left-6 glass-card p-4 shadow-xl" style="animation: float 7s ease-in-out infinite; animation-delay: 2s;">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-secondary-500 flex items-center justify-center text-lg">🎨</div>
                            <div>
                                <p class="text-white text-xs font-semibold">Art Exhibition</p>
                                <p class="text-gray-400 text-xs">500+ attending</p>
                            </div>
                        </div>
                    </div>

                    <!-- Floating mini card 2 -->
                    <div class="absolute -bottom-4 left-0 glass-card p-4 shadow-xl" style="animation: float 6s ease-in-out infinite; animation-delay: 4s;">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                                <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <div>
                                <p class="text-white text-xs font-semibold">Ticket Confirmed!</p>
                                <p class="text-gray-400 text-xs">Instant delivery</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ========== STATS SECTION ========== -->
    <section id="about" class="py-16 bg-dark-50 border-y border-white/5">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                @foreach([['10K+','Events Listed'],['50K+','Happy Users'],['200+','Cities'],['98%','Satisfaction Rate']] as $stat)
                <div class="space-y-2">
                    <p class="text-4xl font-bold stat-number">{{ $stat[0] }}</p>
                    <p class="text-gray-400 text-sm font-medium">{{ $stat[1] }}</p>
                </div>
                @endforeach
            </div>
        </div>
    </section>

    <!-- ========== FEATURES SECTION ========== -->
    <section id="features" class="py-24 bg-dark">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Section header -->
            <div class="text-center max-w-2xl mx-auto mb-16">
                <span class="inline-block px-4 py-1.5 rounded-full bg-primary-600/20 border border-primary-500/30 text-primary-400 text-sm font-medium mb-4">
                    Why EventHive?
                </span>
                <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
                    Everything you need to manage events
                </h2>
                <p class="text-gray-400 text-lg">
                    Powerful tools designed for organizers and event lovers alike.
                </p>
            </div>

            <!-- Features grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                @foreach([
                    ['🎟️','Easy Ticket Booking','Browse thousands of events and book tickets in seconds with our streamlined checkout process.','from-primary-500/20 to-primary-600/5'],
                    ['🗺️','Discover Local Events','Find exciting events near you with smart geolocation and personalized recommendations.','from-secondary-500/20 to-secondary-600/5'],
                    ['📊','Organizer Dashboard','Powerful analytics and management tools to help event organizers track sales and attendance.','from-green-500/20 to-green-600/5'],
                    ['🔒','Secure Payments','Bank-grade encryption protects every transaction. Multiple payment methods supported.','from-blue-500/20 to-blue-600/5'],
                    ['📱','Mobile First','Fully responsive experience. Manage your events and tickets from any device.','from-yellow-500/20 to-yellow-600/5'],
                    ['🎯','Smart Matching','Our AI-powered engine matches you with events based on your interests and past activity.','from-pink-500/20 to-pink-600/5'],
                ] as $feature)
                <div class="group card-dark p-6 hover:border-primary-500/30 hover:-translate-y-1 transition-all duration-300 cursor-default">
                    <div class="feature-icon-bg w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {{ $feature[0] }}
                    </div>
                    <h3 class="text-white font-semibold text-lg mb-2">{{ $feature[1] }}</h3>
                    <p class="text-gray-400 text-sm leading-relaxed">{{ $feature[2] }}</p>
                </div>
                @endforeach
            </div>
        </div>
    </section>

    <!-- ========== UPCOMING EVENTS ========== -->
    <section id="events" class="py-24 bg-dark-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Header -->
            <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
                <div>
                    <span class="inline-block px-4 py-1.5 rounded-full bg-primary-600/20 border border-primary-500/30 text-primary-400 text-sm font-medium mb-4">
                        Upcoming Events
                    </span>
                    <h2 class="text-3xl sm:text-4xl font-bold text-white">Trending Near You</h2>
                </div>
                <a href="#" class="btn-secondary self-start sm:self-auto">
                    View All Events →
                </a>
            </div>

            <!-- Event cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                @foreach([
                    ['Jakarta Music Festival 2026','GBK, Jakarta','Mar 28–30','Rp 350.000','Music','🎵','from-violet-600 to-purple-900'],
                    ['Tech Summit Indonesia','JCC Senayan','Apr 5','Rp 150.000','Technology','💻','from-blue-600 to-indigo-900'],
                    ['Bali Art & Culture Expo','Bali Nusa Dua','Apr 12–14','Free','Arts','🎨','from-orange-500 to-red-800'],
                    ['Startup Pitching Night','GDP Labs, Jakarta','Apr 8','Rp 50.000','Business','🚀','from-green-600 to-teal-900'],
                    ['Culinary Festival Bandung','Gasibu Bandung','Apr 20–21','Rp 25.000','Food','🍜','from-yellow-500 to-orange-800'],
                    ['EDM Night Jakarta','La Piazza','Apr 25','Rp 200.000','Music','🎧','from-pink-600 to-rose-900'],
                ] as $event)
                <article class="event-card card-dark overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all duration-300 hover:border-primary-500/30">
                    <div class="overflow-hidden h-44">
                        <div class="event-image h-44 bg-gradient-to-br {{ $event[6] }} flex items-center justify-center text-5xl transition-transform duration-500">
                            {{ $event[5] }}
                        </div>
                    </div>
                    <div class="p-5">
                        <div class="flex items-center justify-between mb-2">
                            <span class="badge-primary text-xs">{{ $event[4] }}</span>
                            <svg class="w-4 h-4 text-gray-500 hover:text-red-400 cursor-pointer transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                            </svg>
                        </div>
                        <h3 class="text-white font-semibold text-base mb-1 group-hover:text-primary-400 transition-colors">{{ $event[0] }}</h3>
                        <p class="text-gray-400 text-xs mb-1">📍 {{ $event[1] }}</p>
                        <p class="text-gray-400 text-xs mb-3">🗓 {{ $event[2] }}</p>
                        <div class="flex items-center justify-between">
                            <span class="text-primary-400 font-bold text-sm">{{ $event[3] }}</span>
                            <button class="btn-primary text-xs px-4 py-2">Get Ticket</button>
                        </div>
                    </div>
                </article>
                @endforeach
            </div>
        </div>
    </section>

    <!-- ========== TESTIMONIALS ========== -->
    <section id="testimonials" class="py-24 bg-dark">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center max-w-2xl mx-auto mb-16">
                <span class="inline-block px-4 py-1.5 rounded-full bg-primary-600/20 border border-primary-500/30 text-primary-400 text-sm font-medium mb-4">
                    Testimonials
                </span>
                <h2 class="text-3xl sm:text-4xl font-bold text-white">What our users say</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                @foreach([
                    ['Adi Putra','Event Organizer','EventHive made managing our annual conference so much easier. Ticket sales doubled compared to last year!','★★★★★','AP'],
                    ['Sari Wulandari','Music Fan','I discovered so many amazing concerts through EventHive. The interface is super clean and booking is seamless.','★★★★★','SW'],
                    ['Budi Santoso','Tech Enthusiast','Best event platform in Indonesia. The recommendations are spot-on and the dashboard is very intuitive.','★★★★★','BS'],
                ] as $review)
                <div class="card-dark p-6 hover:border-primary-500/30 transition-all duration-300">
                    <div class="flex text-yellow-400 text-sm mb-4">{{ $review[3] }}</div>
                    <p class="text-gray-300 text-sm leading-relaxed mb-6">"{{ $review[2] }}"</p>
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-sm font-bold text-white">
                            {{ $review[4] }}
                        </div>
                        <div>
                            <p class="text-white text-sm font-semibold">{{ $review[0] }}</p>
                            <p class="text-gray-400 text-xs">{{ $review[1] }}</p>
                        </div>
                    </div>
                </div>
                @endforeach
            </div>
        </div>
    </section>

    <!-- ========== CTA SECTION ========== -->
    <section class="py-24 relative overflow-hidden" style="background: linear-gradient(135deg, #4C1D95 0%, #7C3AED 100%);">
        <div class="absolute inset-0 opacity-10" style="background-image: linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px); background-size: 40px 40px;"></div>
        <div class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-3xl sm:text-5xl font-bold text-white mb-6">Ready to explore amazing events?</h2>
            <p class="text-purple-200 text-lg mb-8">Join over 50,000 users who trust EventHive for their event experiences.</p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                @auth
                    <a href="{{ route('dashboard') }}" class="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-primary-700 font-bold hover:bg-gray-100 transition-all duration-300 hover:-translate-y-0.5 shadow-xl">
                        Go to Dashboard →
                    </a>
                @else
                    <a href="{{ route('register') }}" class="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-primary-700 font-bold hover:bg-gray-100 transition-all duration-300 hover:-translate-y-0.5 shadow-xl">
                        Create Free Account →
                    </a>
                    <a href="{{ route('login') }}" class="btn-secondary px-8 py-4 border-white/40">
                        Sign In
                    </a>
                @endauth
            </div>
        </div>
    </section>

    <!-- ========== FOOTER ========== -->
    <footer class="bg-dark-50 border-t border-white/10 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <!-- Brand -->
                <div class="md:col-span-2">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z"/>
                            </svg>
                        </div>
                        <span class="text-xl font-bold text-white">Event<span class="text-primary-400">Hive</span></span>
                    </div>
                    <p class="text-gray-400 text-sm leading-relaxed max-w-xs">
                        Your ultimate platform for discovering, creating, and managing extraordinary events. Join the community today.
                    </p>
                    <!-- Social links -->
                    <div class="flex gap-3 mt-4">
                        @foreach(['instagram','twitter','facebook','youtube'] as $social)
                        <a href="#" class="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-primary-600/20 hover:text-primary-400 hover:border-primary-500/30 transition-all duration-200">
                            <span class="text-xs font-semibold uppercase">{{ strtoupper(substr($social, 0, 2)) }}</span>
                        </a>
                        @endforeach
                    </div>
                </div>

                <!-- Links -->
                <div>
                    <p class="text-white font-semibold text-sm mb-4">Platform</p>
                    <ul class="space-y-2">
                        @foreach(['Events','Tickets','Organizers','Pricing'] as $link)
                        <li><a href="#" class="text-gray-400 text-sm hover:text-primary-400 transition-colors">{{ $link }}</a></li>
                        @endforeach
                    </ul>
                </div>
                <div>
                    <p class="text-white font-semibold text-sm mb-4">Company</p>
                    <ul class="space-y-2">
                        @foreach(['About Us','Careers','Press','Contact'] as $link)
                        <li><a href="#" class="text-gray-400 text-sm hover:text-primary-400 transition-colors">{{ $link }}</a></li>
                        @endforeach
                    </ul>
                </div>
            </div>

            <div class="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
                <p class="text-gray-500 text-xs">© {{ date('Y') }} EventHive. All rights reserved.</p>
                <div class="flex gap-4">
                    <a href="#" class="text-gray-500 text-xs hover:text-gray-300 transition-colors">Privacy Policy</a>
                    <a href="#" class="text-gray-500 text-xs hover:text-gray-300 transition-colors">Terms of Service</a>
                </div>
            </div>
        </div>
    </footer>

    <script>
        // Navbar scroll effect
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Mobile menu toggle
        const menuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const menuIcon = document.getElementById('menu-icon');
        const closeIcon = document.getElementById('close-icon');

        menuBtn.addEventListener('click', () => {
            const isOpen = !mobileMenu.classList.contains('hidden');
            mobileMenu.classList.toggle('hidden');
            menuIcon.classList.toggle('hidden', !isOpen);
            closeIcon.classList.toggle('hidden', isOpen);
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // Close mobile menu if open
                    mobileMenu.classList.add('hidden');
                    menuIcon.classList.remove('hidden');
                    closeIcon.classList.add('hidden');
                }
            });
        });

        // Intersection observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-slide-up');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('section > div').forEach(el => observer.observe(el));
    </script>
</body>
</html>
