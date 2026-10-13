import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Download, ShieldCheck, FileText, Calendar, HardDrive, Eye } from 'lucide-react';
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

interface Documento {
    id: number;
    titulo: string;
    assunto: string | null;
    data_emissao_original_papel: string | null;
    localizacao_fisica_original: string | null;
    tipo_documental: string;
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

    return (
        <>
            <Head title={documento.titulo} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4 max-w-5xl mx-auto">
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
                <div className="flex gap-2 flex-wrap">
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
                                <p className="text-sm text-muted-foreground">Tipo Documental</p>
                                <p className="font-medium">{documento.tipo_documental}</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-sm text-muted-foreground">Data de Emissão Original</p>
                                <p className="font-medium">{formatarData(documento.data_emissao_original_papel)}</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-sm text-muted-foreground">Localização Física Original</p>
                                <p className="font-medium">{documento.localizacao_fisica_original || '-'}</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-sm text-muted-foreground">Destinação Final</p>
                                <Badge variant={documento.destinacao_final === 'GUARDA_PERMANENTE' ? 'default' : 'secondary'}>
                                    {documento.destinacao_final === 'GUARDA_PERMANENTE' ? '🛡️ Guarda Permanente' : '📦 Guarda Temporária'}
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
                                <p className="text-sm text-muted-foreground">Data/Hora</p>
                                <p className="font-medium">{formatarData(documento.data_hora_digitalizacao)}</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-sm text-muted-foreground">Operador Responsável</p>
                                <p className="font-medium">{documento.operador_responsavel_nome}</p>
                                <p className="text-sm text-muted-foreground">{documento.operador_responsavel_cpf}</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-sm text-muted-foreground">Equipamento Scanner</p>
                                <p className="font-medium">{documento.equipamento_scanner || '-'}</p>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Resolução</p>
                                    <p className="font-medium">{documento.resolucao_dpi} DPI</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Formato</p>
                                    <p className="font-medium">{documento.formato_arquivo}</p>
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
                            <p className="text-sm text-muted-foreground mb-2">Hash SHA-256</p>
                            <code className="block p-3 bg-muted rounded-md text-xs break-all">
                                {documento.hash_sha256}
                            </code>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Tamanho do Arquivo</p>
                                <p className="font-medium flex items-center gap-2">
                                    <HardDrive className="h-4 w-4" />
                                    {formatarTamanho(documento.tamanho_arquivo)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Caminho no Storage</p>
                                <p className="font-medium text-xs break-all">
                                    {documento.caminho_arquivo}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
