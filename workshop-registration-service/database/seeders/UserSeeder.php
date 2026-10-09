<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $password = Hash::make('password');

        // Admin User
        User::updateOrCreate(
            ['email' => 'admin@centre.test'],
            [
                'name' => 'System Administrator',
                'password' => $password,
                'role' => 'admin',
            ]
        );

        // Operations Manager
        User::updateOrCreate(
            ['email' => 'manager@centre.test'],
            [
                'name' => 'Operations Manager',
                'password' => $password,
                'role' => 'manager',
            ]
        );

        // Front Desk Staff
        User::updateOrCreate(
            ['email' => 'staff@centre.test'],
            [
                'name' => 'Front Desk Staff',
                'password' => $password,
                'role' => 'staff',
            ]
        );

        // Additional realistic staff members for multi-user audit logging
        User::updateOrCreate(
            ['email' => 'sarah.staff@centre.test'],
            [
                'name' => 'Sarah Connor (Staff)',
                'password' => $password,
                'role' => 'staff',
            ]
        );

        User::updateOrCreate(
            ['email' => 'john.staff@centre.test'],
            [
                'name' => 'John Miller (Staff)',
                'password' => $password,
                'role' => 'staff',
            ]
        );
    }
}
