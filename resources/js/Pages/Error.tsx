import { Head, Link } from '@inertiajs/react';

interface ErrorProps {
    status: number;
}

const errorData: Record<number, { title: string; description: string; emoji: string }> = {
    400: {
        title: 'Bad Request',
        description: 'The server could not understand the request. Please check your input and try again.',
        emoji: '🚫',
    },
    401: {
        title: 'Unauthorized',
        description: 'You need to be authenticated to access this resource. Please log in and try again.',
        emoji: '🔐',
    },
    403: {
        title: 'Access Denied',
        description: "You don't have permission to access this resource. If you believe this is a mistake, contact support.",
        emoji: '⛔',
    },
    404: {
        title: 'Page Not Found',
        description: "The page you're looking for doesn't exist or has been moved. Let's get you back on track.",
        emoji: '🔍',
    },
    408: {
        title: 'Request Timeout',
        description: 'The server timed out waiting for the request. Please try refreshing the page.',
        emoji: '⏳',
    },
    419: {
        title: 'Session Expired',
        description: 'Your session has expired. Please refresh the page and try again.',
        emoji: '🕐',
    },
    429: {
        title: 'Too Many Requests',
        description: "You've sent too many requests in a short period. Please slow down and try again later.",
        emoji: '🛑',
    },
    500: {
        title: 'Server Error',
        description: "Something went wrong on our end. Our team has been notified. Please try again later.",
        emoji: '💥',
    },
    502: {
        title: 'Bad Gateway',
        description: 'The server received an invalid response from the upstream server. Please try again shortly.',
        emoji: '🌐',
    },
    503: {
        title: 'Service Unavailable',
        description: "We're currently down for maintenance. We'll be back shortly — hang tight!",
        emoji: '🔧',
    },
};

const fallbackError = {
    title: 'Something Went Wrong',
    description: 'An unexpected error occurred. Please try again or contact support if the issue persists.',
    emoji: '⚠️',
};

export default function Error({ status }: ErrorProps) {
    const { title, description, emoji } = errorData[status] || fallbackError;
    const isServerError = status >= 500;

    return (
        <div className="min-h-screen bg-navy-950 text-white selection:bg-primary-500/30 selection:text-primary-200 overflow-hidden relative flex items-center justify-center">
            <Head title={`${status} — ${title}`} />

            {/* Ambient background glows */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div
                    className={`absolute top-[-20%] left-[-15%] w-[50%] h-[50%] rounded-full blur-[160px] animate-pulse ${
                        isServerError
                            ? 'bg-red-600/20'
                            : 'bg-primary-600/20'
                    }`}
                    style={{ animationDuration: '4s' }}
                />
                <div
                    className={`absolute bottom-[-20%] right-[-15%] w-[60%] h-[60%] rounded-full blur-[180px] animate-pulse ${
                        isServerError
                            ? 'bg-orange-600/10'
                            : 'bg-secondary-600/10'
                    }`}
                    style={{ animationDuration: '5s', animationDelay: '1s' }}
                />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-2xl mx-auto px-6 py-16 text-center">
                {/* Decorative top bar */}
                <div className="flex items-center justify-center mb-10">
                    <div className={`h-px w-16 ${isServerError ? 'bg-red-500/40' : 'bg-primary-500/40'}`} />
                    <div className={`mx-4 inline-flex items-center space-x-2 px-4 py-2 rounded-full border backdrop-blur-md ${
                        isServerError
                            ? 'bg-red-500/10 border-red-500/20'
                            : 'bg-white/5 border-white/10'
                    }`}>
                        <span className={`flex h-2 w-2 rounded-full ${isServerError ? 'bg-red-400' : 'bg-secondary-400'}`} />
                        <span className={`text-xs font-bold uppercase tracking-widest ${isServerError ? 'text-red-300' : 'text-secondary-300'}`}>
                            {isServerError ? 'Server Error' : 'Client Error'}
                        </span>
                    </div>
                    <div className={`h-px w-16 ${isServerError ? 'bg-red-500/40' : 'bg-primary-500/40'}`} />
                </div>

                {/* Emoji */}
                <div className="text-7xl mb-6 animate-bounce" style={{ animationDuration: '2s' }}>
                    {emoji}
                </div>

                {/* Error Code */}
                <h1 className="text-[8rem] md:text-[10rem] font-black tracking-tighter leading-none italic mb-2 select-none">
                    <span className={`bg-gradient-to-r bg-clip-text text-transparent ${
                        isServerError
                            ? 'from-red-400 via-orange-300 to-red-500'
                            : 'from-primary-400 via-secondary-300 to-primary-500'
                    }`}>
                        {status}
                    </span>
                </h1>

                {/* Title */}
                <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase text-white mb-6">
                    {title}
                </h2>

                {/* Description */}
                <p className="text-lg text-slate-400 leading-relaxed max-w-lg mx-auto mb-12">
                    {description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="btn-primary px-10 py-4 w-full sm:w-auto"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                        <span className="font-black text-sm tracking-widest uppercase">Return Home</span>
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="px-10 py-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all w-full sm:w-auto cursor-pointer"
                    >
                        <span className="font-black text-sm tracking-widest uppercase text-slate-300">Go Back</span>
                    </button>
                </div>

                {/* Footer hint */}
                <div className="mt-16 flex items-center justify-center space-x-2 opacity-60">
                    <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-md flex items-center justify-center rotate-3">
                        <span className="text-white font-black text-[10px] italic">E</span>
                    </div>
                    <span className="text-xs font-black tracking-tighter italic text-slate-500 uppercase">EventHive</span>
                </div>
            </div>
        </div>
    );
}
