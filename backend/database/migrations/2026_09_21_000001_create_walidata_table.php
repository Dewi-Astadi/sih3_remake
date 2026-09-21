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
        Schema::create('walidata', function (Blueprint $table) {
            $table->id();
            $table->string('nama', 255);
            $table->string('singkatan', 50);
            $table->text('deskripsi')->nullable();
            $table->string('logo_path', 255)->nullable();
            $table->string('website_url', 255)->nullable();
            $table->string('layanan_url', 255)->nullable();
            $table->string('kontak_wa', 50)->nullable();
            $table->string('kontak_telp', 50)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('walidata');
    }
};
