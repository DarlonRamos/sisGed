import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Info, Clock, ShieldAlert } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import InputError from '@/components/input-error';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tabela de Temporalidade',
        href: '/ttd',
    },
    {
        title: 'Nova TTD',
        href: '/ttd/create',
    },
];

const tiposDocumentaisSugeridos = [
    'Processo Administrativo',
    'Contrato',
    'Nota Fiscal',
    'Ofício',
    'Memorando',
    'Portaria',
    'Resolução',
    'Ata de Reunião',
    'Relatório',
    'Outros',
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        tipo_documental: '',
        prazo_guarda_corrente: 5,
        prazo_guarda_intermediaria: 5,
        destinacao_final: 'ELIMINACAO',
        base_legal: '',
        observacoes: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/ttd');
    };

    const prazoTotal =
        data.prazo_guarda_corrente + data.prazo_guarda_intermediaria;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nova Tabela de Temporalidade" />

            <div className="mx-auto flex h-full max-w-4xl flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/ttd">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            📋 Nova Tabela de Temporalidade
                        </h1>
                        <p className="text-muted-foreground">
                            Defina os prazos e a destinação final para o tipo
                            documental
                        </p>
                    </div>
                </div>

                {/* Alerta informativo */}
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                        A <strong>TTD</strong> define o ciclo de vida dos
                        documentos: quanto tempo ficam na repartição de origem
                        (corrente), no arquivo intermediário, e se devem ser
                        eliminados ou preservados permanentemente.
                    </AlertDescription>
                </Alert>

                <form onSubmit={submit} className="space-y-6">
                    {/* Identificação */}
                    <Card>
                        <CardHeader>
                            <CardTitle>1. Identificação</CardTitle>
                            <CardDescription>
                                Qual tipo documental esta TTD irá reger?
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="tipo_documental">
                                    Tipo Documental *
                                </Label>
                                <Input
                                    id="tipo_documental"
                                    list="tipos-sugeridos"
                                    value={data.tipo_documental}
                                    onChange={(e) =>
                                        setData(
                                            'tipo_documental',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Ex: Processo Administrativo"
                                    required
                                />
                                <datalist id="tipos-sugeridos">
                                    {tiposDocumentaisSugeridos.map((tipo) => (
                                        <option key={tipo} value={tipo} />
                                    ))}
                                </datalist>
                                <p className="text-muted-foreground text-xs">
                                    Digite um tipo novo ou selecione um sugerido
                                </p>
                                <InputError message={errors.tipo_documental} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Prazos */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                2. Prazos de Guarda
                            </CardTitle>
                            <CardDescription>
                                Tempo em anos que o documento deve ser guardado
                                em cada fase
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="prazo_guarda_corrente">
                                        Prazo Corrente (anos) *
                                    </Label>
                                    <Input
                                        id="prazo_guarda_corrente"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={
                                            data.prazo_guarda_corrente === 0
                                                ? ''
                                                : data.prazo_guarda_corrente
                                        }
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setData(
                                                'prazo_guarda_corrente',
                                                value === ''
                                                    ? 0
                                                    : parseInt(value) || 0,
                                            );
                                        }}
                                        placeholder="0"
                                        required
                                    />
                                    <p className="text-muted-foreground text-xs">
                                        Tempo na repartição de origem
                                    </p>
                                    <InputError
                                        message={errors.prazo_guarda_corrente}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="prazo_guarda_intermediaria">
                                        Prazo Intermediário (anos) *
                                    </Label>
                                    <Input
                                        id="prazo_guarda_intermediaria"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={
                                            data.prazo_guarda_intermediaria ===
                                            0
                                                ? ''
                                                : data.prazo_guarda_intermediaria
                                        }
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setData(
                                                'prazo_guarda_intermediaria',
                                                value === ''
                                                    ? 0
                                                    : parseInt(value) || 0,
                                            );
                                        }}
                                        placeholder="0"
                                        required
                                    />
                                    <p className="text-muted-foreground text-xs">
                                        Tempo no arquivo intermediário
                                    </p>
                                    <InputError
                                        message={
                                            errors.prazo_guarda_intermediaria
                                        }
                                    />
                                </div>
                            </div>

                            <div className="bg-muted rounded-md p-3">
                                <p className="text-sm">
                                    <strong>Prazo total:</strong> {prazoTotal}{' '}
                                    ano(s) = {data.prazo_guarda_corrente}{' '}
                                    (corrente) +{' '}
                                    {data.prazo_guarda_intermediaria}{' '}
                                    (intermediária)
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Destinação Final */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShieldAlert className="h-5 w-5" />
                                3. Destinação Final
                            </CardTitle>
                            <CardDescription>
                                O que fazer após o cumprimento dos prazos?
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="destinacao_final">
                                    Destinação Final *
                                </Label>
                                <Select
                                    value={data.destinacao_final}
                                    onValueChange={(value) =>
                                        setData('destinacao_final', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ELIMINACAO">
                                            🗑️ Eliminação — Pode ser destruído
                                            após prazos
                                        </SelectItem>
                                        <SelectItem value="GUARDA_PERMANENTE">
                                            🛡️ Guarda Permanente — Nunca
                                            eliminar (histórico)
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.destinacao_final} />
                            </div>

                            {data.destinacao_final === 'GUARDA_PERMANENTE' && (
                                <Alert className="border-green-200 bg-green-50">
                                    <ShieldAlert className="h-4 w-4 text-green-700" />
                                    <AlertDescription className="text-green-800">
                                        <strong>Importante:</strong> documentos
                                        de Guarda Permanente{' '}
                                        <strong>NUNCA</strong> podem ser
                                        eliminados, mesmo após os prazos. Eles
                                        têm valor histórico.
                                    </AlertDescription>
                                </Alert>
                            )}

                            {data.destinacao_final === 'ELIMINACAO' && (
                                <Alert className="border-red-200 bg-red-50">
                                    <ShieldAlert className="h-4 w-4 text-red-700" />
                                    <AlertDescription className="text-red-800">
                                        <strong>Atenção:</strong> documentos
                                        elimináveis só podem ser destruídos após{' '}
                                        <strong>edital de eliminação</strong> e
                                        aprovação da{' '}
                                        <strong>
                                            Comissão Permanente de Avaliação.
                                        </strong>
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>

                    {/* Base Legal e Observações */}
                    <Card>
                        <CardHeader>
                            <CardTitle>4. Informações Complementares</CardTitle>
                            <CardDescription>
                                Documentação legal e observações adicionais
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="base_legal">Base Legal</Label>
                                <Input
                                    id="base_legal"
                                    value={data.base_legal}
                                    onChange={(e) =>
                                        setData('base_legal', e.target.value)
                                    }
                                    placeholder="Ex: Lei nº 8.159/1991, Decreto nº 10.278/2020"
                                />
                                <p className="text-muted-foreground text-xs">
                                    Norma que fundamenta esta TTD
                                </p>
                                <InputError message={errors.base_legal} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="observacoes">Observações</Label>
                                <Textarea
                                    id="observacoes"
                                    value={data.observacoes}
                                    onChange={(e) =>
                                        setData('observacoes', e.target.value)
                                    }
                                    placeholder="Informações adicionais relevantes..."
                                    rows={3}
                                />
                                <InputError message={errors.observacoes} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Botões */}
                    <div className="flex justify-end gap-4">
                        <Link href="/ttd">
                            <Button type="button" variant="outline">
                                Cancelar
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Salvando...' : 'Criar TTD'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
