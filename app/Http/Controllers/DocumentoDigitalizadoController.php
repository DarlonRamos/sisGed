<?php

namespace App\Http\Controllers;

use App\Models\DocumentoDigitalizado;
use App\Models\TrilhaAuditoria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class DocumentoDigitalizadoController extends Controller
{
    /**
     * Listar todos os documentos
     */
    public function index()
    {
        $documentos = DocumentoDigitalizado::with(['metadado', 'tabelaTemporalidade'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($documentos);
    }

    /**
     * Armazenar um novo documento digitalizado
     */
public function store(Request $request)
{
    // Validar os dados (tornando campos opcionais)
    $validated = $request->validate([
        'arquivo' => 'required|file|mimes:pdf|max:51200', // 50MB máximo
        'titulo' => 'required|string|max:255',
        'assunto' => 'nullable|string',
        'data_emissao_original_papel' => 'nullable|date', // <-- AGORA É OPCIONAL
        'localizacao_fisica_original' => 'nullable|string|max:255',
        'tipo_documental' => 'required|string|max:100',
        'operador_responsavel_cpf' => 'required|string|max:14',
        'operador_responsavel_nome' => 'required|string|max:255',
        'equipamento_scanner' => 'nullable|string|max:100',
        'destinacao_final' => 'required|in:GUARDA_PERMANENTE,GUARDA_TEMPORARIA'
    ]);

    // 1. Pegar o arquivo
    $arquivo = $request->file('arquivo');
    
    // 2. Calcular SHA-256
    $hash = hash_file('sha256', $arquivo->getRealPath());
    
    // 3. Gerar nome único para o arquivo
    $nomeArquivo = $hash . '.pdf';
    $caminho = 'documentos/' . date('Y/m/d') . '/' . $nomeArquivo;
    
    // 4. Salvar o arquivo no storage
    $caminhoSalvo = $arquivo->storeAs(
        'documentos/' . date('Y/m/d'),
        $nomeArquivo,
        'public'
    );

    // 5. Criar o documento no banco (usando ?? para valores nulos)
    $documento = DocumentoDigitalizado::create([
        'titulo' => $validated['titulo'],
        'assunto' => $validated['assunto'] ?? null,
        'data_emissao_original_papel' => $validated['data_emissao_original_papel'] ?? null,
        'localizacao_fisica_original' => $validated['localizacao_fisica_original'] ?? null,
        'tipo_documental' => $validated['tipo_documental'],
        'suporte_original' => 'PAPEL',
        'caminho_arquivo' => $caminhoSalvo,
        'hash_sha256' => $hash,
        'tamanho_arquivo' => $arquivo->getSize(),
        'formato_arquivo' => 'PDF/A-1b',
        'resolucao_dpi' => 300,
        'data_hora_digitalizacao' => now(),
        'operador_responsavel_cpf' => $validated['operador_responsavel_cpf'],
        'operador_responsavel_nome' => $validated['operador_responsavel_nome'],
        'equipamento_scanner' => $validated['equipamento_scanner'] ?? null,
        'destinacao_final' => $validated['destinacao_final'],
        'status' => 'DIGITALIZADO',
        'tenant_id' => $request->header('X-Tenant-ID', 'default')
    ]);

    // 6. Registrar na trilha de auditoria
    TrilhaAuditoria::create([
        'documento_digitalizado_id' => $documento->id,
        'usuario_id' => Auth::id(),
        'acao' => 'CRIOU',
        'detalhes' => [
            'titulo' => $documento->titulo,
            'hash' => $hash
        ],
        'ip_origem' => $request->ip(),
        'user_agent' => $request->userAgent()
    ]);

    return response()->json([
        'message' => 'Documento digitalizado com sucesso!',
        'documento' => $documento,
        'hash_sha256' => $hash
    ], 201);
}

    /**
     * Mostrar um documento específico
     */
    public function show($id)
    {
        $documento = DocumentoDigitalizado::with(['metadado', 'tabelaTemporalidade', 'auditorias'])
            ->findOrFail($id);

        // Registrar visualização na auditoria
        TrilhaAuditoria::create([
            'documento_digitalizado_id' => $documento->id,
            'usuario_id' => Auth::id(),
            'acao' => 'VISUALIZOU',
            'ip_origem' => request()->ip(),
            'user_agent' => request()->userAgent()
        ]);

        return response()->json($documento);
    }

    /**
     * Baixar o arquivo digitalizado
     */
    public function download($id)
    {
        $documento = DocumentoDigitalizado::findOrFail($id);
        
        // Verificar se o arquivo existe
        if (!Storage::disk('public')->exists($documento->caminho_arquivo)) {
            return response()->json(['error' => 'Arquivo não encontrado'], 404);
        }

        // Registrar download na auditoria
        TrilhaAuditoria::create([
            'documento_digitalizado_id' => $documento->id,
            'usuario_id' => Auth::id(),
            'acao' => 'BAIXOU',
            'ip_origem' => request()->ip(),
            'user_agent' => request()->userAgent()
        ]);

        return Storage::disk('public')->download($documento->caminho_arquivo);
    }

    /**
     * Verificar integridade de um documento
     */
    public function verificarIntegridade($id)
    {
        $documento = DocumentoDigitalizado::findOrFail($id);
        
        // Verificar se o arquivo existe
        if (!Storage::disk('public')->exists($documento->caminho_arquivo)) {
            return response()->json([
                'integro' => false,
                'mensagem' => 'Arquivo físico não encontrado no storage'
            ], 404);
        }

        // Calcular hash atual
        $caminhoCompleto = Storage::disk('public')->path($documento->caminho_arquivo);
        $hashAtual = hash_file('sha256', $caminhoCompleto);
        
        $integro = $hashAtual === $documento->hash_sha256;

        // Registrar verificação na auditoria
        TrilhaAuditoria::create([
            'documento_digitalizado_id' => $documento->id,
            'usuario_id' => Auth::id(),
            'acao' => 'VERIFICOU',
            'detalhes' => [
                'hash_original' => $documento->hash_sha256,
                'hash_atual' => $hashAtual,
                'integro' => $integro
            ],
            'ip_origem' => request()->ip(),
            'user_agent' => request()->userAgent()
        ]);

        return response()->json([
            'integro' => $integro,
            'hash_original' => $documento->hash_sha256,
            'hash_atual' => $hashAtual,
            'mensagem' => $integro ? 'Documento íntegro' : 'Documento comprometido!'
        ]);
    }
}
