<?php

namespace Tests\Feature;

use App\Models\Registration;
use App\Models\User;
use App\Models\Workshop;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_user_management_screen(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->get(route('admin.users.index'));

        $response->assertOk();
    }

    public function test_admin_cannot_delete_their_own_account(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->delete(route('admin.users.destroy', $admin));

        $response->assertForbidden();
        $this->assertDatabaseHas('users', ['id' => $admin->id]);
    }

    public function test_admin_can_delete_staff_with_associated_registrations(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $staff = User::factory()->create(['role' => 'staff', 'name' => 'John Miller']);

        $workshop = Workshop::create([
            'title' => 'Woodworking 101',
            'code' => 'WS-101',
            'instructor' => 'Jane Doe',
            'location' => 'Room A',
            'description' => 'Basics of woodworking',
            'start_time' => now()->addDays(5),
            'end_time' => now()->addDays(5)->addHours(2),
            'capacity' => 10,
        ]);

        $registration = Registration::create([
            'workshop_id' => $workshop->id,
            'attendee_name' => 'Alice Walker',
            'attendee_email' => 'alice@example.com',
            'status' => 'active',
            'registered_by' => $staff->id,
            'registered_at' => now(),
        ]);

        $response = $this->actingAs($admin)->delete(route('admin.users.destroy', $staff));

        $response->assertSessionHas('success');
        $this->assertDatabaseMissing('users', ['id' => $staff->id]);

        // Registration still exists, and registered_by is null
        $registration->refresh();
        $this->assertNull($registration->registered_by);
        $this->assertEquals('Alice Walker', $registration->attendee_name);
    }

    public function test_admin_can_delete_seeded_john_miller(): void
    {
        $this->seed();
        $admin = User::where('email', 'admin@centre.test')->first();
        $john = User::where('email', 'john.staff@centre.test')->first();

        $this->assertNotNull($john);

        $response = $this->actingAs($admin)->delete(route('admin.users.destroy', $john));

        $response->assertSessionHas('success');
        $this->assertDatabaseMissing('users', ['email' => 'john.staff@centre.test']);
    }
}
