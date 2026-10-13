<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documento_digitalizados', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->text('assunto')->nullable();
            $table->date('data_emissao_original_papel')->nullable();
            $table->string('localizacao_fisica_original')->nullable();
            $table->string('tipo_documental');
            $table->string('suporte_original')->default('PAPEL');
            
            $table->string('caminho_arquivo');
            $table->string('hash_sha256', 64);
            $table->bigInteger('tamanho_arquivo');
            $table->string('formato_arquivo')->default('PDF/A-1b');
            $table->integer('resolucao_dpi')->default(300);
            
            $table->datetime('data_hora_digitalizacao');
            $table->string('operador_responsavel_cpf', 14);
            $table->string('operador_responsavel_nome');
            $table->string('equipamento_scanner')->nullable();
            
            $table->enum('destinacao_final', ['GUARDA_PERMANENTE', 'GUARDA_TEMPORARIA'])->default('GUARDA_TEMPORARIA');
            $table->enum('status', ['PENDENTE', 'DIGITALIZADO', 'ASSINADO', 'ELIMINADO'])->default('PENDENTE');
            
            $table->string('tenant_id')->nullable();
            $table->foreignId('tabela_temporalidade_id')->nullable()->constrained('tabela_temporalidades')->nullOnDelete();
            
            $table->timestamps();
            
            $table->index('titulo');
            $table->index('tipo_documental');
            $table->index('hash_sha256');
            $table->index('status');
            $table->index('tenant_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documento_digitalizados');
    }
};
