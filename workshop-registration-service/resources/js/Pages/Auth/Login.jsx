import React from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };
    return (
        <GuestLayout>
            <Head title="Staff Login — WorkshopHub" />

            <div className="mb-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-2xl mx-auto mb-3 shadow-md shadow-indigo-600/20">
                    W
                </div>
                <h1 className="text-xl font-bold text-slate-900">
                    Workshop Management Portal
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                    Sign in to manage workshop registrations & attendances
                </p>
            </div>

            {status && (
                <div className="mb-4 text-xs font-medium text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="email" value="Email Address" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full rounded-xl"
                        autoComplete="username"
                        placeholder="yourname@centre.test"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-1" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full rounded-xl"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-1" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2 text-xs text-slate-600">Remember me</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-xs text-indigo-600 hover:text-indigo-800 transition"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                <div className="pt-2">
                    <PrimaryButton
                        className="w-full justify-center py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-sm"
                        disabled={processing}
                    >
                        Sign in to Account
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
