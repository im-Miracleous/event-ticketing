import DashboardLayout from '@/Layouts/DashboardLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <DashboardLayout>
            <Head title="Profile Settings" />

            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-500/20 rotate-3 flex-shrink-0">
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile Settings</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your account information and security.</p>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl space-y-6">
                <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 p-6 sm:p-8 shadow-sm dark:shadow-none">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                    />
                </div>

                <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 p-6 sm:p-8 shadow-sm dark:shadow-none">
                    <UpdatePasswordForm />
                </div>

                <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 p-6 sm:p-8 shadow-sm dark:shadow-none">
                    <DeleteUserForm />
                </div>
            </div>
        </DashboardLayout>
    );
}
