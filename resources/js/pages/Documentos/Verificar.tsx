import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ShieldCheck, ShieldX, CheckCircle2, XCircle, FileText } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import type { BreadcrumbItem } from '@/types';

interface Documento {
    id: number;
    titulo: string;
    hash_sha256: string;
    caminho_arquivo: string;
}

interface Props {
    documento: Documento;
    integro: boolean;
    hash_atual: string;
}

export default function Verificar({ documento, integro, hash_atual }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Documentos', href: '/documentos' },
        { title: documento.titulo, href: `/documentos/${documento.id}` },
        { title: 'Verificar Integridade', href: `/documentos/${documento.id}/verificar` },
    ];

    return (
        <>
            <Head title={`Verificar - ${documento.titulo}`} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4 max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={`/documentos/${documento.id}`}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Verificação de Integridade
                        </h1>
                        <p className="text-muted-foreground">{documento.titulo}</p>
                    </div>
                </div>

                {/* Resultado */}
                {integro ? (
                    <Alert className="border-green-200 bg-green-50">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <AlertTitle className="text-green-800 text-lg">
                            ✅ Documento Íntegro
                        </AlertTitle>
                        <AlertDescription className="text-green-700">
                            O hash SHA-256 do arquivo corresponde ao valor original registrado.
                            O documento não foi alterado desde a digitalização.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <Alert className="border-red-200 bg-red-50">
                        <XCircle className="h-5 w-5 text-red-600" />
                        <AlertTitle className="text-red-800 text-lg">
                            ⚠️ Integridade Comprometida
                        </AlertTitle>
                        <AlertDescription className="text-red-700">
                            O hash SHA-256 do arquivo NÃO corresponde ao valor original.
                            O documento pode ter sido alterado ou corrompido!
                        </AlertDescription>
                    </Alert>
                )}

                {/* Detalhes do Hash */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5" />
                            Detalhes da Verificação
                        </CardTitle>
                        <CardDescription>
                            Comparação entre o hash original e o hash atual do arquivo
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground mb-2">
                                🔒 Hash Original (registrado na digitalização)
                            </p>
                            <code className="block p-3 bg-muted rounded-md text-xs break-all">
                                {documento.hash_sha256}
                            </code>
                        </div>

                        <Separator />

                        <div>
                            <p className="text-sm text-muted-foreground mb-2">
                                🔍 Hash Atual (recalculado agora)
                            </p>
                            <code className={`block p-3 rounded-md text-xs break-all ${
                                integro ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                            }`}>
                                {hash_atual}
                            </code>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Resultado</p>
                                <p className="font-medium">
                                    {integro ? '✅ Íntegro' : '❌ Comprometido'}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground">Arquivo</p>
                                <p className="font-medium text-xs">
                                    {documento.caminho_arquivo.split('/').pop()}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Ações */}
                <div className="flex gap-2">
                    <Link href={`/documentos/${documento.id}`}>
                        <Button variant="outline">
                            <FileText className="mr-2 h-4 w-4" />
                            Ver Detalhes
                        </Button>
                    </Link>
                    <Link href={`/documentos/${documento.id}/download`}>
                        <Button>
                            Baixar PDF
                        </Button>
                    </Link>
                </div>
            </div>
        </>
    );
}