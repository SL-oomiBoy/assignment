<?php

namespace App\Http\Controllers;

use App\Actions\CancelRegistrationAction;
use App\Actions\RegisterAttendeeAction;
use App\Models\Registration;
use App\Models\Workshop;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class RegistrationController extends Controller
{
    /**
     * Register a new attendee for a workshop.
     */
    public function store(Request $request, Workshop $workshop, RegisterAttendeeAction $action): RedirectResponse
    {
        Gate::authorize('create', Registration::class);

        $validated = $request->validate([
            'attendee_name' => ['required', 'string', 'max:255'],
            'attendee_email' => ['required', 'email', 'max:255'],
        ]);

        $registration = $action->execute(
            workshopId: $workshop->id,
            data: $validated,
            staffUserId: $request->user()->id
        );

        return back()->with('success', "Successfully registered {$registration->attendee_name} for {$workshop->title}!");
    }

    /**
     * Cancel an attendee registration with audit reason and staff tracking.
     */
    public function cancel(Request $request, Registration $registration, CancelRegistrationAction $action): RedirectResponse
    {
        Gate::authorize('cancel', $registration);

        $validated = $request->validate([
            'cancellation_reason' => ['nullable', 'string', 'max:1000'],
        ]);

        $action->execute(
            registrationId: $registration->id,
            reason: $validated['cancellation_reason'] ?? null,
            staffUserId: $request->user()->id
        );

        return back()->with('success', "Registration for {$registration->attendee_name} has been cancelled.");
    }
}
