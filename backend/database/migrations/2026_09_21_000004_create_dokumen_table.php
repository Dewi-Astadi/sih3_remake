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
        Schema::create('dokumen', function (Blueprint $table) {
            $table->id();
            $table->string('judul', 255);
            $table->enum('kategori', ['regulasi', 'sop', 'buletin', 'laporan']);
            $table->smallInteger('tahun');
            $table->string('nomor_dokumen', 100)->nullable();
            $table->string('file_path', 255);
            $table->string('file_size', 50);
            $table->string('file_extension', 10);
            $table->unsignedBigInteger('download_count')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dokumen');
    }
};
