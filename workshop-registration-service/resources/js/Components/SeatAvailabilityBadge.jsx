import React from 'react';

export default function SeatAvailabilityBadge({ remainingSeats, capacity, isFull }) {
    if (isFull || remainingSeats <= 0) {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                FULL (0/{capacity} seats left)
            </span>
        );
    }

    if (remainingSeats <= 2) {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                Only {remainingSeats} {remainingSeats === 1 ? 'seat' : 'seats'} left!
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            {remainingSeats} of {capacity} seats available
        </span>
    );
}
