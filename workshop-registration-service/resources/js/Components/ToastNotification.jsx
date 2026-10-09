import React, { useState, useEffect } from 'react';

export default function ToastNotification({ flash }) {
    const [visible, setVisible] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (flash?.success) {
            setToast({ type: 'success', message: flash.success });
            setVisible(true);
        } else if (flash?.error) {
            setToast({ type: 'error', message: flash.error });
            setVisible(true);
        }
    }, [flash]);

    useEffect(() => {
        if (!visible) return;
        const timer = setTimeout(() => {
            setVisible(false);
        }, 4500);
        return () => clearTimeout(timer);
    }, [visible, toast]);

    if (!visible || !toast) return null;

    const isSuccess = toast.type === 'success';

    return (
        <div className="fixed top-5 right-5 z-50 max-w-sm w-[calc(100%-2.5rem)] sm:w-96 transition-all transform duration-300 ease-out">
            <div
                className={`p-4 rounded-2xl bg-white shadow-2xl border flex items-start gap-3.5 ${
                    isSuccess
                        ? 'border-emerald-200/90 shadow-emerald-500/10'
                        : 'border-rose-200/90 shadow-rose-500/10'
                }`}
            >
                <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSuccess
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : 'bg-rose-50 text-rose-600 border border-rose-100'
                    }`}
                >
                    {isSuccess ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    )}
                </div>

                <div className="flex-1 min-w-0 pt-0.5">
                    <h4
                        className={`text-[11px] font-extrabold uppercase tracking-wider ${
                            isSuccess ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                    >
                        {isSuccess ? 'Success' : 'Notice'}
                    </h4>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5 leading-snug break-words">
                        {toast.message}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setVisible(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition shrink-0"
                    title="Dismiss notification"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
