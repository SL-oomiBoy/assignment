<?php

namespace App\Policies;

use App\Models\Registration;
use App\Models\User;

class RegistrationPolicy
{
    /**
     * Determine whether the user can create registrations.
     * Managers and Staff only.
     */
    public function create(User $user): bool
    {
        return in_array($user->role, ['manager', 'staff'], true);
    }

    /**
     * Determine whether the user can cancel registrations.
     * Managers and Staff only.
     */
    public function cancel(User $user, Registration $registration): bool
    {
        return in_array($user->role, ['manager', 'staff'], true);
    }

    /**
     * Permanent deletion is forbidden to preserve audit history.
     */
    public function delete(User $user, Registration $registration): bool
    {
        return false;
    }
}
