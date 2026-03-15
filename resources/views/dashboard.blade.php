<x-app-layout>
    <x-slot name="header">
        <div>
            <p class="text-xs text-gray-400 font-medium">Welcome back,</p>
            <h2 class="text-xl font-bold text-gray-800">{{ Auth::user()->name ?? 'Admin' }} 👋</h2>
        </div>
    </x-slot>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        @foreach([
            ['Total Events','128','📅','from-primary-500 to-primary-700','↑ 12% this month','text-green-500'],
            ['Active Tickets','3,842','🎟️','from-secondary-500 to-secondary-600','↑ 8% this month','text-green-500'],
            ['Total Users','50,291','👥','from-blue-500 to-blue-700','↑ 23% this month','text-green-500'],
            ['Revenue','Rp 124M','💰','from-green-500 to-emerald-700','↑ 18% this month','text-green-500'],
        ] as $stat)
        <div class="card p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
            <!-- Gradient background accent -->
            <div class="absolute top-0 right-0 w-24 h-24 rounded-bl-3xl bg-gradient-to-br {{ $stat[2] }} opacity-5 group-hover:opacity-10 transition-opacity duration-300"
                 style="background: linear-gradient(135deg, {{ $loop->index == 0 ? '#7C3AED' : ($loop->index == 1 ? '#EF4444' : ($loop->index == 2 ? '#3B82F6' : '#10B981')) }}, transparent);"></div>

            <div class="flex items-start justify-between mb-4">
                <div>
                    <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{{ $stat[0] }}</p>
                    <p class="text-2xl font-bold text-gray-900">{{ $stat[1] }}</p>
                </div>
                <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br {{ $stat[2] }} text-xl shadow-lg">
                    {{ $stat[1][0] === 'R' ? '💰' : $stat[2] }}
                    <span class="text-xl">{{ $stat[1] === '128' ? '📅' : ($stat[1] === '3,842' ? '🎟️' : ($stat[1] === '50,291' ? '👥' : '💰')) }}</span>
                </div>
            </div>
            <p class="{{ $stat[5] }} text-xs font-semibold">{{ $stat[4] }}</p>
        </div>
        @endforeach
    </div>

    {{-- Better stat cards using manual loop --}}

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- Recent Events Table -->
        <div class="lg:col-span-2 card overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 class="font-semibold text-gray-800 text-base">Recent Events</h3>
                <a href="#" class="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors">View all →</a>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="bg-gray-50">
                            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Event</th>
                            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tickets</th>
                            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        @foreach([
                            ['Jakarta Music Festival','Mar 28–30','1,240 / 2,000','Active','badge-primary'],
                            ['Tech Summit Indonesia','Apr 5','320 / 500','Active','badge-primary'],
                            ['Bali Art & Culture Expo','Apr 12–14','890 / 1,500','Active','badge-primary'],
                            ['Startup Pitching Night','Apr 8','150 / 200','Sold Out','badge-danger'],
                            ['Culinary Festival Bandung','Apr 20–21','450 / 1,000','Active','badge-primary'],
                        ] as $event)
                        <tr class="hover:bg-gray-50 transition-colors duration-150">
                            <td class="px-6 py-4">
                                <p class="font-semibold text-gray-800 text-sm">{{ $event[0] }}</p>
                            </td>
                            <td class="px-6 py-4 text-gray-500 text-sm">{{ $event[1] }}</td>
                            <td class="px-6 py-4">
                                <div class="flex flex-col gap-1">
                                    <span class="text-gray-700 text-xs font-medium">{{ $event[2] }}</span>
                                    @php
                                        [$sold, $total] = explode(' / ', $event[2]);
                                        $pct = min(100, round((int)str_replace(',','', $sold) / (int)str_replace(',','', $total) * 100));
                                    @endphp
                                    <div class="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <div class="h-full bg-primary-500 rounded-full" style="width: {{ $pct }}%"></div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <span class="{{ $event[4] }} text-xs">{{ $event[3] }}</span>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Quick Stats / Activity sidebar -->
        <div class="space-y-5">
            <!-- Quick Actions -->
            <div class="card p-6">
                <h3 class="font-semibold text-gray-800 text-base mb-4">Quick Actions</h3>
                <div class="space-y-3">
                    @foreach([
                        ['➕ Create New Event','btn-primary w-full justify-start gap-2 text-sm py-2.5'],
                        ['🎟️ Manage Tickets','border border-primary-200 text-primary-700 hover:bg-primary-50 transition-colors w-full text-left py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center gap-2'],
                        ['📊 View Reports','border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors w-full text-left py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center gap-2'],
                    ] as $action)
                    <button class="{{ $action[1] }}">{{ $action[0] }}</button>
                    @endforeach
                </div>
            </div>

            <!-- Ticket Sales Donut placeholder -->
            <div class="card p-6">
                <h3 class="font-semibold text-gray-800 text-base mb-4">Ticket Sales</h3>
                <!-- Visual donut chart using CSS -->
                <div class="flex justify-center mb-4">
                    <div class="relative w-28 h-28">
                        <svg viewBox="0 0 36 36" class="w-28 h-28 -rotate-90">
                            <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#F3F4F6" stroke-width="3.5"/>
                            <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#7C3AED" stroke-width="3.5"
                                    stroke-dasharray="62 38" stroke-linecap="round"/>
                            <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#EF4444" stroke-width="3.5"
                                    stroke-dasharray="25 75" stroke-dashoffset="-62" stroke-linecap="round"/>
                            <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#3B82F6" stroke-width="3.5"
                                    stroke-dasharray="13 87" stroke-dashoffset="-87" stroke-linecap="round"/>
                        </svg>
                        <div class="absolute inset-0 flex items-center justify-center flex-col">
                            <span class="text-xl font-bold text-gray-800">62%</span>
                            <span class="text-xs text-gray-400">Sold</span>
                        </div>
                    </div>
                </div>
                <div class="space-y-2">
                    @foreach([
                        ['Music','62%','bg-primary-500'],
                        ['Tech','25%','bg-secondary-500'],
                        ['Arts','13%','bg-blue-500'],
                    ] as $cat)
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <div class="w-2.5 h-2.5 rounded-full {{ $cat[2] }}"></div>
                            <span class="text-xs text-gray-600">{{ $cat[0] }}</span>
                        </div>
                        <span class="text-xs font-semibold text-gray-700">{{ $cat[1] }}</span>
                    </div>
                    @endforeach
                </div>
            </div>

            <!-- Recent users -->
            <div class="card p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="font-semibold text-gray-800 text-base">New Users</h3>
                    <a href="#" class="text-xs text-primary-600 hover:text-primary-700 font-medium">View all →</a>
                </div>
                <div class="space-y-3">
                    @foreach([
                        ['Adi Putra','Event Organizer','AP'],
                        ['Sari Wulandari','Music Fan','SW'],
                        ['Budi Santoso','Tech Enthusiast','BS'],
                    ] as $user)
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                            {{ $user[2] }}
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-semibold text-gray-800 truncate">{{ $user[0] }}</p>
                            <p class="text-xs text-gray-400 truncate">{{ $user[1] }}</p>
                        </div>
                        <span class="badge-success text-xs">New</span>
                    </div>
                    @endforeach
                </div>
            </div>
        </div>
    </div>

    <!-- Revenue Chart placeholder -->
    <div class="card p-6">
        <div class="flex items-center justify-between mb-6">
            <div>
                <h3 class="font-semibold text-gray-800 text-base">Revenue Overview</h3>
                <p class="text-xs text-gray-400 mt-0.5">Monthly revenue for 2026</p>
            </div>
            <div class="flex items-center gap-2">
                @foreach(['1W','1M','3M','1Y'] as $period)
                <button class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                    {{ $loop->index === 1 ? 'bg-primary-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100' }}">
                    {{ $period }}
                </button>
                @endforeach
            </div>
        </div>
        <!-- Bar chart using inline styles -->
        <div class="flex items-end gap-3 h-40">
            @php
                $values = [40, 65, 48, 72, 55, 90, 78, 82, 60, 95, 70, 88];
                $months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            @endphp
            @foreach($values as $i => $val)
            <div class="flex-1 flex flex-col items-center gap-2">
                <div class="w-full rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer"
                     style="height: {{ $val }}%; background: linear-gradient(180deg, #7C3AED, #4C1D95);"
                     title="Rp {{ $val * 1.24 }}M"></div>
                <span class="text-xs text-gray-400">{{ $months[$i] }}</span>
            </div>
            @endforeach
        </div>
    </div>
</x-app-layout>
