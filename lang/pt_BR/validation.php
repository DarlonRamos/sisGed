<?php

return [
    'required' => 'O campo :attribute é obrigatório.',
    'string' => 'O campo :attribute deve ser um texto.',
    'max' => [
        'string' => 'O campo :attribute não pode ter mais de :max caracteres.',
        'file' => 'O arquivo :attribute não pode ter mais de :max kilobytes.',
    ],
    'min' => [
        'string' => 'O campo :attribute deve ter pelo menos :min caracteres.',
        'file' => 'O arquivo :attribute deve ter pelo menos :min kilobytes.',
    ],
    'file' => 'O campo :attribute deve ser um arquivo.',
    'mimes' => 'O campo :attribute deve ser um arquivo do tipo: :values.',
    'date' => 'O campo :attribute não é uma data válida.',
    'in' => 'O valor selecionado para :attribute é inválido.',
    'nullable' => 'O campo :attribute pode ser nulo.',

    // Atributos personalizados
    'attributes' => [
        'arquivo' => 'arquivo',
        'titulo' => 'título',
        'assunto' => 'assunto',
        'data_emissao_original_papel' => 'data de emissão original',
        'localizacao_fisica_original' => 'localização física original',
        'tipo_documental' => 'tipo documental',
        'operador_responsavel_cpf' => 'CPF do operador',
        'operador_responsavel_nome' => 'nome do operador',
        'equipamento_scanner' => 'equipamento scanner',
        'destinacao_final' => 'destinação final',
    ],
];
