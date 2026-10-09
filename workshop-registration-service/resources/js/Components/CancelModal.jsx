import React from 'react';
import { useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';

export default function CancelModal({ show, onClose, registration }) {
    if (!registration) return null;

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        cancellation_reason: '',
    });

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    const handleCancelSubmit = (e) => {
        e.preventDefault();
        post(route('registrations.cancel', registration.id), {
            preserveScroll: true,
            onSuccess: () => {
                handleClose();
            },
        });
    };

    return (
        <Modal show={show} onClose={handleClose} maxWidth="md">
            <div className="p-6">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">
                            Cancel Registration
                        </h3>
                        <p className="text-xs text-slate-500">
                            This will free up 1 seat in the workshop.
                        </p>
                    </div>
                </div>

                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <p><span className="font-semibold text-slate-700">Attendee:</span> {registration.attendee_name}</p>
                    <p><span className="font-semibold text-slate-700">Email:</span> {registration.attendee_email}</p>
                </div>

                <form onSubmit={handleCancelSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                            Reason for Cancellation <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <textarea
                            rows={3}
                            value={data.cancellation_reason}
                            onChange={(e) => setData('cancellation_reason', e.target.value)}
                            placeholder="e.g. Schedule conflict, illness, duplicate entry..."
                            className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-slate-800"
                        />
                        {errors.cancellation_reason && (
                            <p className="text-xs text-rose-600 mt-1">{errors.cancellation_reason}</p>
                        )}
                    </div>

                    <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={processing}
                            className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl transition shadow-sm disabled:opacity-50"
                        >
                            {processing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                'Confirm Cancellation'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
