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

                <div className="bg-card rounded-lg border p-6">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="bg-primary/10 rounded-md p-2">
                            <Palette className="text-primary h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-medium">Tema</h3>
                            <p className="text-muted-foreground text-sm">
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
