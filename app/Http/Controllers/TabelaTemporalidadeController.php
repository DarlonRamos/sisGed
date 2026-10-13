<?php

namespace App\Http\Controllers;

use App\Models\TabelaTemporalidade;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TabelaTemporalidadeController extends Controller
{
    /**
     * Lista todas as TTDs cadastradas.
     */
    public function index()
    {
        $ttds = TabelaTemporalidade::withCount('documentos')
            ->orderBy('tipo_documental')
            ->get();

        return Inertia::render('TabelaTemporalidade/Index', [
            'ttds' => $ttds,
        ]);
    }

    /**
     * Mostra o formulário de criação.
     */
    public function create()
    {
        return Inertia::render('TabelaTemporalidade/Create');
    }

    /**
     * Salva uma nova TTD.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tipo_documental' => 'required|string|max:255|unique:tabela_temporalidades,tipo_documental',
            'prazo_guarda_corrente' => 'required|integer|min:0|max:100',
            'prazo_guarda_intermediaria' => 'required|integer|min:0|max:100',
            'destinacao_final' => 'required|in:GUARDA_PERMANENTE,ELIMINACAO',
            'base_legal' => 'nullable|string|max:255',
            'observacoes' => 'nullable|string',
        ], [
            'tipo_documental.unique' => 'Já existe uma TTD para esse tipo documental.',
            'tipo_documental.required' => 'O tipo documental é obrigatório.',
            'prazo_guarda_corrente.required' => 'O prazo de guarda corrente é obrigatório.',
            'prazo_guarda_intermediaria.required' => 'O prazo de guarda intermediária é obrigatório.',
            'destinacao_final.required' => 'A destinação final é obrigatória.',
        ]);

        TabelaTemporalidade::create($validated);

        return redirect()
            ->route('ttd.index')
            ->with('toast', [
                'type' => 'success',
                'message' => 'Tabela de Temporalidade criada com sucesso!',
            ]);
    }

    /**
     * Mostra o formulário de edição.
     */
    public function edit(TabelaTemporalidade $ttd)
        {
            $ttd->loadCount('documentos');

            return Inertia::render('TabelaTemporalidade/Edit', [
                'ttd' => $ttd,
        ]);
    }

    /**
     * Atualiza uma TTD existente.
     */
    public function update(Request $request, TabelaTemporalidade $ttd)
    {
        $validated = $request->validate([
            'tipo_documental' => 'required|string|max:255|unique:tabela_temporalidades,tipo_documental,' . $ttd->id,
            'prazo_guarda_corrente' => 'required|integer|min:0|max:100',
            'prazo_guarda_intermediaria' => 'required|integer|min:0|max:100',
            'destinacao_final' => 'required|in:GUARDA_PERMANENTE,ELIMINACAO',
            'base_legal' => 'nullable|string|max:255',
            'observacoes' => 'nullable|string',
        ], [
            'tipo_documental.unique' => 'Já existe uma TTD para esse tipo documental.',
        ]);

        $ttd->update($validated);

        return redirect()
            ->route('ttd.index')
            ->with('toast', [
                'type' => 'success',
                'message' => 'Tabela de Temporalidade atualizada com sucesso!',
            ]);
    }

    /**
     * Remove uma TTD.
     */
    public function destroy(TabelaTemporalidade $ttd)
    {
        // Verificar se há documentos vinculados
        if ($ttd->documentos()->count() > 0) {
            return redirect()
                ->route('ttd.index')
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'Não é possível excluir: existem documentos vinculados a esta TTD.',
                ]);
        }

        $ttd->delete();

        return redirect()
            ->route('ttd.index')
            ->with('toast', [
                'type' => 'success',
                'message' => 'Tabela de Temporalidade excluída com sucesso!',
            ]);
    }
}
