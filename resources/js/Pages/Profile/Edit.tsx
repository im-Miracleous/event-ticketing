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

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile Settings</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your account information and security.</p>
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
