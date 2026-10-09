<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class Workshop extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'title',
        'description',
        'instructor',
        'location',
        'start_time',
        'end_time',
        'capacity',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'start_time' => 'datetime',
            'end_time' => 'datetime',
            'capacity' => 'integer',
        ];
    }

    public function registrations(): HasMany
    {
        return $this->hasMany(Registration::class);
    }

    public function activeRegistrations(): HasMany
    {
        return $this->hasMany(Registration::class)->where('status', 'active');
    }

    public function cancelledRegistrations(): HasMany
    {
        return $this->hasMany(Registration::class)->where('status', 'cancelled');
    }

    public function getRemainingSeatsAttribute(): int
    {
        $activeCount = $this->relationLoaded('activeRegistrations')
            ? $this->activeRegistrations->count()
            : ($this->active_registrations_count ?? $this->activeRegistrations()->count());

        return max(0, $this->capacity - $activeCount);
    }

    public function getIsFullAttribute(): bool
    {
        return $this->remaining_seats <= 0;
    }

    /**
     * Scope query to apply search and filters
     */
    public function scopeFilter(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%")
                        ->orWhere('instructor', 'like', "%{$search}%")
                        ->orWhere('location', 'like', "%{$search}%");
                });
            })
            ->when($filters['status'] ?? null, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($filters['location'] ?? null, function ($query, $location) {
                $query->where('location', $location);
            })
            ->when($filters['date_from'] ?? null, function ($query, $dateFrom) {
                $query->where('start_time', '>=', $dateFrom);
            })
            ->when($filters['date_to'] ?? null, function ($query, $dateTo) {
                // If only date is provided, include through end of day
                $dateTo = strlen($dateTo) === 10 ? "{$dateTo} 23:59:59" : $dateTo;
                $query->where('start_time', '<=', $dateTo);
            })
            ->when($filters['available_only'] ?? false, function ($query) {
                $query->whereRaw(
                    '(SELECT COUNT(*) FROM registrations WHERE registrations.workshop_id = workshops.id AND registrations.status = ?) < workshops.capacity',
                    ['active']
                );
            });
    }
}
