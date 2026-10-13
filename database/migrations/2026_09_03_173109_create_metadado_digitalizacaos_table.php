<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('metadado_digitalizacaos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('documento_digitalizado_id')->constrained('documento_digitalizados')->onDelete('cascade');
            
            $table->string('certificado_assinatura')->nullable();
            $table->string('certificado_emissor')->nullable();
            $table->datetime('data_assinatura')->nullable();
            $table->boolean('assinado')->default(false);
            
            $table->json('metadados_extras')->nullable();
            
            $table->timestamps();
            
            $table->index('documento_digitalizado_id');
            $table->index('assinado');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('metadado_digitalizacaos');
    }
};
