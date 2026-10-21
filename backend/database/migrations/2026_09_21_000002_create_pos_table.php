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
        Schema::create('pos', function (Blueprint $table) {
            $table->id();
            $table->string('kode_pos', 50)->unique();
            $table->string('nama', 255);
            $table->enum('tipe', ['hidrologi', 'hidrometeorologi', 'hidrogeologi']);
            $table->enum('jenis', ['AWLR', 'Kualitas Air', 'ARR', 'Klimatologi', 'MAT']);
            $table->string('wilayah_sungai', 150);
            $table->string('das', 150);
            $table->string('sub_das', 150)->nullable();
            $table->string('sungai', 150)->nullable();
            $table->string('desa', 100)->nullable();
            $table->string('kecamatan', 100)->nullable();
            $table->string('kabupaten', 100)->nullable();
            $table->string('provinsi', 100)->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->foreignId('walidata_id')->constrained('walidata')->cascadeOnDelete();
            $table->enum('status_alat', ['aktif', 'pemeliharaan', 'nonaktif'])->default('aktif');
            $table->string('foto_path', 255)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pos');
    }
};
