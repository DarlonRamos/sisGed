<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DocumentoDigitalizado extends Model
{
    use HasFactory;

    protected $table = 'documento_digitalizados';

    protected $fillable = [
        'titulo',
        'assunto',
        'data_emissao_original_papel',
        'localizacao_fisica_original',
        'tipo_documental',
        'suporte_original',
        'caminho_arquivo',
        'hash_sha256',
        'tamanho_arquivo',
        'formato_arquivo',
        'resolucao_dpi',
        'data_hora_digitalizacao',
        'operador_responsavel_cpf',
        'operador_responsavel_nome',
        'equipamento_scanner',
        'destinacao_final', // GUARDA_PERMANENTE ou GUARDA_TEMPORARIA
        'status', // PENDENTE, DIGITALIZADO, ASSINADO, ELIMINADO
        'tenant_id' // Para multi-tenant
    ];

    protected $casts = [
        'data_emissao_original_papel' => 'date',
        'data_hora_digitalizacao' => 'datetime',
        'tamanho_arquivo' => 'integer',
        'resolucao_dpi' => 'integer'
    ];

    // Relacionamento: Um documento tem um metadado
    public function metadado(): HasOne
    {
        return $this->hasOne(MetadadoDigitalizacao::class);
    }

    // Relacionamento: Um documento tem várias trilhas de auditoria
    public function auditorias(): HasMany
    {
        return $this->hasMany(TrilhaAuditoria::class);
    }

    // Relacionamento: Um documento pertence a uma TTD
    public function tabelaTemporalidade()
    {
        return $this->belongsTo(TabelaTemporalidade::class);
    }
}
