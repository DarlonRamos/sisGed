import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Download,
    ShieldCheck,
    FileText,
    Calendar,
    HardDrive,
    Eye,
    Table2,
    Clock,
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { BreadcrumbItem } from '@/types';

interface TTD {
    id: number;
    tipo_documental: string;
    prazo_guarda_corrente: number;
    prazo_guarda_intermediaria: number;
    destinacao_final: 'GUARDA_PERMANENTE' | 'ELIMINACAO';
    base_legal: string | null;
    observacoes: string | null;
}

interface Documento {
    id: number;
    titulo: string;
    assunto: string | null;
    data_emissao_original_papel: string | null;
    localizacao_fisica_original: string | null;
    tipo_documental: string;
    tabela_temporalidade_id: number | null;
    tabela_temporalidade?: TTD | null;
    suporte_original: string;
    caminho_arquivo: string;
    hash_sha256: string;
    tamanho_arquivo: number;
    formato_arquivo: string;
    resolucao_dpi: number;
    data_hora_digitalizacao: string;
    operador_responsavel_cpf: string;
    operador_responsavel_nome: string;
    equipamento_scanner: string | null;
    destinacao_final: string;
    status: string;
    created_at: string;
}

interface Props {
    documento: Documento;
}

export default function Show({ documento }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Documentos', href: '/documentos' },
        { title: documento.titulo, href: `/documentos/${documento.id}` },
    ];

    const formatarTamanho = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    const formatarData = (data: string | null) => {
        if (!data) return '-';
        return new Date(data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const statusColors: Record<string, string> = {
        PENDENTE: 'bg-yellow-100 text-yellow-800',
        DIGITALIZADO: 'bg-blue-100 text-blue-800',
        ASSINADO: 'bg-green-100 text-green-800',
        ELIMINADO: 'bg-red-100 text-red-800',
    };

    const ttd = documento.tabela_temporalidade;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={documento.titulo} />

            <div className="mx-auto flex h-full max-w-5xl flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/documentos">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                {documento.titulo}
                            </h1>
                            <p className="text-muted-foreground">
                                {documento.assunto || 'Sem assunto'}
                            </p>
                        </div>
                    </div>
                    <Badge className={statusColors[documento.status] || ''}>
                        {documento.status}
                    </Badge>
                </div>

                {/* Ações */}
                <div className="flex flex-wrap gap-2">
                    <a href={`/documentos/${documento.id}/download`}>
                        <Button>
                            <Download className="mr-2 h-4 w-4" />
                            Baixar PDF
                        </Button>
                    </a>
                    <a
                        href={`/documentos/${documento.id}/visualizar`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button variant="secondary">
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar PDF
                        </Button>
                    </a>
                    <Link href={`/documentos/${documento.id}/verificar`}>
                        <Button variant="outline">
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            Verificar Integridade
                        </Button>
                    </Link>
                </div>

                {/* Card: TTD Vinculada */}
                {ttd ? (
                    <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Table2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                Tabela de Temporalidade Vinculada
                            </CardTitle>
                            <CardDescription>
                                Ciclo de vida do documento segundo a TTD
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <p className="text-muted-foreground text-sm">
                                        Tipo Documental
                                    </p>
                                    <p className="font-semibold">
                                        {ttd.tipo_documental}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-sm">
                                        Destinação Final
                                    </p>
                                    {ttd.destinacao_final ===
                                    'GUARDA_PERMANENTE' ? (
                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300">
                                            🛡️ Guarda Permanente
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
                                            🗑️ Eliminação
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="flex items-center gap-3">
                                    <Clock className="h-8 w-8 text-blue-600" />
                                    <div>
                                        <p className="text-muted-foreground text-sm">
                                            Prazo Corrente
                                        </p>
                                        <p className="font-semibold">
                                            {ttd.prazo_guarda_corrente} ano(s)
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="h-8 w-8 text-blue-600" />
                                    <div>
                                        <p className="text-muted-foreground text-sm">
                                            Prazo Intermediário
                                        </p>
                                        <p className="font-semibold">
                                            {ttd.prazo_guarda_intermediaria}{' '}
                                            ano(s)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {ttd.base_legal && (
                                <>
                                    <Separator />
                                    <div>
                                        <p className="text-muted-foreground text-sm">
                                            Base Legal
                                        </p>
                                        <p className="text-sm font-medium">
                                            {ttd.base_legal}
                                        </p>
                                    </div>
                                </>
                            )}

                            <Separator />

                            <div className="rounded-md bg-blue-100/50 p-3 dark:bg-blue-950/40">
                                <p className="text-sm text-blue-900 dark:text-blue-100">
                                    <strong>Prazo total de guarda:</strong>{' '}
                                    {ttd.prazo_guarda_corrente +
                                        ttd.prazo_guarda_intermediaria}{' '}
                                    ano(s)
                                    {ttd.destinacao_final ===
                                        'GUARDA_PERMANENTE' && (
                                        <span className="ml-2">
                                            → Após esse prazo, mantém-se em
                                            guarda permanente para sempre.
                                        </span>
                                    )}
                                    {ttd.destinacao_final === 'ELIMINACAO' && (
                                        <span className="ml-2">
                                            → Após esse prazo, pode ser
                                            eliminado mediante edital.
                                        </span>
                                    )}
                                </p>
                            </div>

                            <div className="flex justify-end">
                                <Link href={`/ttd/${ttd.id}/edit`}>
                                    <Button variant="outline" size="sm">
                                        <Table2 className="mr-2 h-4 w-4" />
                                        Ver TTD completa
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="border-yellow-200 bg-yellow-50/50 dark:border-yellow-900 dark:bg-yellow-950/20">
                        <CardContent className="py-6">
                            <div className="flex items-start gap-3">
                                <Table2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-700 dark:text-yellow-500" />
                                <div>
                                    <p className="font-semibold text-yellow-800 dark:text-yellow-300">
                                        Sem Tabela de Temporalidade vinculada
                                    </p>
                                    <p className="text-sm text-yellow-700 dark:text-yellow-400">
                                        Este documento não possui uma TTD
                                        associada. Isso pode ter ocorrido antes
                                        da implementação do vínculo.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                    {/* Informações do Documento */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Informações do Documento
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-muted-foreground text-sm">
                                    Tipo Documental
                                </p>
                                <p className="font-medium">
                                    {documento.tipo_documental}
                                </p>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-muted-foreground text-sm">
                                    Data de Emissão Original
                                </p>
                                <p className="font-medium">
                                    {formatarData(
                                        documento.data_emissao_original_papel,
                                    )}
                                </p>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-muted-foreground text-sm">
                                    Localização Física Original
                                </p>
                                <p className="font-medium">
                                    {documento.localizacao_fisica_original ||
                                        '-'}
                                </p>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-muted-foreground text-sm">
                                    Destinação Final
                                </p>
                                <Badge
                                    variant={
                                        documento.destinacao_final ===
                                        'GUARDA_PERMANENTE'
                                            ? 'default'
                                            : 'secondary'
                                    }
                                >
                                    {documento.destinacao_final ===
                                    'GUARDA_PERMANENTE'
                                        ? '🛡️ Guarda Permanente'
                                        : '📦 Guarda Temporária'}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dados da Digitalização */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Dados da Digitalização
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-muted-foreground text-sm">
                                    Data/Hora
                                </p>
                                <p className="font-medium">
                                    {formatarData(
                                        documento.data_hora_digitalizacao,
                                    )}
                                </p>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-muted-foreground text-sm">
                                    Operador Responsável
                                </p>
                                <p className="font-medium">
                                    {documento.operador_responsavel_nome}
                                </p>
                                <p className="text-muted-foreground text-sm">
                                    {documento.operador_responsavel_cpf}
                                </p>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-muted-foreground text-sm">
                                    Equipamento Scanner
                                </p>
                                <p className="font-medium">
                                    {documento.equipamento_scanner || '-'}
                                </p>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-muted-foreground text-sm">
                                        Resolução
                                    </p>
                                    <p className="font-medium">
                                        {documento.resolucao_dpi} DPI
                                    </p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-sm">
                                        Formato
                                    </p>
                                    <p className="font-medium">
                                        {documento.formato_arquivo}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Hash de Integridade */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5" />
                            Integridade do Arquivo
                        </CardTitle>
                        <CardDescription>
                            Hash SHA-256 calculado no momento da digitalização
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-muted-foreground mb-2 text-sm">
                                Hash SHA-256
                            </p>
                            <code className="bg-muted block rounded-md p-3 text-xs break-all">
                                {documento.hash_sha256}
                            </code>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-muted-foreground text-sm">
                                    Tamanho do Arquivo
                                </p>
                                <p className="flex items-center gap-2 font-medium">
                                    <HardDrive className="h-4 w-4" />
                                    {formatarTamanho(documento.tamanho_arquivo)}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-sm">
                                    Caminho no Storage
                                </p>
                                <p className="text-xs font-medium break-all">
                                    {documento.caminho_arquivo}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
