<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrilhaAuditoria extends Model
{
    use HasFactory;

    protected $table = 'trilha_auditorias';

    protected $fillable = [
        'documento_digitalizado_id',
        'usuario_id',
        'acao', // CRIOU, VISUALIZOU, BAIXOU, ASSINOU, ELIMINOU, VERIFICOU
        'detalhes',
        'ip_origem',
        'user_agent'
    ];

    protected $casts = [
        'detalhes' => 'array'
    ];

    // Relacionamento inverso
    public function documento(): BelongsTo
    {
        return $this->belongsTo(DocumentoDigitalizado::class);
    }

    // Relacionamento com usuário
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
