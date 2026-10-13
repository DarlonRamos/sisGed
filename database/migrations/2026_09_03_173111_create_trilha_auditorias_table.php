<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trilha_auditorias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('documento_digitalizado_id')->constrained('documento_digitalizados')->onDelete('cascade');
            $table->foreignId('usuario_id')->constrained('users')->onDelete('cascade');
            
            $table->string('acao');
            $table->json('detalhes')->nullable();
            $table->string('ip_origem')->nullable();
            $table->string('user_agent')->nullable();
            
            $table->timestamps();
            
            $table->index('documento_digitalizado_id');
            $table->index('usuario_id');
            $table->index('acao');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trilha_auditorias');
    }
};
