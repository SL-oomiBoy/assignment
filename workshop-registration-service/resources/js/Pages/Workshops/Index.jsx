import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import WorkshopFilters from '@/Components/WorkshopFilters';
import SeatAvailabilityBadge from '@/Components/SeatAvailabilityBadge';

export default function Index({ workshops, filters, locations, statuses }) {
    const user = usePage().props.auth.user;
    const isManager = user?.role === 'manager';

    const formatDateTime = (isoString) => {
        if (!isoString) return '';
        const d = new Date(isoString);
        return d.toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'scheduled':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'ongoing':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'completed':
                return 'bg-slate-100 text-slate-600 border-slate-200';
            case 'cancelled':
                return 'bg-rose-50 text-rose-700 border-rose-200';
            default:
                return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Workshops Catalogue
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Browse, search, and register attendees across all 3 centre locations.
                        </p>
                    </div>

                    {isManager && (
                        <Link
                            href={route('workshops.create')}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition shadow-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Add New Workshop
                        </Link>
                    )}
                </div>
            }
        >
            <Head title="Workshops" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Filters & Search */}
                    <WorkshopFilters
                        filters={filters}
                        locations={locations}
                        statuses={statuses}
                    />

                    {/* Workshops Grid */}
                    {workshops.data.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-base font-semibold text-slate-800">No workshops match your criteria</h3>
                            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                                Try clearing search filters or adjust date ranges to find scheduled workshops.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {workshops.data.map((workshop) => {
                                const percentFilled = Math.min(
                                    100,
                                    Math.round((workshop.active_registrations_count / workshop.capacity) * 100)
                                );

                                return (
                                    <div
                                        key={workshop.id}
                                        className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                                    >
                                        <div>
                                            {/* Top badges */}
                                            <div className="flex items-center justify-between gap-2 mb-3">
                                                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200">
                                                    {workshop.code}
                                                </span>
                                                <div className="flex items-center gap-1.5">
                                                    <span
                                                        className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getStatusBadge(
                                                            workshop.status
                                                        )}`}
                                                    >
                                                        {workshop.status.toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Title & Description */}
                                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                                <Link href={route('workshops.show', workshop.id)}>
                                                    {workshop.title}
                                                </Link>
                                            </h3>

                                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                                {workshop.description || 'No description provided.'}
                                            </p>

                                            {/* Details Metadata */}
                                            <div className="mt-4 space-y-2 text-xs text-slate-600">
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7 7z" />
                                                    </svg>
                                                    <span className="truncate">Instructor: <strong className="text-slate-700">{workshop.instructor}</strong></span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span className="font-medium text-slate-700">{workshop.location}</span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span>{formatDateTime(workshop.start_time)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Capacity & Actions */}
                                        <div className="mt-5 pt-4 border-t border-slate-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <SeatAvailabilityBadge
                                                    remainingSeats={workshop.remaining_seats}
                                                    capacity={workshop.capacity}
                                                    isFull={workshop.is_full}
                                                />
                                                <span className="text-xs text-slate-400">
                                                    {workshop.active_registrations_count} / {workshop.capacity}
                                                </span>
                                            </div>

                                            {/* Capacity Progress Bar */}
                                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-4">
                                                <div
                                                    className={`h-full transition-all duration-300 ${
                                                        workshop.is_full
                                                            ? 'bg-rose-500'
                                                            : percentFilled >= 80
                                                            ? 'bg-amber-500'
                                                            : 'bg-indigo-600'
                                                    }`}
                                                    style={{ width: `${percentFilled}%` }}
                                                ></div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={route('workshops.show', workshop.id)}
                                                    className="flex-1 text-center py-2 px-3 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 rounded-xl transition"
                                                >
                                                    View Details & Attendees
                                                </Link>

                                                {isManager && (
                                                    <Link
                                                        href={route('workshops.edit', workshop.id)}
                                                        className="py-2 px-3 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                                                    >
                                                        Edit
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {workshops.links && workshops.links.length > 3 && (
                        <div className="mt-8 flex justify-center gap-1">
                            {workshops.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    preserveScroll
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3.5 py-2 text-xs rounded-xl transition ${
                                        link.active
                                            ? 'bg-indigo-600 text-white font-semibold'
                                            : link.url
                                            ? 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
