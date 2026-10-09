import React, { useState } from 'react';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import ToastNotification from '@/Components/ToastNotification';
import { Link, usePage, router } from '@inertiajs/react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const isAdmin = user?.role === 'admin';
    const isManager = user?.role === 'manager';
    const isStaff = user?.role === 'staff';

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'manager':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'staff':
                return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            default:
                return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased flex flex-col">
            {/* Top Navigation */}
            <nav className="bg-white border-b border-slate-200/80 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            {/* App Brand */}
                            <Link href="/" className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-600/20">
                                    W
                                </div>
                                <div className="leading-tight">
                                    <span className="font-extrabold text-slate-900 tracking-tight text-base block">
                                        WorkshopHub
                                    </span>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                                        Community Centre
                                    </span>
                                </div>
                            </Link>

                            {/* Main Nav Links */}
                            <div className="hidden sm:-my-px sm:ms-8 sm:flex space-x-4">
                                {isAdmin ? (
                                    <NavLink
                                        href={route('admin.users.index')}
                                        active={route().current('admin.users.*')}
                                    >
                                        Staff & User Management
                                    </NavLink>
                                ) : (
                                    <>
                                        <NavLink
                                            href={route('workshops.index')}
                                            active={route().current('workshops.index') || route().current('workshops.show')}
                                        >
                                            Workshops Catalogue
                                        </NavLink>

                                        {isManager && (
                                            <NavLink
                                                href={route('workshops.create')}
                                                active={route().current('workshops.create')}
                                            >
                                                + Add Workshop
                                            </NavLink>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Right Header items (User Dropdown) */}
                        <div className="hidden sm:flex sm:items-center sm:gap-3">
                            {/* User Profile Dropdown */}
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium text-slate-700 transition"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold uppercase">
                                            {user.name.charAt(0)}
                                        </div>
                                        <span>{user.name}</span>
                                        <span
                                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${getRoleColor(
                                                user.role
                                            )}`}
                                        >
                                            {user.role}
                                        </span>
                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <div className="px-4 py-2 border-b border-slate-100 text-xs">
                                        <p className="font-semibold text-slate-800">{user.name}</p>
                                        <p className="text-slate-400 truncate">{user.email}</p>
                                    </div>
                                    <Dropdown.Link href={route('profile.edit')}>
                                        Account Settings
                                    </Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        {/* Mobile hamburger menu */}
                        <div className="flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((prev) => !prev)}
                                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d={
                                            !showingNavigationDropdown
                                                ? 'M4 6h16M4 12h16M4 18h16'
                                                : 'M6 18L18 6M6 6l12 12'
                                        }
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Dropdown */}
                {showingNavigationDropdown && (
                    <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
                        {isAdmin ? (
                            <ResponsiveNavLink
                                href={route('admin.users.index')}
                                active={route().current('admin.users.*')}
                            >
                                Staff & User Management
                            </ResponsiveNavLink>
                        ) : (
                            <>
                                <ResponsiveNavLink
                                    href={route('workshops.index')}
                                    active={route().current('workshops.index')}
                                >
                                    Workshops Catalogue
                                </ResponsiveNavLink>
                                {isManager && (
                                    <ResponsiveNavLink
                                        href={route('workshops.create')}
                                        active={route().current('workshops.create')}
                                    >
                                        + Add Workshop
                                    </ResponsiveNavLink>
                                )}
                            </>
                        )}



                        <div className="pt-3 border-t border-slate-200">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile Settings
                            </ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                )}
            </nav>

            {/* Modern Floating Toast Notification */}
            <ToastNotification flash={flash} />

            {/* Page Header */}
            {header && (
                <header className="bg-white border-b border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Page Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200/80 py-4 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400">
                    Workshop Registration Service &bull; 3 Centre Locations (Downtown, North Wing, West Centre) &bull; Concurrency Protected
                </div>
            </footer>
        </div>
    );
}
