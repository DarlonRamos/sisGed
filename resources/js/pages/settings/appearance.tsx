import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';
import { Palette } from 'lucide-react';

export default function Appearance() {
    return (
        <>
            <Head title="Aparência" />

            <h1 className="sr-only">Aparência</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Aparência"
                    description="Personalize a aparência do sistema"
                />

                <div className="rounded-lg border bg-card p-6">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="rounded-md bg-primary/10 p-2">
                            <Palette className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-base font-medium">Tema</h3>
                            <p className="text-sm text-muted-foreground">
                                Escolha entre claro, escuro ou automático
                            </p>
                        </div>
                    </div>

                    <AppearanceTabs />
                </div>
            </div>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [
        {
            title: 'Aparência',
            href: '/settings/appearance',
        },
    ],
};
