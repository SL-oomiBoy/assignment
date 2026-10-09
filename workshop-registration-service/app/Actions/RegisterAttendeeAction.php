<?php

namespace App\Actions;

use App\Models\Registration;
use App\Models\Workshop;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class RegisterAttendeeAction
{
    /**
     * Atomically register an attendee under pessimistic row locking
     * to prevent race conditions and over-registration.
     */
    public function execute(int $workshopId, array $data, int $staffUserId): Registration
    {
        return DB::transaction(function () use ($workshopId, $data, $staffUserId) {
            // 1. Lock workshop row to prevent concurrent race conditions
            $workshop = Workshop::where('id', $workshopId)->lockForUpdate()->firstOrFail();

            if (in_array($workshop->status, ['cancelled', 'completed'], true)) {
                throw ValidationException::withMessages([
                    'capacity' => "Registration failed: This workshop is currently marked as '{$workshop->status}'."
                ]);
            }

            // 2. Compute active registration count within the transaction lock
            $activeCount = $workshop->registrations()
                ->where('status', 'active')
                ->count();

            if ($activeCount >= $workshop->capacity) {
                throw ValidationException::withMessages([
                    'capacity' => 'Registration failed: This workshop has just reached its maximum capacity of ' . $workshop->capacity . ' seats.'
                ]);
            }

            // Check if this attendee email is already actively registered in this workshop
            $alreadyRegistered = $workshop->registrations()
                ->where('attendee_email', $data['attendee_email'])
                ->where('status', 'active')
                ->exists();

            if ($alreadyRegistered) {
                throw ValidationException::withMessages([
                    'attendee_email' => 'This attendee (' . $data['attendee_email'] . ') is already actively registered for this workshop.'
                ]);
            }

            // 3. Persist registration with complete audit data
            return $workshop->registrations()->create([
                'attendee_name' => $data['attendee_name'],
                'attendee_email' => $data['attendee_email'],
                'status' => 'active',
                'registered_by' => $staffUserId,
                'registered_at' => now(),
            ]);
        });
    }
}
