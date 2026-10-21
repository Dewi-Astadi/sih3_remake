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
        Schema::create('pengukuran', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pos_id')->constrained('pos')->cascadeOnDelete();
            $table->dateTime('recorded_at')->index();
            $table->decimal('nilai', 8, 2);
            $table->string('satuan', 20);
            $table->enum('status_siaga', ['normal', 'waspada', 'siaga', 'awas'])->default('normal');
            $table->json('parameter_tambahan')->nullable();
            $table->timestamps();

            $table->index(['pos_id', 'recorded_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengukuran');
    }
};
