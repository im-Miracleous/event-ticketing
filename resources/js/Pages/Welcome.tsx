import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }: PageProps) {
    return (
        <div className="min-h-screen bg-navy-950 text-white selection:bg-primary-500/30 selection:text-primary-200 overflow-x-hidden">
            <Head title="EventHive - Premium Ticketing Experience" />

            {/* Premium Background Elements */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-600/20 blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary-600/10 blur-[150px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
                <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] rounded-full bg-primary-900/10 blur-[100px]" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />
            </div>

            {/* Navigation */}
            <nav className="relative z-50 flex items-center justify-between px-6 py-8 mx-auto max-w-7xl">
                <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 rotate-3">
                        <span className="text-white font-black text-xl italic">E</span>
                    </div>
                    <span className="text-2xl font-black tracking-tighter italic text-white">EVENTHIVE</span>
                </div>

                <div className="flex items-center space-x-8">
                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="btn-primary px-6 py-2.5"
                        >
                            <span className="text-sm font-bold tracking-widest uppercase">Dashboard</span>
                        </Link>
                    ) : (
                        <>
                            <a
                                href={route('login')}
                                className="text-sm font-bold tracking-widest uppercase text-slate-300 hover:text-white transition-colors"
                            >
                                Sign In
                            </a>
                            <a
                                href={route('register')}
                                className="btn-primary px-8 py-3"
                            >
                                <span className="text-sm font-black tracking-widest uppercase text-white">Get Started</span>
                            </a>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 pt-20 pb-32 px-6 mx-auto max-w-7xl text-center">
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
                    <span className="flex h-2 w-2 rounded-full bg-secondary-400"></span>
                    <span className="text-xs font-bold uppercase tracking-widest text-secondary-300">New: Premium VIP Access</span>
                </div>

                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-none italic">
                    <span className="block">EVERY EVENT</span>
                    <span className="bg-gradient-to-r from-primary-400 via-secondary-300 to-primary-500 bg-clip-text text-transparent">ONE PLATFORM</span>
                </h1>

                <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-12 leading-relaxed">
                    Discover, book, and experience the world's most exclusive events. From underground concerts to elite tech summits, EventHive is your all-access pass to excellence.
                </p>

                <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
                    <a href={route('register')} className="btn-primary px-10 py-5 w-full md:w-auto text-white">
                        <span className="font-black text-sm tracking-widest uppercase">Explore Events</span>
                    </a>
                    <button className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all w-full md:w-auto">
                        <span className="font-black text-sm tracking-widest uppercase text-slate-300">How it works</span>
                    </button>
                </div>

                {/* Glassmorphism Stats */}
                <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Active Events', value: '1.2k+' },
                        { label: 'Tickets Sold', value: '850k+' },
                        { label: 'Verified Artists', value: '450+' },
                        { label: 'Global Cities', value: '120+' },
                    ].map((stat, i) => (
                        <div key={i} className="glass-card p-6 border-white/5 group hover:border-primary-500/30 transition-all">
                            <div className="text-3xl font-black text-white mb-1 group-hover:text-primary-400 transition-colors italic">{stat.value}</div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Section Preview */}
            <section className="relative z-10 py-32 bg-white/[0.02] border-y border-white/5">
                <div className="px-6 mx-auto max-w-7xl">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-16 px-2">
                        <div>
                            <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-4 text-white">TRENDING NOW</h2>
                            <p className="text-slate-400 max-w-md">The most anticipated experiences happening this weekend. Secure your spot before they're gone.</p>
                        </div>
                        <Link href="#" className="hidden md:flex items-center space-x-2 text-primary-400 font-bold uppercase tracking-widest text-sm hover:text-primary-300 transition-colors">
                            <span>View All Events</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Neon Nights Festival', location: 'Tokyo, Japan', date: 'DEC 15, 2026', img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30' },
                            { title: 'Global Tech Summit', location: 'San Francisco, CA', date: 'JAN 22, 2027', img: 'https://globalsummit.tech/assets/uploads/sites/8/2015/12/GTS-2021-Cover-4964x2792.jpg' },
                            { title: 'Vanguard Art Gala', location: 'Paris, France', date: 'FEB 04, 2027', img: 'https://hips.hearstapps.com/hmg-prod/images/1960f3ac-b094-467f-894c-9b30d40c93df.jpeg' },
                        ].map((event, i) => (
                            <div key={i} className="group cursor-pointer">
                                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl mb-6 ring-1 ring-white/10 group-hover:ring-primary-500/50 transition-all duration-500 shadow-2xl">
                                    <img src={event.img} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-90" />
                                    <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-navy-950 via-navy-950/80 to-transparent">
                                        <div className="text-xs font-bold text-secondary-400 uppercase tracking-widest mb-2">{event.date}</div>
                                        <h3 className="text-2xl font-black italic tracking-tighter text-white uppercase group-hover:text-primary-400 transition-colors leading-none">{event.title}</h3>
                                        <div className="mt-4 flex items-center text-xs text-slate-400 uppercase font-bold tracking-widest">
                                            <svg className="w-4 h-4 mr-1 text-primary-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
                                            {event.location}
                                        </div>
                                    </div>
                                    <div className="absolute top-6 right-6 h-12 w-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 py-32 px-6">
                <div className="max-w-5xl mx-auto glass-card p-12 md:p-24 text-center border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-500/10 blur-[100px]" />

                    <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white uppercase mb-8 leading-tight">
                        READY TO HIVE IN?
                    </h2>
                    <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
                        Experience events like never before. Secure, fast, and exclusive.
                    </p>
                    <a href={route('register')} className="btn-primary px-12 py-5 text-white inline-block">
                        <span className="font-black text-sm tracking-widest uppercase">Create Free Account</span>
                    </a>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-16 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center rotate-3">
                            <span className="text-white font-black text-sm italic">E</span>
                        </div>
                        <span className="text-xl font-black tracking-tighter italic text-white uppercase">EVENTHIVE</span>
                    </div>

                    <div className="flex space-x-8 text-xs font-bold uppercase tracking-widest text-slate-500">
                        <Link href="#" className="hover:text-primary-400 transition-colors">Discover</Link>
                        <Link href="#" className="hover:text-primary-400 transition-colors">Pricing</Link>
                        <Link href="#" className="hover:text-primary-400 transition-colors">Contact</Link>
                        <Link href="#" className="hover:text-primary-400 transition-colors">Privacy</Link>
                    </div>

                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
                        © 2026 EVENTHIVE PLATFORM. ALL RIGHTS RESERVED.
                    </div>
                </div>
            </footer>
        </div>
    );
}
