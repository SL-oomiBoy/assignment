<?php

namespace App\Http\Controllers;

use App\Models\Workshop;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class WorkshopController extends Controller
{
    /**
     * Display a listing of workshops.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Workshop::class);

        $filters = $request->only(['search', 'status', 'location', 'date_from', 'date_to', 'available_only']);

        $workshops = Workshop::query()
            ->withCount(['registrations as active_registrations_count' => function ($q) {
                $q->where('status', 'active');
            }])
            ->filter($filters)
            ->orderBy('start_time', 'asc')
            ->paginate(9)
            ->withQueryString()
            ->through(function ($workshop) {
                return [
                    'id' => $workshop->id,
                    'code' => $workshop->code,
                    'title' => $workshop->title,
                    'description' => $workshop->description,
                    'instructor' => $workshop->instructor,
                    'location' => $workshop->location,
                    'start_time' => $workshop->start_time->toIso8601String(),
                    'end_time' => $workshop->end_time->toIso8601String(),
                    'capacity' => $workshop->capacity,
                    'status' => $workshop->status,
                    'active_registrations_count' => $workshop->active_registrations_count,
                    'remaining_seats' => max(0, $workshop->capacity - $workshop->active_registrations_count),
                    'is_full' => $workshop->active_registrations_count >= $workshop->capacity,
                ];
            });

        return Inertia::render('Workshops/Index', [
            'workshops' => $workshops,
            'filters' => $filters,
            'locations' => ['Downtown', 'North Wing', 'West Centre'],
            'statuses' => ['scheduled', 'ongoing', 'completed', 'cancelled'],
        ]);
    }

    /**
     * Show the form for creating a new workshop.
     */
    public function create(): Response
    {
        Gate::authorize('create', Workshop::class);

        return Inertia::render('Workshops/Form', [
            'workshop' => null,
            'locations' => ['Downtown', 'North Wing', 'West Centre'],
            'statuses' => ['scheduled', 'ongoing', 'completed', 'cancelled'],
        ]);
    }

    /**
     * Store a newly created workshop.
     */
    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('create', Workshop::class);

        $validated = $request->validate([
            'code' => ['required', 'string', 'max:50', 'unique:workshops,code'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'instructor' => ['required', 'string', 'max:255'],
            'location' => ['required', 'string', Rule::in(['Downtown', 'North Wing', 'West Centre'])],
            'start_time' => ['required', 'date'],
            'end_time' => ['required', 'date', 'after:start_time'],
            'capacity' => ['required', 'integer', 'min:1', 'max:1000'],
            'status' => ['required', 'string', Rule::in(['scheduled', 'ongoing', 'completed', 'cancelled'])],
        ]);

        $workshop = Workshop::create($validated);

        return redirect()->route('workshops.show', $workshop)
            ->with('success', "Workshop '{$workshop->title}' ({$workshop->code}) was created successfully.");
    }

    /**
     * Display the specified workshop with active attendees and cancelled audit trail.
     */
    public function show(Workshop $workshop): Response
    {
        Gate::authorize('view', $workshop);

        $workshop->loadCount(['registrations as active_registrations_count' => function ($q) {
            $q->where('status', 'active');
        }]);

        // Active attendees
        $activeRegistrations = $workshop->activeRegistrations()
            ->with(['registrar:id,name,email'])
            ->orderBy('registered_at', 'desc')
            ->get()
            ->map(function ($reg) {
                return [
                    'id' => $reg->id,
                    'attendee_name' => $reg->attendee_name,
                    'attendee_email' => $reg->attendee_email,
                    'status' => $reg->status,
                    'registered_at' => $reg->registered_at->toIso8601String(),
                    'registrar' => $reg->registrar ? [
                        'id' => $reg->registrar->id,
                        'name' => $reg->registrar->name,
                        'email' => $reg->registrar->email,
                    ] : null,
                ];
            });

        // Cancelled audit trail
        $cancelledRegistrations = $workshop->cancelledRegistrations()
            ->with(['registrar:id,name,email', 'canceller:id,name,email'])
            ->orderBy('cancelled_at', 'desc')
            ->get()
            ->map(function ($reg) {
                return [
                    'id' => $reg->id,
                    'attendee_name' => $reg->attendee_name,
                    'attendee_email' => $reg->attendee_email,
                    'status' => $reg->status,
                    'registered_at' => $reg->registered_at->toIso8601String(),
                    'cancelled_at' => $reg->cancelled_at?->toIso8601String(),
                    'cancellation_reason' => $reg->cancellation_reason,
                    'registrar' => $reg->registrar ? [
                        'id' => $reg->registrar->id,
                        'name' => $reg->registrar->name,
                        'email' => $reg->registrar->email,
                    ] : null,
                    'canceller' => $reg->canceller ? [
                        'id' => $reg->canceller->id,
                        'name' => $reg->canceller->name,
                        'email' => $reg->canceller->email,
                    ] : null,
                ];
            });

        $remainingSeats = max(0, $workshop->capacity - $workshop->active_registrations_count);

        return Inertia::render('Workshops/Show', [
            'workshop' => [
                'id' => $workshop->id,
                'code' => $workshop->code,
                'title' => $workshop->title,
                'description' => $workshop->description,
                'instructor' => $workshop->instructor,
                'location' => $workshop->location,
                'start_time' => $workshop->start_time->toIso8601String(),
                'end_time' => $workshop->end_time->toIso8601String(),
                'capacity' => $workshop->capacity,
                'status' => $workshop->status,
                'active_registrations_count' => $workshop->active_registrations_count,
                'remaining_seats' => $remainingSeats,
                'is_full' => $remainingSeats <= 0,
            ],
            'activeRegistrations' => $activeRegistrations,
            'cancelledRegistrations' => $cancelledRegistrations,
        ]);
    }

    /**
     * Show the form for editing the specified workshop.
     */
    public function edit(Workshop $workshop): Response
    {
        Gate::authorize('update', $workshop);

        return Inertia::render('Workshops/Form', [
            'workshop' => [
                'id' => $workshop->id,
                'code' => $workshop->code,
                'title' => $workshop->title,
                'description' => $workshop->description,
                'instructor' => $workshop->instructor,
                'location' => $workshop->location,
                'start_time' => $workshop->start_time->format('Y-m-d\TH:i'),
                'end_time' => $workshop->end_time->format('Y-m-d\TH:i'),
                'capacity' => $workshop->capacity,
                'status' => $workshop->status,
            ],
            'locations' => ['Downtown', 'North Wing', 'West Centre'],
            'statuses' => ['scheduled', 'ongoing', 'completed', 'cancelled'],
        ]);
    }

    /**
     * Update the specified workshop.
     */
    public function update(Request $request, Workshop $workshop): RedirectResponse
    {
        Gate::authorize('update', $workshop);

        $activeCount = $workshop->activeRegistrations()->count();

        $validated = $request->validate([
            'code' => ['required', 'string', 'max:50', Rule::unique('workshops', 'code')->ignore($workshop->id)],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'instructor' => ['required', 'string', 'max:255'],
            'location' => ['required', 'string', Rule::in(['Downtown', 'North Wing', 'West Centre'])],
            'start_time' => ['required', 'date'],
            'end_time' => ['required', 'date', 'after:start_time'],
            'capacity' => [
                'required',
                'integer',
                'min:1',
                'max:1000',
                function ($attribute, $value, $fail) use ($activeCount) {
                    if ($value < $activeCount) {
                        $fail("Capacity cannot be reduced to {$value} because there are currently {$activeCount} active registrations.");
                    }
                },
            ],
            'status' => ['required', 'string', Rule::in(['scheduled', 'ongoing', 'completed', 'cancelled'])],
        ]);

        $workshop->update($validated);

        return redirect()->route('workshops.show', $workshop)
            ->with('success', "Workshop '{$workshop->title}' has been updated.");
    }
}
