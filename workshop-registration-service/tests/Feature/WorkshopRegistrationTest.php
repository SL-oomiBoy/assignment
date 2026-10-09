<?php

namespace Tests\Feature;

use App\Models\Registration;
use App\Models\User;
use App\Models\Workshop;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WorkshopRegistrationTest extends TestCase
{
    use RefreshDatabase;

    private User $manager;
    private User $staff;

    protected function setUp(): void
    {
        parent::setUp();

        $this->manager = User::factory()->create(['role' => 'manager', 'email' => 'manager@test.com']);
        $this->staff = User::factory()->create(['role' => 'staff', 'email' => 'staff@test.com']);
    }

    public function test_manager_can_create_a_workshop(): void
    {
        $payload = [
            'code' => 'NEW-999',
            'title' => 'Advanced Ceramics',
            'description' => 'Hands on glazing and firing.',
            'instructor' => 'Master Potter',
            'location' => 'North Wing',
            'start_time' => now()->addDays(5)->toDateTimeString(),
            'end_time' => now()->addDays(5)->addHours(3)->toDateTimeString(),
            'capacity' => 10,
            'status' => 'scheduled',
        ];

        $response = $this->actingAs($this->manager)->post(route('workshops.store'), $payload);

        $response->assertRedirect();
        $this->assertDatabaseHas('workshops', ['code' => 'NEW-999', 'title' => 'Advanced Ceramics']);
    }

    public function test_staff_can_register_attendee_for_a_workshop(): void
    {
        $workshop = Workshop::create([
            'code' => 'REG-101',
            'title' => 'Registration Test',
            'instructor' => 'Instructor Name',
            'location' => 'Downtown',
            'start_time' => now()->addDays(3),
            'end_time' => now()->addDays(3)->addHours(2),
            'capacity' => 2,
            'status' => 'scheduled',
        ]);

        $response = $this->actingAs($this->staff)->post(route('registrations.store', $workshop), [
            'attendee_name' => 'Alice Wonder',
            'attendee_email' => 'alice@example.com',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('registrations', [
            'workshop_id' => $workshop->id,
            'attendee_name' => 'Alice Wonder',
            'attendee_email' => 'alice@example.com',
            'status' => 'active',
            'registered_by' => $this->staff->id,
        ]);
    }

    public function test_cannot_exceed_workshop_capacity(): void
    {
        $workshop = Workshop::create([
            'code' => 'CAP-101',
            'title' => 'Capacity Test',
            'instructor' => 'Instructor Name',
            'location' => 'Downtown',
            'start_time' => now()->addDays(3),
            'end_time' => now()->addDays(3)->addHours(2),
            'capacity' => 1,
            'status' => 'scheduled',
        ]);

        // Register 1 attendee (fills capacity)
        $this->actingAs($this->staff)->post(route('registrations.store', $workshop), [
            'attendee_name' => 'First Attendee',
            'attendee_email' => 'first@example.com',
        ]);

        $this->assertEquals(1, $workshop->activeRegistrations()->count());

        // Attempt to register 2nd attendee (must fail with validation error)
        $response = $this->actingAs($this->staff)->post(route('registrations.store', $workshop), [
            'attendee_name' => 'Second Attendee',
            'attendee_email' => 'second@example.com',
        ]);

        $response->assertSessionHasErrors(['capacity']);
        $this->assertEquals(1, $workshop->activeRegistrations()->count());
    }

    public function test_cancellation_tracks_audit_trail_and_frees_up_seat(): void
    {
        $workshop = Workshop::create([
            'code' => 'AUD-101',
            'title' => 'Audit Test',
            'instructor' => 'Instructor Name',
            'location' => 'West Centre',
            'start_time' => now()->addDays(4),
            'end_time' => now()->addDays(4)->addHours(2),
            'capacity' => 1,
            'status' => 'scheduled',
        ]);

        // Register attendee
        $this->actingAs($this->staff)->post(route('registrations.store', $workshop), [
            'attendee_name' => 'John Doe',
            'attendee_email' => 'john@example.com',
        ]);

        $registration = Registration::where('workshop_id', $workshop->id)->firstOrFail();
        $this->assertEquals('active', $registration->status);

        // Cancel registration
        $response = $this->actingAs($this->manager)->post(route('registrations.cancel', $registration), [
            'cancellation_reason' => 'Attendee caught a cold.',
        ]);

        $response->assertRedirect();

        $registration->refresh();
        $this->assertEquals('cancelled', $registration->status);
        $this->assertEquals($this->manager->id, $registration->cancelled_by);
        $this->assertNotNull($registration->cancelled_at);
        $this->assertEquals('Attendee caught a cold.', $registration->cancellation_reason);

        // Active registration count is now 0, allowing new registration
        $this->assertEquals(0, $workshop->activeRegistrations()->count());

        // Now another attendee can take the freed seat
        $response2 = $this->actingAs($this->staff)->post(route('registrations.store', $workshop), [
            'attendee_name' => 'Jane Smith',
            'attendee_email' => 'jane@example.com',
        ]);

        $response2->assertSessionHasNoErrors();
        $this->assertEquals(1, $workshop->activeRegistrations()->count());
    }
}
