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
        Schema::create('deal_pipelines', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('leadId');
            $table->unsignedBigInteger('customerId');
            $table->double('totalValue')->default(0);
            $table->double('totalProfit')->default(0);
            $table->double('profitMargin')->default(0);
            $table->enum('status', ['waiting-approval', 'approved', 'rejected']);
            $table->text('notes')->nullable();
            $table->dateTime('approvedDate')->nullable();
            $table->string('approvedBy')->nullable();
            $table->timestamps();

            $table->foreign('leadId')->references('id')->on('leads');
            $table->foreign('customerId')->references('id')->on('customers');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deal_pipelines');
    }
};
