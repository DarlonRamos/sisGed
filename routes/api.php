<?php

use App\Http\Controllers\DocumentoDigitalizadoController;
use App\Models\DocumentoDigitalizado;
use App\Models\TrilhaAuditoria;
use App\Models\TabelaTemporalidade;
use App\Rules\ValidCpf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Rotas de Documentos Digitalizados (protegidas por autenticação)
Route::middleware('auth:sanctum')->group(function () {
    // Listar todos os documentos
    Route::get('/documentos', [DocumentoDigitalizadoController::class, 'index']);

    // Mostrar um documento específico
    Route::get('/documentos/{id}', [DocumentoDigitalizadoController::class, 'show']);

    // Baixar o arquivo do documento
    Route::get('/documentos/{id}/download', [DocumentoDigitalizadoController::class, 'download']);

    // Verificar integridade do documento
    Route::get('/documentos/{id}/verificar', [DocumentoDigitalizadoController::class, 'verificarIntegridade']);

    // ==========================================
    // UPLOAD VIA API (retorna JSON com erros)
    // ==========================================
    Route::post('/documentos/upload', function (Request $request) {
        try {
            $validated = $request->validate([
                'arquivo' => 'required|file|mimes:pdf|max:51200',
                'titulo' => 'required|string|max:255',
                'assunto' => 'nullable|string',
                'data_emissao_original_papel' => 'nullable|date',
                'localizacao_fisica_original' => 'nullable|string|max:255',
                'tabela_temporalidade_id' => 'required|integer|exists:tabela_temporalidades,id',
                'operador_responsavel_cpf' => ['required', 'string', 'max:14', new ValidCpf()],
                'operador_responsavel_nome' => 'required|string|max:255',
                'equipamento_scanner' => 'nullable|string|max:100',
                'destinacao_final' => 'required|in:GUARDA_PERMANENTE,GUARDA_TEMPORARIA',
            ], [
                'tabela_temporalidade_id.required' => 'O tipo documental é obrigatório.',
                'tabela_temporalidade_id.exists' => 'O tipo documental selecionado não existe.',
            ]);

            // 1. Pegar o arquivo
            $arquivo = $request->file('arquivo');

            // 2. Calcular SHA-256
            $hash = hash_file('sha256', $arquivo->getRealPath());

            // 3. Gerar nome único
            $nomeArquivo = $hash . '.pdf';

            // 4. Salvar no storage
            $caminhoSalvo = $arquivo->storeAs(
                'documentos/' . date('Y/m/d'),
                $nomeArquivo,
                'public'
            );

            // 5. Formatar CPF
            $cpfFormatado = preg_replace(
                '/(\d{3})(\d{3})(\d{3})(\d{2})/',
                '$1.$2.$3-$4',
                preg_replace('/[^0-9]/', '', $validated['operador_responsavel_cpf'])
            );

            // 5.1. Buscar a TTD
            $ttd = TabelaTemporalidade::findOrFail($validated['tabela_temporalidade_id']);

            // 6. Criar o documento no banco
            $documento = DocumentoDigitalizado::create([
                'titulo' => $validated['titulo'],
                'assunto' => $validated['assunto'] ?? null,
                'data_emissao_original_papel' => $validated['data_emissao_original_papel'] ?? null,
                'localizacao_fisica_original' => $validated['localizacao_fisica_original'] ?? null,
                'tipo_documental' => $ttd->tipo_documental,                    // ← Vem da TTD
                'tabela_temporalidade_id' => $validated['tabela_temporalidade_id'],  // ← ADICIONADO
                'suporte_original' => 'PAPEL',
                'caminho_arquivo' => $caminhoSalvo,
                'hash_sha256' => $hash,
                'tamanho_arquivo' => $arquivo->getSize(),
                'formato_arquivo' => 'PDF/A-1b',
                'resolucao_dpi' => 300,
                'data_hora_digitalizacao' => now(),
                'operador_responsavel_cpf' => $cpfFormatado,
                'operador_responsavel_nome' => $validated['operador_responsavel_nome'],
                'equipamento_scanner' => $validated['equipamento_scanner'] ?? null,
                'destinacao_final' => $validated['destinacao_final'],
                'status' => 'DIGITALIZADO',
                'tenant_id' => 'default',
            ]);

            // 7. Registrar na auditoria
            TrilhaAuditoria::create([
                'documento_digitalizado_id' => $documento->id,
                'usuario_id' => Auth::id(),
                'acao' => 'CRIOU',
                'detalhes' => [
                    'titulo' => $documento->titulo,
                    'hash' => $hash,
                ],
                'ip_origem' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Documento digitalizado com sucesso!',
                'documento' => $documento,
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'errors' => ['geral' => ['Erro ao processar: ' . $e->getMessage()]],
            ], 500);
        }
    });
});
