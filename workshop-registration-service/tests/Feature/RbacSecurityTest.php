<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Workshop;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RbacSecurityTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $manager;
    private User $staff;
    private Workshop $workshop;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['role' => 'admin', 'email' => 'admin@test.com']);
        $this->manager = User::factory()->create(['role' => 'manager', 'email' => 'manager@test.com']);
        $this->staff = User::factory()->create(['role' => 'staff', 'email' => 'staff@test.com']);

        $this->workshop = Workshop::create([
            'code' => 'TEST-101',
            'title' => 'Test Workshop',
            'instructor' => 'Jane Tester',
            'location' => 'Downtown',
            'start_time' => now()->addDays(2),
            'end_time' => now()->addDays(2)->addHours(2),
            'capacity' => 10,
            'status' => 'scheduled',
        ]);
    }

    public function test_admin_can_access_user_management(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.users.index'));
        $response->assertOk();
    }

    public function test_staff_cannot_access_user_management_and_receives_403(): void
    {
        $response = $this->actingAs($this->staff)->get(route('admin.users.index'));
        $response->assertForbidden();
    }

    public function test_manager_cannot_access_user_management_and_receives_403(): void
    {
        $response = $this->actingAs($this->manager)->get(route('admin.users.index'));
        $response->assertForbidden();
    }

    public function test_admin_cannot_access_workshops_catalogue_and_receives_403(): void
    {
        $response = $this->actingAs($this->admin)->get(route('workshops.index'));
        $response->assertForbidden();
    }

    public function test_staff_can_view_workshops_catalogue(): void
    {
        $response = $this->actingAs($this->staff)->get(route('workshops.index'));
        $response->assertOk();
    }

    public function test_manager_can_view_workshops_catalogue(): void
    {
        $response = $this->actingAs($this->manager)->get(route('workshops.index'));
        $response->assertOk();
    }

    public function test_manager_can_access_workshop_creation(): void
    {
        $response = $this->actingAs($this->manager)->get(route('workshops.create'));
        $response->assertOk();
    }

    public function test_staff_cannot_access_workshop_creation_and_receives_403(): void
    {
        $response = $this->actingAs($this->staff)->get(route('workshops.create'));
        $response->assertForbidden();
    }

    public function test_staff_cannot_edit_workshops_and_receives_403(): void
    {
        $response = $this->actingAs($this->staff)->get(route('workshops.edit', $this->workshop));
        $response->assertForbidden();
    }
}
