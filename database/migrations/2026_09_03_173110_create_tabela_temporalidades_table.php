<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tabela_temporalidades', function (Blueprint $table) {
            $table->id();
            $table->string('tipo_documental')->unique();
            $table->integer('prazo_guarda_corrente');
            $table->integer('prazo_guarda_intermediaria');
            $table->enum('destinacao_final', ['GUARDA_PERMANENTE', 'ELIMINACAO']);
            $table->string('base_legal')->nullable();
            $table->text('observacoes')->nullable();
            
            $table->timestamps();
            
            $table->index('tipo_documental');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tabela_temporalidades');
    }
};
