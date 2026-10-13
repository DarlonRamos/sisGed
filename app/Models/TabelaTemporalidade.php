<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TabelaTemporalidade extends Model
{
    use HasFactory;

    protected $table = 'tabela_temporalidades';

    protected $fillable = [
        'tipo_documental',
        'prazo_guarda_corrente',
        'prazo_guarda_intermediaria',
        'destinacao_final', // GUARDA_PERMANENTE ou ELIMINACAO
        'base_legal',
        'observacoes'
    ];

    protected $casts = [
        'prazo_guarda_corrente' => 'integer',
        'prazo_guarda_intermediaria' => 'integer'
    ];

    // Relacionamento: Uma TTD tem vários documentos
    public function documentos(): HasMany
    {
        return $this->hasMany(DocumentoDigitalizado::class);
    }
}
