import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import Alert from '@/Components/Alert';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Join EventHive" />

            <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-white mb-2 italic tracking-tighter">CREATE ACCOUNT</h2>
                <div className="h-1 w-12 bg-primary-500 mx-auto rounded-full mb-4" />
                <p className="text-slate-400 text-sm">Join the community and explore premium events.</p>
            </div>

            <Alert 
                type="error" 
                message={Object.keys(errors).length > 0 ? (
                    <div className="space-y-1">
                        {Object.values(errors).map((error, i) => (
                            <p key={i}>{error}</p>
                        ))}
                    </div>
                ) : null} 
            />

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <label htmlFor="name" className="input-label">Full Name</label>
                    <input
                        id="name"
                        name="name"
                        value={data.name}
                        className="input-field"
                        autoComplete="name"
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoFocus
                    />
                </div>

                <div>
                    <label htmlFor="username" className="input-label">Username</label>
                    <div className="group relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold group-focus-within:text-primary-400 transition-colors">@</span>
                        <input
                            id="username"
                            name="username"
                            value={data.username}
                            className="input-field pl-9"
                            onChange={(e) => setData('username', e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="email" className="input-label">Email Address</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="input-field"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="password" className="input-label">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="input-field"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password_confirmation" className="input-label">Confirm</label>
                        <input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="input-field"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <button className="btn-primary w-full group py-4" disabled={processing}>
                        <span className="mr-2 uppercase font-black tracking-widest text-sm">Register Now</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                    
                    <p className="mt-8 text-center text-sm text-slate-500">
                        Already have an account?{' '}
                        <Link href={route('login')} className="text-primary-400 font-bold hover:underline transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
