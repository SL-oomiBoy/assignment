import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function WorkshopFilters({ filters = {}, locations = [], statuses = [] }) {
    const [search, setSearch] = useState(filters.search || '');
    const [location, setLocation] = useState(filters.location || '');
    const [status, setStatus] = useState(filters.status || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [availableOnly, setAvailableOnly] = useState(
        filters.available_only === '1' || filters.available_only === true || filters.available_only === 'true'
    );

    const applyFilters = (newFilters = {}) => {
        const query = {
            search: newFilters.search !== undefined ? newFilters.search : search,
            location: newFilters.location !== undefined ? newFilters.location : location,
            status: newFilters.status !== undefined ? newFilters.status : status,
            date_from: newFilters.date_from !== undefined ? newFilters.date_from : dateFrom,
            date_to: newFilters.date_to !== undefined ? newFilters.date_to : dateTo,
            available_only: newFilters.available_only !== undefined ? newFilters.available_only : (availableOnly ? '1' : ''),
        };

        // Remove empty keys
        Object.keys(query).forEach((key) => {
            if (!query[key]) {
                delete query[key];
            }
        });

        router.get(route('workshops.index'), query, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleReset = () => {
        setSearch('');
        setLocation('');
        setStatus('');
        setDateFrom('');
        setDateTo('');
        setAvailableOnly(false);
        router.get(route('workshops.index'), {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const hasActiveFilters = Boolean(
        search || location || status || dateFrom || dateTo || availableOnly
    );

    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div className="lg:col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                        Search Workshops
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilters({ search: e.target.value })}
                            placeholder="Search by title, code (e.g. POT-101), instructor..."
                            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder-slate-400"
                        />
                        <svg
                            className="w-4 h-4 text-slate-400 absolute left-3.5 top-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Location Filter */}
                <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                        Location
                    </label>
                    <select
                        value={location}
                        onChange={(e) => {
                            setLocation(e.target.value);
                            applyFilters({ location: e.target.value });
                        }}
                        className="w-full py-2 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                    >
                        <option value="">All Locations</option>
                        {locations.map((loc) => (
                            <option key={loc} value={loc}>
                                {loc}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Status Filter */}
                <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                        Status
                    </label>
                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            applyFilters({ status: e.target.value });
                        }}
                        className="w-full py-2 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                    >
                        <option value="">All Statuses</option>
                        {statuses.map((s) => (
                            <option key={s} value={s}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Date Range & Availability Toggle */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-100 items-end">
                <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                        From Date
                    </label>
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => {
                            setDateFrom(e.target.value);
                            applyFilters({ date_from: e.target.value });
                        }}
                        className="w-full py-2 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                        To Date
                    </label>
                    <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => {
                            setDateTo(e.target.value);
                            applyFilters({ date_to: e.target.value });
                        }}
                        className="w-full py-2 px-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                    />
                </div>

                <div className="flex items-center h-10">
                    <label className="inline-flex items-center cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={availableOnly}
                            onChange={(e) => {
                                const checked = e.target.checked;
                                setAvailableOnly(checked);
                                applyFilters({ available_only: checked ? '1' : '' });
                            }}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 relative"></div>
                        <span className="ms-3 text-sm font-medium text-slate-700">
                            Available seats only
                        </span>
                    </label>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => applyFilters()}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition shadow-sm"
                    >
                        Apply Filters
                    </button>
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={handleReset}
                            className="px-3 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                        >
                            Reset
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
