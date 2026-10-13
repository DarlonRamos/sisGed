<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MetadadoDigitalizacao extends Model
{
    use HasFactory;

    protected $table = 'metadado_digitalizacaos';

    protected $fillable = [
        'documento_digitalizado_id',
        'certificado_assinatura',
        'certificado_emissor',
        'data_assinatura',
        'assinado',
        'metadados_extras' // JSON para metadados adicionais
    ];

    protected $casts = [
        'assinado' => 'boolean',
        'data_assinatura' => 'datetime',
        'metadados_extras' => 'array'
    ];

    // Relacionamento inverso
    public function documento(): BelongsTo
    {
        return $this->belongsTo(DocumentoDigitalizado::class);
    }
}
