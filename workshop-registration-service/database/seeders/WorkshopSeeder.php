<?php

namespace Database\Seeders;

use App\Models\Registration;
use App\Models\User;
use App\Models\Workshop;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class WorkshopSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $staffUser = User::where('email', 'staff@centre.test')->first() ?? User::first();
        $managerUser = User::where('email', 'manager@centre.test')->first() ?? User::first();
        $sarahUser = User::where('email', 'sarah.staff@centre.test')->first() ?? $staffUser;
        $johnUser = User::where('email', 'john.staff@centre.test')->first() ?? $staffUser;

        // 1. Workshop: Plenty of seats left (4 / 12 taken, 8 available)
        $workshop1 = Workshop::updateOrCreate(
            ['code' => 'POT-101'],
            [
                'title' => 'Pottery Basics & Wheel Throwing',
                'description' => 'Learn the fundamentals of clay preparation, centering, and throwing cylinders and bowls on the potter\'s wheel. All materials included.',
                'instructor' => 'Elena Vance',
                'location' => 'Downtown',
                'start_time' => Carbon::now()->addDays(3)->setTime(10, 0),
                'end_time' => Carbon::now()->addDays(3)->setTime(13, 0),
                'capacity' => 12,
                'status' => 'scheduled',
            ]
        );

        $attendees1 = [
            ['name' => 'Alice Johnson', 'email' => 'alice.j@example.com'],
            ['name' => 'Brian Smith', 'email' => 'brian.smith@example.com'],
            ['name' => 'Catherine Bell', 'email' => 'catherine.b@example.com'],
            ['name' => 'David Miller', 'email' => 'david.m@example.com'],
        ];

        foreach ($attendees1 as $attendee) {
            Registration::updateOrCreate(
                ['workshop_id' => $workshop1->id, 'attendee_email' => $attendee['email']],
                [
                    'attendee_name' => $attendee['name'],
                    'status' => 'active',
                    'registered_by' => $staffUser->id,
                    'registered_at' => Carbon::now()->subDays(2)->addHours(2),
                ]
            );
        }

        // 2. Workshop: Exactly 1 seat left (9 / 10 taken) - Concurrency Race Test Target
        $workshop2 = Workshop::updateOrCreate(
            ['code' => 'COD-202'],
            [
                'title' => 'Intro to Web Development with React',
                'description' => 'Hands-on coding workshop covering modern React hooks, state management, and component architecture for interactive applications.',
                'instructor' => 'Marcus Chen',
                'location' => 'North Wing',
                'start_time' => Carbon::now()->addDays(5)->setTime(14, 0),
                'end_time' => Carbon::now()->addDays(5)->setTime(17, 30),
                'capacity' => 10,
                'status' => 'scheduled',
            ]
        );

        $attendees2 = [
            ['name' => 'Emily Watson', 'email' => 'emily.w@example.com'],
            ['name' => 'Frank Castle', 'email' => 'frank.c@example.com'],
            ['name' => 'Grace Hopper', 'email' => 'grace.h@example.com'],
            ['name' => 'Henry Ford', 'email' => 'henry.f@example.com'],
            ['name' => 'Isla Fisher', 'email' => 'isla.f@example.com'],
            ['name' => 'Jack Ryan', 'email' => 'jack.r@example.com'],
            ['name' => 'Karen Page', 'email' => 'karen.p@example.com'],
            ['name' => 'Leo Tolstoy', 'email' => 'leo.t@example.com'],
            ['name' => 'Mia Wong', 'email' => 'mia.w@example.com'],
        ];

        foreach ($attendees2 as $i => $attendee) {
            $registeredBy = ($i % 2 === 0) ? $staffUser->id : $sarahUser->id;
            Registration::updateOrCreate(
                ['workshop_id' => $workshop2->id, 'attendee_email' => $attendee['email']],
                [
                    'attendee_name' => $attendee['name'],
                    'status' => 'active',
                    'registered_by' => $registeredBy,
                    'registered_at' => Carbon::now()->subDays(1)->addHours($i),
                ]
            );
        }

        // 3. Workshop: Fully Booked (15 / 15 taken)
        $workshop3 = Workshop::updateOrCreate(
            ['code' => 'FIT-303'],
            [
                'title' => 'Weekend Community Yoga & Mindfulness',
                'description' => 'Gentle vinyasa flow followed by guided breathing and meditation suitable for all fitness levels. Bring a mat and water bottle.',
                'instructor' => 'Aria Sharma',
                'location' => 'West Centre',
                'start_time' => Carbon::now()->addDays(2)->setTime(9, 0),
                'end_time' => Carbon::now()->addDays(2)->setTime(11, 0),
                'capacity' => 15,
                'status' => 'scheduled',
            ]
        );

        for ($i = 1; $i <= 15; $i++) {
            Registration::updateOrCreate(
                ['workshop_id' => $workshop3->id, 'attendee_email' => "yoga.attendee{$i}@example.com"],
                [
                    'attendee_name' => "Attendee {$i}",
                    'status' => 'active',
                    'registered_by' => ($i % 3 === 0) ? $johnUser->id : $staffUser->id,
                    'registered_at' => Carbon::now()->subDays(3)->addHours($i),
                ]
            );
        }

        // 4. Workshop: Active + Cancelled Audit History (6 active, 3 cancelled)
        $workshop4 = Workshop::updateOrCreate(
            ['code' => 'PHO-104'],
            [
                'title' => 'Digital Photography & Studio Lighting',
                'description' => 'Master camera exposure triangle, creative lighting setups, and portrait composition techniques in our state-of-the-art studio.',
                'instructor' => 'David Brooks',
                'location' => 'Downtown',
                'start_time' => Carbon::now()->addDays(8)->setTime(11, 0),
                'end_time' => Carbon::now()->addDays(8)->setTime(15, 0),
                'capacity' => 10,
                'status' => 'scheduled',
            ]
        );

        $attendees4Active = [
            ['name' => 'Nathan Drake', 'email' => 'nathan.d@example.com'],
            ['name' => 'Olivia Wilde', 'email' => 'olivia.w@example.com'],
            ['name' => 'Peter Parker', 'email' => 'peter.p@example.com'],
            ['name' => 'Quinn Fabray', 'email' => 'quinn.f@example.com'],
            ['name' => 'Rachel Green', 'email' => 'rachel.g@example.com'],
            ['name' => 'Samuel Adams', 'email' => 'samuel.a@example.com'],
        ];

        foreach ($attendees4Active as $attendee) {
            Registration::updateOrCreate(
                ['workshop_id' => $workshop4->id, 'attendee_email' => $attendee['email']],
                [
                    'attendee_name' => $attendee['name'],
                    'status' => 'active',
                    'registered_by' => $managerUser->id,
                    'registered_at' => Carbon::now()->subDays(4)->addHours(3),
                ]
            );
        }

        $attendees4Cancelled = [
            [
                'name' => 'Thomas Wayne',
                'email' => 'thomas.w@example.com',
                'reason' => 'Schedule conflict with work trip.',
            ],
            [
                'name' => 'Uma Thurman',
                'email' => 'uma.t@example.com',
                'reason' => 'Attending family emergency.',
            ],
            [
                'name' => 'Victor Stone',
                'email' => 'victor.s@example.com',
                'reason' => 'Accidentally registered for the wrong time slot.',
            ],
        ];

        foreach ($attendees4Cancelled as $i => $cancelled) {
            Registration::updateOrCreate(
                ['workshop_id' => $workshop4->id, 'attendee_email' => $cancelled['email']],
                [
                    'attendee_name' => $cancelled['name'],
                    'status' => 'cancelled',
                    'registered_by' => $staffUser->id,
                    'registered_at' => Carbon::now()->subDays(5)->addHours($i),
                    'cancelled_by' => $managerUser->id,
                    'cancelled_at' => Carbon::now()->subDays(1)->addHours($i),
                    'cancellation_reason' => $cancelled['reason'],
                ]
            );
        }

        // 5. Workshop: Brand New (0 / 8 taken)
        Workshop::updateOrCreate(
            ['code' => 'WOD-205'],
            [
                'title' => 'Woodworking & Joinery Fundamentals',
                'description' => 'Introduction to safe hand tool usage, mortise and tenon joinery, and protective finishing methods. Safety equipment provided.',
                'instructor' => 'Robert Taylor',
                'location' => 'West Centre',
                'start_time' => Carbon::now()->addDays(12)->setTime(13, 0),
                'end_time' => Carbon::now()->addDays(12)->setTime(17, 0),
                'capacity' => 8,
                'status' => 'scheduled',
            ]
        );

        // 6. Workshop: Completed Past Workshop
        $workshop6 = Workshop::updateOrCreate(
            ['code' => 'CUL-306'],
            [
                'title' => 'Artisan Sourdough Baking Masterclass',
                'description' => 'Step-by-step bread baking covering starter maintenance, stretch-and-fold fermentation, scoring, and dutch oven baking.',
                'instructor' => 'Sophie Laurent',
                'location' => 'North Wing',
                'start_time' => Carbon::now()->subDays(3)->setTime(10, 0),
                'end_time' => Carbon::now()->subDays(3)->setTime(14, 0),
                'capacity' => 12,
                'status' => 'completed',
            ]
        );

        Registration::updateOrCreate(
            ['workshop_id' => $workshop6->id, 'attendee_email' => 'past.student@example.com'],
            [
                'attendee_name' => 'Claire Redfield',
                'status' => 'active',
                'registered_by' => $staffUser->id,
                'registered_at' => Carbon::now()->subDays(6),
            ]
        );
    }
}
