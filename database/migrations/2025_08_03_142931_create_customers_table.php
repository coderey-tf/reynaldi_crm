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
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('kontak');
            $table->string('email');
            $table->text('alamat');
            $table->integer('active')->default(1);
            $table->unsignedBigInteger('leadId');
            $table->timestamps();
            $table->foreign('leadId')->references('id')->on('leads');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
