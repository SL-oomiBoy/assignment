import React from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';

export default function RegisterAttendeeModal({ show, onClose, workshop }) {
    if (!workshop) return null;

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        attendee_name: '',
        attendee_email: '',
    });

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('registrations.store', workshop.id), {
            preserveScroll: true,
            onSuccess: () => {
                handleClose();
            },
        });
    };

    return (
        <Modal show={show} onClose={handleClose} maxWidth="md">
            <div className="p-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">
                            Register Attendee
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {workshop.title} ({workshop.code})
                        </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {workshop.remaining_seats} seats left
                    </span>
                </div>

                {errors.capacity && (
                    <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2">
                        <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span>{errors.capacity}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                            Attendee Full Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={data.attendee_name}
                            onChange={(e) => setData('attendee_name', e.target.value)}
                            placeholder="e.g. Jane Doe"
                            className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                        />
                        {errors.attendee_name && (
                            <p className="text-xs text-rose-600 mt-1">{errors.attendee_name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                            Attendee Email Address <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="email"
                            required
                            value={data.attendee_email}
                            onChange={(e) => setData('attendee_email', e.target.value)}
                            placeholder="e.g. jane.doe@example.com"
                            className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                        />
                        {errors.attendee_email && (
                            <p className="text-xs text-rose-600 mt-1">{errors.attendee_email}</p>
                        )}
                    </div>

                    <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={processing}
                            className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition shadow-sm disabled:opacity-50"
                        >
                            {processing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Registering...
                                </>
                            ) : (
                                'Confirm Registration'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
