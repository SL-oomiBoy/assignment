import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import SeatAvailabilityBadge from '@/Components/SeatAvailabilityBadge';
import RegisterAttendeeModal from '@/Components/RegisterAttendeeModal';
import RegistrationHistory from '@/Components/RegistrationHistory';

export default function Show({ workshop, activeRegistrations, cancelledRegistrations }) {
    const user = usePage().props.auth.user;
    const isManager = user?.role === 'manager';
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    const formatDateTime = (isoString) => {
        if (!isoString) return '';
        const d = new Date(isoString);
        return d.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const isAvailableForBooking =
        workshop.remaining_seats > 0 &&
        workshop.status === 'scheduled';

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('workshops.index')}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
                            title="Back to Workshops"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                    {workshop.code}
                                </span>
                                <span className="text-xs uppercase font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                    {workshop.status}
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mt-1">
                                {workshop.title}
                            </h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {isManager && (
                            <Link
                                href={route('workshops.edit', workshop.id)}
                                className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition shadow-sm"
                            >
                                Edit Workshop
                            </Link>
                        )}

                        <button
                            type="button"
                            onClick={() => setShowRegisterModal(true)}
                            disabled={!isAvailableForBooking}
                            className={`inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl transition shadow-sm ${
                                isAvailableForBooking
                                    ? 'text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
                                    : 'text-slate-400 bg-slate-200 cursor-not-allowed'
                            }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                            {isAvailableForBooking ? 'Register Attendee' : workshop.is_full ? 'Workshop Full' : 'Registration Closed'}
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`${workshop.title} (${workshop.code})`} />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Top Overview Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Workshop Info */}
                        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                Workshop Information
                            </h3>
                            <p className="text-sm text-slate-700 leading-relaxed">
                                {workshop.description || 'No detailed description available.'}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 text-xs">
                                <div>
                                    <span className="text-slate-400 block font-medium">Instructor</span>
                                    <span className="text-slate-800 font-semibold text-sm mt-0.5 block">
                                        {workshop.instructor}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-slate-400 block font-medium">Centre Location</span>
                                    <span className="text-slate-800 font-semibold text-sm mt-0.5 block">
                                        {workshop.location}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-slate-400 block font-medium">Schedule</span>
                                    <span className="text-slate-800 font-semibold text-sm mt-0.5 block">
                                        {formatDateTime(workshop.start_time)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Real-time Seat Monitor */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                    Capacity & Availability
                                </h3>

                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-3xl font-extrabold text-slate-900">
                                        {workshop.remaining_seats}
                                    </span>
                                    <span className="text-sm text-slate-500 font-medium">
                                        seats remaining of {workshop.capacity}
                                    </span>
                                </div>

                                <div className="mt-3">
                                    <SeatAvailabilityBadge
                                        remainingSeats={workshop.remaining_seats}
                                        capacity={workshop.capacity}
                                        isFull={workshop.is_full}
                                    />
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100">
                                <div className="flex justify-between text-xs text-slate-500 mb-1.5 font-medium">
                                    <span>Occupancy</span>
                                    <span>{workshop.active_registrations_count} / {workshop.capacity} attendees</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-300 ${
                                            workshop.is_full
                                                ? 'bg-rose-500'
                                                : workshop.remaining_seats <= 2
                                                ? 'bg-amber-500'
                                                : 'bg-emerald-500'
                                        }`}
                                        style={{
                                            width: `${Math.min(
                                                100,
                                                (workshop.active_registrations_count / workshop.capacity) * 100
                                            )}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Registrations & Cancellation Audit Trail */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">
                                    Attendee Roster & Audit History
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Registrations and cancellations are permanently recorded for audit compliance.
                                </p>
                            </div>
                        </div>

                        <RegistrationHistory
                            activeRegistrations={activeRegistrations}
                            cancelledRegistrations={cancelledRegistrations}
                            canManage={workshop.status === 'scheduled'}
                        />
                    </div>
                </div>
            </div>

            {/* Registration Modal */}
            <RegisterAttendeeModal
                show={showRegisterModal}
                onClose={() => setShowRegisterModal(false)}
                workshop={workshop}
            />
        </AuthenticatedLayout>
    );
}
