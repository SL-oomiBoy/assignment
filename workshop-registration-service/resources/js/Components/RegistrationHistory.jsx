import React, { useState } from 'react';
import CancelModal from '@/Components/CancelModal';

export default function RegistrationHistory({ activeRegistrations = [], cancelledRegistrations = [], canManage = true }) {
    const [activeTab, setActiveTab] = useState('active');
    const [selectedRegistrationForCancel, setSelectedRegistrationForCancel] = useState(null);

    const formatDate = (isoString) => {
        if (!isoString) return '—';
        const d = new Date(isoString);
        return d.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
            {/* Tab navigation */}
            <div className="flex items-center border-b border-slate-200 bg-slate-50/70 px-6 pt-3">
                <button
                    type="button"
                    onClick={() => setActiveTab('active')}
                    className={`pb-3 px-4 font-semibold text-sm border-b-2 transition-all flex items-center gap-2 ${
                        activeTab === 'active'
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                >
                    <span>Active Attendees</span>
                    <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                            activeTab === 'active'
                                ? 'bg-indigo-100 text-indigo-700'
                                : 'bg-slate-200/80 text-slate-600'
                        }`}
                    >
                        {activeRegistrations.length}
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab('cancelled')}
                    className={`pb-3 px-4 font-semibold text-sm border-b-2 transition-all flex items-center gap-2 ${
                        activeTab === 'cancelled'
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                >
                    <span>Cancellation Audit Trail</span>
                    <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                            activeTab === 'cancelled'
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-slate-200/80 text-slate-600'
                        }`}
                    >
                        {cancelledRegistrations.length}
                    </span>
                </button>
            </div>

            {/* Tab 1: Active Attendees */}
            {activeTab === 'active' && (
                <div className="p-6">
                    {activeRegistrations.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <h4 className="text-sm font-semibold text-slate-800">No active registrations yet</h4>
                            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                                Register the first attendee using the button above to secure a seat.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        <th className="pb-3 pr-4">Attendee</th>
                                        <th className="pb-3 px-4">Contact</th>
                                        <th className="pb-3 px-4">Registered By</th>
                                        <th className="pb-3 px-4">Registered At</th>
                                        {canManage && <th className="pb-3 pl-4 text-right">Actions</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {activeRegistrations.map((reg) => (
                                        <tr key={reg.id} className="hover:bg-slate-50/60 transition">
                                            <td className="py-3.5 pr-4">
                                                <div className="font-semibold text-slate-800">
                                                    {reg.attendee_name}
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-600">
                                                <span className="text-xs bg-slate-100 px-2 py-1 rounded-md">
                                                    {reg.attendee_email}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 bg-indigo-50/80 border border-indigo-100 px-2.5 py-1 rounded-lg">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                                    {reg.registrar?.name || 'Former Staff Member'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-xs text-slate-500">
                                                {formatDate(reg.registered_at)}
                                            </td>
                                            {canManage && (
                                                <td className="py-3.5 pl-4 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedRegistrationForCancel(reg)}
                                                        className="px-3 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition"
                                                    >
                                                        Cancel Booking
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Tab 2: Cancellation Audit Trail */}
            {activeTab === 'cancelled' && (
                <div className="p-6">
                    {cancelledRegistrations.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h4 className="text-sm font-semibold text-slate-800">No cancellations recorded</h4>
                            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                                All registrations for this workshop remain active.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                        <th className="pb-3 pr-4">Attendee</th>
                                        <th className="pb-3 px-4">Initially Registered</th>
                                        <th className="pb-3 px-4">Cancelled By</th>
                                        <th className="pb-3 px-4">Cancelled At</th>
                                        <th className="pb-3 pl-4">Audit Reason</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {cancelledRegistrations.map((reg) => (
                                        <tr key={reg.id} className="hover:bg-slate-50/60 transition">
                                            <td className="py-3.5 pr-4">
                                                <div className="font-semibold text-slate-800 line-through decoration-slate-400">
                                                    {reg.attendee_name}
                                                </div>
                                                <div className="text-xs text-slate-400">
                                                    {reg.attendee_email}
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 text-xs text-slate-500">
                                                <div>{formatDate(reg.registered_at)}</div>
                                                <div className="text-[11px] text-slate-400">
                                                    by {reg.registrar?.name || 'Former Staff Member'}
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="inline-flex items-center gap-1.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                                    {reg.canceller?.name || 'Former Staff Member'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-xs text-slate-500">
                                                {formatDate(reg.cancelled_at)}
                                            </td>
                                            <td className="py-3.5 pl-4">
                                                {reg.cancellation_reason ? (
                                                    <span className="text-xs text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg italic">
                                                        "{reg.cancellation_reason}"
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">No reason provided</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Cancel Modal */}
            <CancelModal
                show={Boolean(selectedRegistrationForCancel)}
                onClose={() => setSelectedRegistrationForCancel(null)}
                registration={selectedRegistrationForCancel}
            />
        </div>
    );
}
