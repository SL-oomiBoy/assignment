import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Form({ workshop, locations, statuses }) {
    const isEditing = Boolean(workshop?.id);

    const { data, setData, post, put, processing, errors } = useForm({
        code: workshop?.code || '',
        title: workshop?.title || '',
        description: workshop?.description || '',
        instructor: workshop?.instructor || '',
        location: workshop?.location || (locations[0] || 'Downtown'),
        start_time: workshop?.start_time || '',
        end_time: workshop?.end_time || '',
        capacity: workshop?.capacity || 15,
        status: workshop?.status || 'scheduled',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('workshops.update', workshop.id));
        } else {
            post(route('workshops.store'));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-3">
                    <Link
                        href={isEditing ? route('workshops.show', workshop.id) : route('workshops.index')}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                            {isEditing ? `Edit Workshop: ${workshop.title}` : 'Create New Workshop'}
                        </h2>
                        <p className="text-sm text-slate-500 mt-0.5">
                            {isEditing
                                ? 'Update workshop schedule, details, or seat capacity.'
                                : 'Define a new training session for community members.'}
                        </p>
                    </div>
                </div>
            }
        >
            <Head title={isEditing ? `Edit ${workshop.title}` : 'Create Workshop'} />

            <div className="py-8">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {/* Workshop Code */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Workshop Code <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                        placeholder="e.g. POT-101"
                                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                                    />
                                    {errors.code && (
                                        <p className="text-xs text-rose-600 mt-1">{errors.code}</p>
                                    )}
                                </div>

                                {/* Title */}
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Workshop Title <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="e.g. Pottery Basics & Wheel Throwing"
                                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                                    />
                                    {errors.title && (
                                        <p className="text-xs text-rose-600 mt-1">{errors.title}</p>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Description & Requirements
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Provide details about what attendees will learn, materials needed, etc."
                                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                                />
                                {errors.description && (
                                    <p className="text-xs text-rose-600 mt-1">{errors.description}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Instructor */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Lead Instructor <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={data.instructor}
                                        onChange={(e) => setData('instructor', e.target.value)}
                                        placeholder="e.g. Elena Vance"
                                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                                    />
                                    {errors.instructor && (
                                        <p className="text-xs text-rose-600 mt-1">{errors.instructor}</p>
                                    )}
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Centre Location <span className="text-rose-500">*</span>
                                    </label>
                                    <select
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                                    >
                                        {locations.map((loc) => (
                                            <option key={loc} value={loc}>
                                                {loc}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.location && (
                                        <p className="text-xs text-rose-600 mt-1">{errors.location}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Start Time */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Start Date & Time <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={data.start_time}
                                        onChange={(e) => setData('start_time', e.target.value)}
                                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                                    />
                                    {errors.start_time && (
                                        <p className="text-xs text-rose-600 mt-1">{errors.start_time}</p>
                                    )}
                                </div>

                                {/* End Time */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                        End Date & Time <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={data.end_time}
                                        onChange={(e) => setData('end_time', e.target.value)}
                                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                                    />
                                    {errors.end_time && (
                                        <p className="text-xs text-rose-600 mt-1">{errors.end_time}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Capacity */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Seat Capacity <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="1000"
                                        required
                                        value={data.capacity}
                                        onChange={(e) => setData('capacity', parseInt(e.target.value) || '')}
                                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                                    />
                                    {errors.capacity && (
                                        <p className="text-xs text-rose-600 mt-1">{errors.capacity}</p>
                                    )}
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                                        Workshop Status <span className="text-rose-500">*</span>
                                    </label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                                    >
                                        {statuses.map((s) => (
                                            <option key={s} value={s}>
                                                {s.charAt(0).toUpperCase() + s.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.status && (
                                        <p className="text-xs text-rose-600 mt-1">{errors.status}</p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-6 flex justify-end gap-3 border-t border-slate-100">
                                <Link
                                    href={isEditing ? route('workshops.show', workshop.id) : route('workshops.index')}
                                    className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition shadow-sm disabled:opacity-50"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving...
                                        </>
                                    ) : (
                                        isEditing ? 'Update Workshop' : 'Create Workshop'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
