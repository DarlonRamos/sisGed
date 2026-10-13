import { Head, Link } from '@inertiajs/react';
import {
    FileText,
    FileCheck,
    FileX,
    HardDrive,
    TrendingUp,
    Clock,
    Eye,
    Upload,
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

interface Stats {
    total: number;
    por_status: Record<string, number>;
    por_destinacao: Record<string, number>;
    por_tipo: Record<string, number>;
    tamanho_total: number;
}

interface Documento {
    id: number;
    titulo: string;
    tipo_documental: string;
    status: string;
    created_at: string;
}

interface Props {
    stats: Stats;
    ultimos_documentos: Documento[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const statusColors: Record<string, string> = {
    PENDENTE: 'bg-yellow-100 text-yellow-800',
    DIGITALIZADO: 'bg-blue-100 text-blue-800',
    ASSINADO: 'bg-green-100 text-green-800',
    ELIMINADO: 'bg-red-100 text-red-800',
};

export default function Dashboard({ stats, ultimos_documentos }: Props) {
    const formatarTamanho = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
        return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
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

    const totalDigitalizados = stats.por_status['DIGITALIZADO'] || 0;
    const totalAssinados = stats.por_status['ASSINADO'] || 0;
    const totalEliminados = stats.por_status['ELIMINADO'] || 0;
    const totalGuardaPermanente = stats.por_destinacao['GUARDA_PERMANENTE'] || 0;

   return (
    <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                             Dashboard
                        </h1>
                        <p className="text-muted-foreground">
                            Visão geral do acervo documental digitalizado
                        </p>
                    </div>
                    <Link href="/documentos/upload">
                        <Button size="lg">
                            <Upload className="mr-2 h-5 w-5" />
                            Novo Documento
                        </Button>
                    </Link>
                </div>

                {/* Cards de Estatísticas Principais */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total de Documentos
                            </CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats.total}</div>
                            <p className="text-xs text-muted-foreground">
                                Documentos no acervo
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Digitalizados
                            </CardTitle>
                            <FileCheck className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-600">
                                {totalDigitalizados}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Prontos para uso
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Guarda Permanente
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-600">
                                {totalGuardaPermanente}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Documentos históricos
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Armazenamento
                            </CardTitle>
                            <HardDrive className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-purple-600">
                                {formatarTamanho(stats.tamanho_total)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Espaço utilizado
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Grid de Informações */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Documentos por Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle> Documentos por Status</CardTitle>
                            <CardDescription>
                                Distribuição dos documentos por status atual
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {Object.keys(stats.por_status).length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    Nenhum documento cadastrado
                                </p>
                            ) : (
                                Object.entries(stats.por_status).map(([status, total]) => (
                                    <div key={status} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Badge className={statusColors[status] || ''}>
                                                {status}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">{total}</span>
                                            <span className="text-xs text-muted-foreground">
                                                ({stats.total > 0 ? Math.round((total / stats.total) * 100) : 0}%)
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Documentos por Tipo (Top 5) */}
                    <Card>
                        <CardHeader>
                            <CardTitle>📊 Top 5 Tipos Documentais</CardTitle>
                            <CardDescription>
                                Tipos de documentos mais digitalizados
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {Object.keys(stats.por_tipo).length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    Nenhum documento cadastrado
                                </p>
                            ) : (
                                Object.entries(stats.por_tipo).map(([tipo, total]) => (
                                    <div key={tipo} className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium">{tipo}</span>
                                            <span className="text-muted-foreground">{total}</span>
                                        </div>
                                        <div className="w-full bg-secondary rounded-full h-2">
                                            <div
                                                className="bg-primary h-2 rounded-full transition-all"
                                                style={{
                                                    width: `${stats.total > 0 ? (total / stats.total) * 100 : 0}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Últimos Documentos */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle> Últimos Documentos</CardTitle>
                            <CardDescription>
                                Documentos digitalizados recentemente
                            </CardDescription>
                        </div>
                        <Link href="/documentos">
                            <Button variant="outline" size="sm">
                                Ver todos
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {ultimos_documentos.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">
                                    Nenhum documento ainda
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                    Comece digitalizando seu primeiro documento
                                </p>
                                <Link href="/documentos/upload">
                                    <Button>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Digitalizar Documento
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {ultimos_documentos.map((doc) => (
                                    <div key={doc.id}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 flex-1">
                                                <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium truncate">
                                                        {doc.titulo}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {doc.tipo_documental} • {formatarData(doc.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge className={statusColors[doc.status] || ''}>
                                                    {doc.status}
                                                </Badge>
                                                <Link href={`/documentos/${doc.id}`}>
                                                    <Button variant="ghost" size="sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                        <Separator className="mt-4" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
