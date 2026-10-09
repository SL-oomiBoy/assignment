<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Workshop;

class WorkshopPolicy
{
    /**
     * Determine whether the user can view any workshops.
     * Managers and Staff only (Admins do not access operational workshops per RBAC matrix).
     */
    public function viewAny(User $user): bool
    {
        return in_array($user->role, ['manager', 'staff'], true);
    }

    /**
     * Determine whether the user can view the workshop.
     */
    public function view(User $user, Workshop $workshop): bool
    {
        return in_array($user->role, ['manager', 'staff'], true);
    }

    /**
     * Determine whether the user can create workshops.
     * Manager only.
     */
    public function create(User $user): bool
    {
        return $user->isManager();
    }

    /**
     * Determine whether the user can update the workshop.
     * Manager only.
     */
    public function update(User $user, Workshop $workshop): bool
    {
        return $user->isManager();
    }

    /**
     * Workshops should not be deleted to protect historical records.
     */
    public function delete(User $user, Workshop $workshop): bool
    {
        return false;
    }
}
