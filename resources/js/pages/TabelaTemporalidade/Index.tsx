import { Head, Link, router } from '@inertiajs/react';
import {
    Plus,
    Pencil,
    Trash2,
    Table2,
    FileText,
    Clock,
    ShieldCheck,
    AlertTriangle,
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { BreadcrumbItem } from '@/types';

interface TTD {
    id: number;
    tipo_documental: string;
    prazo_guarda_corrente: number;
    prazo_guarda_intermediaria: number;
    destinacao_final: 'GUARDA_PERMANENTE' | 'ELIMINACAO';
    base_legal: string | null;
    observacoes: string | null;
    documentos_count: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    ttds: TTD[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tabela de Temporalidade',
        href: '/ttd',
    },
];

export default function Index({ ttds }: Props) {
    const handleDelete = (ttd: TTD) => {
        if (ttd.documentos_count > 0) {
            toast.error('Não é possível excluir', {
                description: `Existem ${ttd.documentos_count} documento(s) vinculado(s) a esta TTD.`,
            });
            return;
        }

        if (
            !confirm(
                `Tem certeza que deseja excluir a TTD "${ttd.tipo_documental}"?\n\nEsta ação não pode ser desfeita.`
            )
        ) {
            return;
        }

        router.delete(`/ttd/${ttd.id}`, {
            preserveScroll: true,
        });
    };

    const totalDocumentos = ttds.reduce((acc, ttd) => acc + ttd.documentos_count, 0);
    const totalPermanente = ttds.filter((t) => t.destinacao_final === 'GUARDA_PERMANENTE').length;
    const totalEliminacao = ttds.filter((t) => t.destinacao_final === 'ELIMINACAO').length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tabela de Temporalidade" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            📋 Tabela de Temporalidade
                        </h1>
                        <p className="text-muted-foreground">
                            Defina prazos e destinação final para cada tipo documental
                        </p>
                    </div>
                    <Link href="/ttd/create">
                        <Button size="lg">
                            <Plus className="mr-2 h-5 w-5" />
                            Nova TTD
                        </Button>
                    </Link>
                </div>

                {/* Cards de Estatísticas */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Tipos Cadastrados
                            </CardTitle>
                            <Table2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{ttds.length}</div>
                            <p className="text-xs text-muted-foreground">
                                Tabelas de temporalidade
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Documentos Vinculados
                            </CardTitle>
                            <FileText className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">
                                {totalDocumentos}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total de documentos
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
                                {totalPermanente}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Tipos históricos
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Eliminação
                            </CardTitle>
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {totalEliminacao}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Tipos elimináveis
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabela */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tipos Documentais</CardTitle>
                        <CardDescription>
                            {ttds.length === 0
                                ? 'Nenhuma TTD cadastrada'
                                : `${ttds.length} tipo(s) documental(is) cadastrado(s)`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {ttds.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Table2 className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">
                                    Nenhuma TTD cadastrada
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                    Comece criando a primeira Tabela de Temporalidade
                                </p>
                                <Link href="/ttd/create">
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Criar TTD
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Tipo Documental</TableHead>
                                            <TableHead className="text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    Corrente
                                                </div>
                                            </TableHead>
                                            <TableHead className="text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    Intermediária
                                                </div>
                                            </TableHead>
                                            <TableHead>Destinação Final</TableHead>
                                            <TableHead className="text-center">Documentos</TableHead>
                                            <TableHead>Base Legal</TableHead>
                                            <TableHead className="text-right">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {ttds.map((ttd) => (
                                            <TableRow key={ttd.id}>
                                                <TableCell className="font-medium">
                                                    {ttd.tipo_documental}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {ttd.prazo_guarda_corrente} ano(s)
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {ttd.prazo_guarda_intermediaria} ano(s)
                                                </TableCell>
                                                <TableCell>
                                                    {ttd.destinacao_final === 'GUARDA_PERMANENTE' ? (
                                                        <Badge className="bg-green-100 text-green-800">
                                                            🛡️ Guarda Permanente
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-red-100 text-red-800">
                                                            🗑️ Eliminação
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {ttd.documentos_count > 0 ? (
                                                        <Badge variant="outline">
                                                            {ttd.documentos_count}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-muted-foreground">
                                                            —
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {ttd.base_legal || '—'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link href={`/ttd/${ttd.id}/edit`}>
                                                            <Button variant="ghost" size="sm">
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(ttd)}
                                                            disabled={ttd.documentos_count > 0}
                                                            title={
                                                                ttd.documentos_count > 0
                                                                    ? 'Não é possível excluir: há documentos vinculados'
                                                                    : 'Excluir'
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-600" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
