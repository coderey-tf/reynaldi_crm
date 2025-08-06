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
        Schema::create('deal_pipeline_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('deal_pipelines_id');
            $table->unsignedBigInteger('productId');
            $table->integer('qty');
            $table->double('hargaNegoisasi');
            $table->boolean('needsApproval')->default(false);
            $table->enum('statusApproval', ['waiting', 'approved', 'rejected'])->default('waiting');
            $table->timestamps();

            $table->foreign('deal_pipelines_id')->references('id')->on('deal_pipelines');
            $table->foreign('productId')->references('id')->on('products');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deal_pipeline_details');
    }
};
