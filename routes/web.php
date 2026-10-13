<?php

use App\Models\DocumentoDigitalizado;
use App\Models\TrilhaAuditoria;
use App\Models\TabelaTemporalidade;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Rules\ValidCpf;
use App\Http\Controllers\TabelaTemporalidadeController;
use Inertia\Inertia;

// Rota inicial
Route::inertia('/', 'welcome')->name('home');

// Rotas autenticadas
Route::middleware(['auth', 'verified'])->group(function () {
    
Route::get('dashboard', function () {
    $totalDocumentos = DocumentoDigitalizado::count();
    
    $porStatus = DocumentoDigitalizado::selectRaw('status, COUNT(*) as total')
        ->groupBy('status')
        ->pluck('total', 'status')
        ->toArray();
    
    $porDestinacao = DocumentoDigitalizado::selectRaw('destinacao_final, COUNT(*) as total')
        ->groupBy('destinacao_final')
        ->pluck('total', 'destinacao_final')
        ->toArray();
    
    $porTipo = DocumentoDigitalizado::selectRaw('tipo_documental, COUNT(*) as total')
        ->groupBy('tipo_documental')
        ->orderByDesc('total')
        ->limit(5)
        ->pluck('total', 'tipo_documental')
        ->toArray();
    
    $ultimosDocumentos = DocumentoDigitalizado::latest()
        ->limit(5)
        ->get(['id', 'titulo', 'tipo_documental', 'status', 'created_at']);
    
    $tamanhoTotal = DocumentoDigitalizado::sum('tamanho_arquivo');
    
    return Inertia::render('dashboard', [
        'stats' => [
            'total' => $totalDocumentos,
            'por_status' => $porStatus,
            'por_destinacao' => $porDestinacao,
            'por_tipo' => $porTipo,
            'tamanho_total' => $tamanhoTotal,
        ],
        'ultimos_documentos' => $ultimosDocumentos,
    ]);
})->name('dashboard');

    // ==========================================
    // DOCUMENTOS DIGITALIZADOS
    // ==========================================

    // Listagem de documentos
    Route::get('/documentos', function (Request $request) {
        $query = DocumentoDigitalizado::query();

        // Filtro: busca por texto (título, assunto, operador)
        if ($request->filled('busca')) {
            $busca = $request->input('busca');
            $query->where(function ($q) use ($busca) {
                $q->where('titulo', 'like', "%{$busca}%")
                ->orWhere('assunto', 'like', "%{$busca}%")
                ->orWhere('operador_responsavel_nome', 'like', "%{$busca}%");
            });
        }

        // Filtro: status
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        // Filtro: tipo documental
        if ($request->filled('tipo_documental')) {
            $query->where('tipo_documental', $request->input('tipo_documental'));
        }

        // Filtro: destinação final
        if ($request->filled('destinacao_final')) {
            $query->where('destinacao_final', $request->input('destinacao_final'));
        }

        // Filtro: data inicial
        if ($request->filled('data_inicio')) {
            $query->whereDate('created_at', '>=', $request->input('data_inicio'));
        }

        // Filtro: data final
        if ($request->filled('data_fim')) {
            $query->whereDate('created_at', '<=', $request->input('data_fim'));
        }

        // Ordenação
        $ordem = $request->input('ordem', 'desc');
        $query->orderBy('created_at', $ordem === 'asc' ? 'asc' : 'desc');

        // Paginação (mantém os filtros na URL)
        $documentos = $query->paginate(15)->withQueryString();

        // Lista de tipos documentais únicos (para o select)
        $tiposDocumentais = DocumentoDigitalizado::distinct()
            ->pluck('tipo_documental')
            ->filter()
            ->sort()
            ->values();

        return Inertia::render('Documentos/Index', [
            'documentos' => $documentos,
            'tiposDocumentais' => $tiposDocumentais,
            'filtros' => $request->only([
                'busca',
                'status',
                'tipo_documental',
                'destinacao_final',
                'data_inicio',
                'data_fim',
                'ordem',
            ]),
        ]);
    })->name('documentos.index');

        Route::get('/documentos/upload', function () {
        $ttds = TabelaTemporalidade::orderBy('tipo_documental')->get([
            'id',
            'tipo_documental',
            'prazo_guarda_corrente',
            'prazo_guarda_intermediaria',
            'destinacao_final',
        ]);

        return Inertia::render('Documentos/Upload', [
            'ttds' => $ttds,
        ]);
    })->name('documentos.upload');

Route::post('/documentos', function (Request $request) {
    try {
        $validated = $request->validate([
            'arquivo' => 'required|file|mimes:pdf|max:51200',
            'titulo' => 'required|string|max:255',
            'assunto' => 'nullable|string',
            'data_emissao_original_papel' => 'nullable|date',
            'localizacao_fisica_original' => 'nullable|string|max:255',
            'tipo_documental' => 'required|string|max:100',
            'operador_responsavel_cpf' => ['required', 'string', 'max:14', new ValidCpf()],
            'operador_responsavel_nome' => 'required|string|max:255',
            'equipamento_scanner' => 'nullable|string|max:100',
            'destinacao_final' => 'required|in:GUARDA_PERMANENTE,GUARDA_TEMPORARIA',
        ]);

        $arquivo = $request->file('arquivo');
        $hash = hash_file('sha256', $arquivo->getRealPath());
        $nomeArquivo = $hash . '.pdf';

        $caminhoSalvo = $arquivo->storeAs(
            'documentos/' . date('Y/m/d'),
            $nomeArquivo,
            'public'
        );

        $cpfFormatado = preg_replace(
            '/(\d{3})(\d{3})(\d{3})(\d{2})/',
            '$1.$2.$3-$4',
            preg_replace('/[^0-9]/', '', $validated['operador_responsavel_cpf'])
        );

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
            'operador_responsavel_cpf' => $cpfFormatado,
            'operador_responsavel_nome' => $validated['operador_responsavel_nome'],
            'equipamento_scanner' => $validated['equipamento_scanner'] ?? null,
            'destinacao_final' => $validated['destinacao_final'],
            'status' => 'DIGITALIZADO',
            'tenant_id' => 'default',
        ]);

        TrilhaAuditoria::create([
            'documento_digitalizado_id' => $documento->id,
            'usuario_id' => Auth::id(),
            'acao' => 'CRIOU',
            'detalhes' => ['titulo' => $documento->titulo, 'hash' => $hash],
            'ip_origem' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        // ⚠️ Retornar JSON se for requisição AJAX/Axios
        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Documento digitalizado com sucesso!',
                'documento' => $documento,
            ], 201);
        }

        return redirect()->route('documentos.index')
    ->with('toast', [
        'type' => 'success',
        'message' => 'Documento digitalizado com sucesso!',
    ]);

    } catch (\Illuminate\Validation\ValidationException $e) {
        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors(),
            ], 422);
        }
        throw $e;
    }
})->name('documentos.store');

        // ==========================================
    // VISUALIZAR DOCUMENTO
    // ==========================================
Route::get('/documentos/{id}', function ($id) {
    $documento = DocumentoDigitalizado::with('tabelaTemporalidade')->findOrFail($id);
    
    // Registrar visualização na auditoria
    TrilhaAuditoria::create([
        'documento_digitalizado_id' => $documento->id,
        'usuario_id' => Auth::id(),
        'acao' => 'VISUALIZOU',
        'ip_origem' => request()->ip(),
        'user_agent' => request()->userAgent(),
    ]);
    
    return Inertia::render('Documentos/Show', [
        'documento' => $documento,
    ]);
})->name('documentos.show');

    // ==========================================
    // DOWNLOAD DO ARQUIVO
    // ==========================================
Route::get('/documentos/{id}/download', function ($id) {
    $documento = DocumentoDigitalizado::findOrFail($id);
    
    if (!Storage::disk('public')->exists($documento->caminho_arquivo)) {
        abort(404, 'Arquivo não encontrado');
    }
    
    // Registrar download na auditoria
    TrilhaAuditoria::create([
        'documento_digitalizado_id' => $documento->id,
        'usuario_id' => Auth::id(),
        'acao' => 'BAIXOU',
        'ip_origem' => request()->ip(),
        'user_agent' => request()->userAgent(),
    ]);
    
    // Nome amigável para o download
    $nomeArquivo = \Illuminate\Support\Str::slug($documento->titulo) . '.pdf';
    $caminhoCompleto = Storage::disk('public')->path($documento->caminho_arquivo);
    
    // Força o download
    return response()->download($caminhoCompleto, $nomeArquivo);
})->name('documentos.download');

Route::get('/documentos/{id}/visualizar', function ($id) {
    $documento = DocumentoDigitalizado::findOrFail($id);

    if (!Storage::disk('public')->exists($documento->caminho_arquivo)) {
        abort(404, 'Arquivo não encontrado');
    }

    TrilhaAuditoria::create([
        'documento_digitalizado_id' => $documento->id,
        'usuario_id' => Auth::id(),
        'acao' => 'VISUALIZOU',
        'ip_origem' => request()->ip(),
        'user_agent' => request()->userAgent(),
    ]);

    $caminhoCompleto = Storage::disk('public')->path($documento->caminho_arquivo);
    $nomeArquivo = \Illuminate\Support\Str::slug($documento->titulo) . '.pdf';

    return response()->file($caminhoCompleto, [
        'Content-Type' => 'application/pdf',
        'Content-Disposition' => 'inline; filename="' . $nomeArquivo . '"',
    ]);
})->name('documentos.visualizar');

    // ==========================================
    // VERIFICAR INTEGRIDADE
    // ==========================================
    Route::get('/documentos/{id}/verificar', function ($id) {
        $documento = DocumentoDigitalizado::findOrFail($id);
        
        if (!Storage::disk('public')->exists($documento->caminho_arquivo)) {
            return response()->json([
                'integro' => false,
                'mensagem' => 'Arquivo não encontrado no storage',
            ], 404);
        }
        
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
                'integro' => $integro,
            ],
            'ip_origem' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
        
         return Inertia::render('Documentos/Verificar', [
            'documento' => $documento,
            'integro' => $integro,
            'hash_atual' => $hashAtual,
        ]);
    })->name('documentos.verificar');

    // ==========================================
    // TABELA DE TEMPORALIDADE DOCUMENTAL (TTD)
    // ==========================================
    Route::resource('ttd', TabelaTemporalidadeController::class)
        ->except(['show']);
});

// Rotas de configurações (settings)
require __DIR__.'/settings.php';
