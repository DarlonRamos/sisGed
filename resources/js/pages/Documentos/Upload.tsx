import { Head, Link } from '@inertiajs/react';
import { Upload as UploadIcon, FileText, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState, useRef } from 'react';
import axios from 'axios';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import InputError from '@/components/input-error';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Documentos', href: '/documentos' },
    { title: 'Novo Documento', href: '/documentos/upload' },
];

interface TTD {
    id: number;
    tipo_documental: string;
    prazo_guarda_corrente: number;
    prazo_guarda_intermediaria: number;
    destinacao_final: 'GUARDA_PERMANENTE' | 'ELIMINACAO';
}

interface Props {
    ttds: TTD[];
}

export default function Upload({ ttds }: Props) {
    const [arquivo, setArquivo] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState<number | null>(null);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const inputRef = useRef<HTMLInputElement>(null);

    const [data, setData] = useState({
        titulo: '',
        assunto: '',
        data_emissao_original_papel: '',
        localizacao_fisica_original: '',
        tabela_temporalidade_id: '', // ← MUDOU
        operador_responsavel_cpf: '',
        operador_responsavel_nome: '',
        equipamento_scanner: '',
        destinacao_final: 'GUARDA_TEMPORARIA',
    });

    const setField = (field: keyof typeof data, value: string) => {
        setData((prev) => ({ ...prev, [field]: value }));
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files?.[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type === 'application/pdf') {
                setArquivo(file);
            } else {
                setErrors({ arquivo: ['Por favor, selecione um arquivo PDF'] });
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            if (file.type === 'application/pdf') {
                setArquivo(file);
                setErrors((prev) => {
                    const { arquivo, ...rest } = prev;
                    return rest;
                });
            } else {
                setErrors({ arquivo: ['Por favor, selecione um arquivo PDF'] });
            }
        }
    };

    const removeFile = () => {
        setArquivo(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});

        if (!arquivo) {
            setErrors({ arquivo: ['Selecione um arquivo PDF'] });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        setProcessing(true);
        setProgress(0);

        try {
            const formData = new FormData();
            formData.append('arquivo', arquivo);
            formData.append('titulo', data.titulo);
            formData.append('assunto', data.assunto);
            formData.append('data_emissao_original_papel', data.data_emissao_original_papel);
            formData.append('localizacao_fisica_original', data.localizacao_fisica_original);
            formData.append('tabela_temporalidade_id', data.tabela_temporalidade_id);
            formData.append('operador_responsavel_cpf', data.operador_responsavel_cpf);
            formData.append('operador_responsavel_nome', data.operador_responsavel_nome);
            formData.append('equipamento_scanner', data.equipamento_scanner);
            formData.append('destinacao_final', data.destinacao_final);

            const response = await axios.post('/api/documentos/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentage = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setProgress(percentage);
                    }
                },
            });

            if (response.data.success) {
                setProgress(100);
                toast.success('Documento digitalizado com sucesso!', {
                    description: `Título: ${response.data.documento?.titulo}`,
                });
                setTimeout(() => {
                    window.location.href = '/documentos';
                }, 1000);
            }
        } catch (error: any) {
            setProcessing(false);
            setProgress(null);

            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
                toast.error('Erro de validação', {
                    description: 'Corrija os campos destacados em vermelho.',
                });
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (error.response?.status === 401) {
                toast.error('Sessão expirada', {
                    description: 'Faça login novamente.',
                });
                setErrors({ geral: ['Sessão expirada. Faça login novamente.'] });
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (error.response?.status === 419) {
                toast.error('Sessão expirada (CSRF)', {
                    description: 'Recarregue a página.',
                });
                setErrors({ geral: ['Sessão expirada (CSRF). Recarregue a página.'] });
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                toast.error('Erro no upload', {
                    description: error.response?.data?.message || 'Tente novamente.',
                });
                setErrors({
                    geral: [
                        error.response?.data?.message ||
                            'Erro ao processar o upload. Tente novamente.',
                    ],
                });
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Novo Documento" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4 max-w-5xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        📄 Digitalizar Documento
                    </h1>
                    <p className="text-muted-foreground">
                        Faça upload do documento físico digitalizado e preencha os metadados
                    </p>
                </div>

                {/* Alerta: nenhuma TTD cadastrada */}
                {ttds.length === 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-yellow-700 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h3 className="text-yellow-800 font-semibold mb-1">
                                    ⚠️ Nenhum tipo documental cadastrado
                                </h3>
                                <p className="text-yellow-700 text-sm mb-3">
                                    Antes de digitalizar documentos, você precisa cadastrar
                                    pelo menos uma <strong>Tabela de Temporalidade (TTD)</strong>.
                                </p>
                                <Link href="/ttd/create">
                                    <Button size="sm" variant="outline">
                                        Criar TTD agora
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {Object.keys(errors).length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <h3 className="text-red-800 font-semibold mb-2">
                                    Corrija os erros abaixo:
                                </h3>
                                <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
                                    {Object.entries(errors).map(([campo, mensagens]) => (
                                        <li key={campo}>
                                            <strong>{campo}:</strong>{' '}
                                            {Array.isArray(mensagens)
                                                ? mensagens.join(', ')
                                                : mensagens}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>1. Arquivo Digitalizado</CardTitle>
                            <CardDescription>Formatos aceitos: PDF (máximo 50 MB)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {!arquivo ? (
                                <div
                                    role="button"
                                    tabIndex={0}
                                    aria-label="Selecionar arquivo PDF"
                                    className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                                        dragActive
                                            ? 'border-primary bg-primary/5'
                                            : 'border-muted-foreground/25 hover:border-primary'
                                    }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    onClick={() => inputRef.current?.click()}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            inputRef.current?.click();
                                        }
                                    }}
                                >
                                    <UploadIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                    <p className="text-lg font-medium mb-2">
                                        Arraste o PDF aqui ou clique para selecionar
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Resolução mínima: 300 DPI | Formato: PDF/A
                                    </p>
                                    <input
                                        ref={inputRef}
                                        type="file"
                                        accept="application/pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center gap-4 p-4 border rounded-lg">
                                    <FileText className="h-10 w-10 text-primary" />
                                    <div className="flex-1">
                                        <p className="font-medium">{arquivo.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {(arquivo.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={removeFile}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                            <InputError message={errors.arquivo?.[0]} className="mt-2" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>2. Metadados do Documento</CardTitle>
                            <CardDescription>
                                Informações obrigatórias conforme Decreto 10.278/2020
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="titulo">Título do Documento *</Label>
                                <Input
                                    id="titulo"
                                    name="titulo"
                                    value={data.titulo}
                                    onChange={(e) => setField('titulo', e.target.value)}
                                    placeholder="Ex: Processo de Licitação nº 045/2018"
                                    required
                                />
                                <InputError message={errors.titulo?.[0]} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="assunto">Assunto / Descrição</Label>
                                <Input
                                    id="assunto"
                                    name="assunto"
                                    value={data.assunto}
                                    onChange={(e) => setField('assunto', e.target.value)}
                                    placeholder="Ex: Aquisição de Equipamentos de Informática"
                                />
                                <InputError message={errors.assunto?.[0]} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="tabela_temporalidade_id">
                                        Tipo Documental *
                                    </Label>
                                    <Select
                                        value={data.tabela_temporalidade_id}
                                        onValueChange={(value) =>
                                            setField('tabela_temporalidade_id', value)
                                        }
                                        disabled={ttds.length === 0}
                                    >
                                        <SelectTrigger id="tabela_temporalidade_id">
                                            <SelectValue placeholder="Selecione o tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ttds.map((ttd) => (
                                                <SelectItem
                                                    key={ttd.id}
                                                    value={String(ttd.id)}
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">
                                                            {ttd.tipo_documental}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {ttd.prazo_guarda_corrente} anos +{' '}
                                                            {ttd.prazo_guarda_intermediaria} anos
                                                            {' • '}
                                                            {ttd.destinacao_final === 'GUARDA_PERMANENTE'
                                                                ? '🛡️ Permanente'
                                                                : '🗑️ Eliminação'}
                                                        </span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.tabela_temporalidade_id?.[0]} />
                                    {ttds.length === 0 && (
                                        <p className="text-xs text-yellow-600">
                                            Cadastre uma TTD antes de continuar
                                        </p>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="data_emissao_original_papel">
                                        Data de Emissão Original
                                    </Label>
                                    <Input
                                        id="data_emissao_original_papel"
                                        name="data_emissao_original_papel"
                                        type="date"
                                        value={data.data_emissao_original_papel}
                                        onChange={(e) =>
                                            setField(
                                                'data_emissao_original_papel',
                                                e.target.value
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errors.data_emissao_original_papel?.[0]}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="localizacao_fisica_original">
                                    Localização Física do Original
                                </Label>
                                <Input
                                    id="localizacao_fisica_original"
                                    name="localizacao_fisica_original"
                                    value={data.localizacao_fisica_original}
                                    onChange={(e) =>
                                        setField('localizacao_fisica_original', e.target.value)
                                    }
                                    placeholder="Ex: Arquivo Central – Estante B – Caixas 12 a 15"
                                />
                                <InputError
                                    message={errors.localizacao_fisica_original?.[0]}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="destinacao_final">Destinação Final *</Label>
                                <Select
                                    value={data.destinacao_final}
                                    onValueChange={(value) =>
                                        setField('destinacao_final', value)
                                    }
                                >
                                    <SelectTrigger id="destinacao_final">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="GUARDA_TEMPORARIA">
                                            Guarda Temporária (pode ser eliminado após prazo)
                                        </SelectItem>
                                        <SelectItem value="GUARDA_PERMANENTE">
                                            Guarda Permanente (nunca eliminar)
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.destinacao_final?.[0]} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>3. Responsável pela Digitalização</CardTitle>
                            <CardDescription>
                                Dados do operador que realizou a digitalização
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="operador_responsavel_nome">
                                        Nome Completo *
                                    </Label>
                                    <Input
                                        id="operador_responsavel_nome"
                                        name="operador_responsavel_nome"
                                        value={data.operador_responsavel_nome}
                                        onChange={(e) =>
                                            setField(
                                                'operador_responsavel_nome',
                                                e.target.value
                                            )
                                        }
                                        placeholder="Ex: Carlos Eduardo M. Silva"
                                        required
                                    />
                                    <InputError
                                        message={errors.operador_responsavel_nome?.[0]}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="operador_responsavel_cpf">CPF *</Label>
                                    <Input
                                        id="operador_responsavel_cpf"
                                        name="operador_responsavel_cpf"
                                        value={data.operador_responsavel_cpf}
                                        onChange={(e) => {
                                            const numeros = e.target.value.replace(/\D/g, '');
                                            const limitado = numeros.slice(0, 11);
                                            const formatado = limitado
                                                .replace(/(\d{3})(\d)/, '$1.$2')
                                                .replace(/(\d{3})(\d)/, '$1.$2')
                                                .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                                            setField('operador_responsavel_cpf', formatado);
                                        }}
                                        placeholder="000.000.000-00"
                                        maxLength={14}
                                        required
                                    />
                                    <InputError
                                        message={errors.operador_responsavel_cpf?.[0]}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="equipamento_scanner">
                                    Equipamento Scanner
                                </Label>
                                <Input
                                    id="equipamento_scanner"
                                    name="equipamento_scanner"
                                    value={data.equipamento_scanner}
                                    onChange={(e) =>
                                        setField('equipamento_scanner', e.target.value)
                                    }
                                    placeholder="Ex: Fujitsu FI-7160"
                                />
                                <InputError message={errors.equipamento_scanner?.[0]} />
                            </div>
                        </CardContent>
                    </Card>

                    {progress !== null && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span>Enviando documento...</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                                <div
                                    className="bg-primary h-2 rounded-full transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-4">
                        <Link href="/documentos">
                            <Button type="button" variant="outline">
                                Cancelar
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={processing || !arquivo || ttds.length === 0}
                        >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            {processing ? 'Enviando...' : 'Digitalizar Documento'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
