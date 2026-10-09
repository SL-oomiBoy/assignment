<?php

namespace App\Actions;

use App\Models\Registration;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CancelRegistrationAction
{
    /**
     * Atomically cancel a registration with audit trail
     */
    public function execute(int $registrationId, ?string $reason, int $staffUserId): Registration
    {
        return DB::transaction(function () use ($registrationId, $reason, $staffUserId) {
            $registration = Registration::where('id', $registrationId)->lockForUpdate()->firstOrFail();

            if ($registration->status === 'cancelled') {
                throw ValidationException::withMessages([
                    'registration' => 'This registration is already marked as cancelled.',
                ]);
            }

            $registration->update([
                'status' => 'cancelled',
                'cancelled_by' => $staffUserId,
                'cancelled_at' => now(),
                'cancellation_reason' => $reason,
            ]);

            return $registration;
        });
    }
}
