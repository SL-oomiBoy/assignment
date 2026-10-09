<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('workshops', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50)->unique();
            $table->string('title', 255);
            $table->text('description')->nullable();
            $table->string('instructor', 255);
            $table->string('location', 100);
            $table->dateTime('start_time')->index();
            $table->dateTime('end_time');
            $table->unsignedInteger('capacity');
            $table->string('status', 30)->default('scheduled')->index();
            $table->timestamps();

            $table->index(['start_time', 'status'], 'idx_workshops_filter');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('workshops');
    }
};
