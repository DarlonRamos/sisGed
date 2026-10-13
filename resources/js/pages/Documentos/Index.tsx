import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    FileText,
    Upload,
    Search,
    Filter,
    Eye,
    Download,
    ShieldCheck,
    X,
    Calendar,
    ArrowUpDown,
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { BreadcrumbItem } from '@/types';

interface Documento {
    id: number;
    titulo: string;
    assunto: string | null;
    tipo_documental: string;
    hash_sha256: string;
    status: string;
    destinacao_final: string;
    data_hora_digitalizacao: string;
    operador_responsavel_nome: string;
    tamanho_arquivo: number;
    created_at: string;
}

interface Filtros {
    busca?: string;
    status?: string;
    tipo_documental?: string;
    destinacao_final?: string;
    data_inicio?: string;
    data_fim?: string;
    ordem?: string;
}

interface Props {
    documentos: {
        data: Documento[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    tiposDocumentais: string[];
    filtros: Filtros;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Documentos',
        href: '/documentos',
    },
];

const statusColors: Record<string, string> = {
    PENDENTE: 'bg-yellow-100 text-yellow-800',
    DIGITALIZADO: 'bg-blue-100 text-blue-800',
    ASSINADO: 'bg-green-100 text-green-800',
    ELIMINADO: 'bg-red-100 text-red-800',
};

export default function Index({ documentos, tiposDocumentais, filtros }: Props) {
    // Estado dos filtros (inicializa com os filtros da URL)
    const [busca, setBusca] = useState(filtros.busca || '');
    const [status, setStatus] = useState(filtros.status || 'todos');
    const [tipoDocumental, setTipoDocumental] = useState(filtros.tipo_documental || 'todos');
    const [destinacaoFinal, setDestinacaoFinal] = useState(filtros.destinacao_final || 'todos');
    const [dataInicio, setDataInicio] = useState(filtros.data_inicio || '');
    const [dataFim, setDataFim] = useState(filtros.data_fim || '');
    const [ordem, setOrdem] = useState(filtros.ordem || 'desc');
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    // Função para aplicar filtros (envia para o servidor)
    const aplicarFiltros = useCallback(
        (overrides = {}) => {
            const params = {
                busca: busca || undefined,
                status: status !== 'todos' ? status : undefined,
                tipo_documental: tipoDocumental !== 'todos' ? tipoDocumental : undefined,
                destinacao_final: destinacaoFinal !== 'todos' ? destinacaoFinal : undefined,
                data_inicio: dataInicio || undefined,
                data_fim: dataFim || undefined,
                ordem,
                ...overrides,
            };

            router.get('/documentos', params, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        },
        [busca, status, tipoDocumental, destinacaoFinal, dataInicio, dataFim, ordem]
    );

    // Debounce da busca (500ms)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (busca !== filtros.busca) {
                aplicarFiltros({ busca: busca || undefined });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [busca]);

    const limparFiltros = () => {
        setBusca('');
        setStatus('todos');
        setTipoDocumental('todos');
        setDestinacaoFinal('todos');
        setDataInicio('');
        setDataFim('');
        setOrdem('desc');
        router.get('/documentos', {}, { preserveState: false, replace: true });
    };

    // Conta quantos filtros estão ativos
    const filtrosAtivos = [
        busca,
        status !== 'todos' ? status : '',
        tipoDocumental !== 'todos' ? tipoDocumental : '',
        destinacaoFinal !== 'todos' ? destinacaoFinal : '',
        dataInicio,
        dataFim,
    ].filter(Boolean).length;

    const formatarTamanho = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    const formatarData = (data: string) => {
        return new Date(data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

return (
    <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Documentos Digitalizados" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            📁 Documentos Digitalizados
                        </h1>
                        <p className="text-muted-foreground">
                            Gerencie os documentos físicos digitalizados do acervo
                        </p>
                    </div>
                    <Link href="/documentos/upload">
                        <Button size="lg">
                            <Upload className="mr-2 h-5 w-5" />
                            Novo Documento
                        </Button>
                    </Link>
                </div>

                {/* Cards de Estatísticas */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total
                            </CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{documentos.total}</div>
                            <p className="text-xs text-muted-foreground">
                                {filtrosAtivos > 0 ? 'Filtrados' : 'Documentos no acervo'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Digitalizados
                            </CardTitle>
                            <ShieldCheck className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">
                                {documentos.data.filter((d) => d.status === 'DIGITALIZADO').length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Nesta página
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Guarda Permanente
                            </CardTitle>
                            <ShieldCheck className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {documentos.data.filter((d) => d.destinacao_final === 'GUARDA_PERMANENTE').length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Nesta página
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Página
                            </CardTitle>
                            <FileText className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">
                                {documentos.current_page}/{documentos.last_page}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {documentos.per_page} por página
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filtros */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base">Filtros</CardTitle>
                                <CardDescription>
                                    {filtrosAtivos > 0
                                        ? `${filtrosAtivos} filtro(s) ativo(s)`
                                        : 'Nenhum filtro aplicado'}
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                {filtrosAtivos > 0 && (
                                    <Button variant="ghost" size="sm" onClick={limparFiltros}>
                                        <X className="mr-2 h-4 w-4" />
                                        Limpar
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setMostrarFiltros(!mostrarFiltros)}
                                >
                                    <Filter className="mr-2 h-4 w-4" />
                                    {mostrarFiltros ? 'Ocultar' : 'Mostrar'}
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Busca sempre visível */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por título, assunto ou operador..."
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Filtros avançados */}
                        {mostrarFiltros && (
                            <>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                    {/* Status */}
                                    <div className="grid gap-2">
                                        <Label>Status</Label>
                                        <Select
                                            value={status}
                                            onValueChange={(value) => {
                                                setStatus(value);
                                                aplicarFiltros({
                                                    status: value !== 'todos' ? value : undefined,
                                                });
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="todos">Todos</SelectItem>
                                                <SelectItem value="PENDENTE">Pendente</SelectItem>
                                                <SelectItem value="DIGITALIZADO">Digitalizado</SelectItem>
                                                <SelectItem value="ASSINADO">Assinado</SelectItem>
                                                <SelectItem value="ELIMINADO">Eliminado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Tipo Documental */}
                                    <div className="grid gap-2">
                                        <Label>Tipo Documental</Label>
                                        <Select
                                            value={tipoDocumental}
                                            onValueChange={(value) => {
                                                setTipoDocumental(value);
                                                aplicarFiltros({
                                                    tipo_documental: value !== 'todos' ? value : undefined,
                                                });
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="todos">Todos</SelectItem>
                                                {tiposDocumentais.map((tipo) => (
                                                    <SelectItem key={tipo} value={tipo}>
                                                        {tipo}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Destinação Final */}
                                    <div className="grid gap-2">
                                        <Label>Destinação Final</Label>
                                        <Select
                                            value={destinacaoFinal}
                                            onValueChange={(value) => {
                                                setDestinacaoFinal(value);
                                                aplicarFiltros({
                                                    destinacao_final: value !== 'todos' ? value : undefined,
                                                });
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="todos">Todas</SelectItem>
                                                <SelectItem value="GUARDA_TEMPORARIA">Guarda Temporária</SelectItem>
                                                <SelectItem value="GUARDA_PERMANENTE">Guarda Permanente</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Ordenação */}
                                    <div className="grid gap-2">
                                        <Label>Ordenar por</Label>
                                        <Select
                                            value={ordem}
                                            onValueChange={(value) => {
                                                setOrdem(value);
                                                aplicarFiltros({ ordem: value });
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="desc">Mais recentes</SelectItem>
                                                <SelectItem value="asc">Mais antigos</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Datas */}
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label>Data Inicial</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                type="date"
                                                value={dataInicio}
                                                onChange={(e) => {
                                                    setDataInicio(e.target.value);
                                                    aplicarFiltros({
                                                        data_inicio: e.target.value || undefined,
                                                    });
                                                }}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Data Final</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                type="date"
                                                value={dataFim}
                                                onChange={(e) => {
                                                    setDataFim(e.target.value);
                                                    aplicarFiltros({
                                                        data_fim: e.target.value || undefined,
                                                    });
                                                }}
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Tabela */}
                <Card>
                    <CardContent className="pt-6">
                        {documentos.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">
                                    {filtrosAtivos > 0
                                        ? 'Nenhum documento encontrado com esses filtros'
                                        : 'Nenhum documento cadastrado'}
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                    {filtrosAtivos > 0
                                        ? 'Tente ajustar ou limpar os filtros'
                                        : 'Comece digitalizando seu primeiro documento'}
                                </p>
                                {filtrosAtivos > 0 ? (
                                    <Button variant="outline" onClick={limparFiltros}>
                                        <X className="mr-2 h-4 w-4" />
                                        Limpar filtros
                                    </Button>
                                ) : (
                                    <Link href="/documentos/upload">
                                        <Button>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Digitalizar Documento
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Título</TableHead>
                                                <TableHead>Tipo</TableHead>
                                                <TableHead>Operador</TableHead>
                                                <TableHead>Data</TableHead>
                                                <TableHead>Tamanho</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Ações</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {documentos.data.map((doc) => (
                                                <TableRow key={doc.id}>
                                                    <TableCell className="font-medium">
                                                        <div>
                                                            <div className="font-semibold">{doc.titulo}</div>
                                                            {doc.assunto && (
                                                                <div className="text-sm text-muted-foreground">
                                                                    {doc.assunto}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">
                                                            {doc.tipo_documental}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>{doc.operador_responsavel_nome}</TableCell>
                                                    <TableCell>
                                                        {formatarData(doc.data_hora_digitalizacao)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatarTamanho(doc.tamanho_arquivo)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            className={
                                                                statusColors[doc.status] ||
                                                                'bg-gray-100 text-gray-800'
                                                            }
                                                        >
                                                            {doc.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Link href={`/documentos/${doc.id}`}>
                                                                <Button variant="ghost" size="sm">
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                            <a href={`/documentos/${doc.id}/download`}>
                                                                <Button variant="ghost" size="sm">
                                                                    <Download className="h-4 w-4" />
                                                                </Button>
                                                            </a>
                                                            <Link href={`/documentos/${doc.id}/verificar`}>
                                                                <Button variant="ghost" size="sm">
                                                                    <ShieldCheck className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Paginação */}
                                {documentos.last_page > 1 && (
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="text-sm text-muted-foreground">
                                            Mostrando {documentos.data.length} de {documentos.total} documentos
                                        </div>
                                        <div className="flex gap-1">
                                            {documentos.links.map((link, index) => (
                                                <Link
                                                    key={index}
                                                    href={link.url || '#'}
                                                    className={`px-3 py-1 rounded border text-sm ${
                                                        link.active
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'hover:bg-accent'
                                                    } ${!link.url ? 'opacity-50 pointer-events-none' : ''}`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
