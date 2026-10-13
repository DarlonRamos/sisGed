import { usePage } from '@inertiajs/react';
import { useState, type ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import type { AppVariant } from '@/types';

type Props = Readonly<{
    children: ReactNode;
    variant?: AppVariant;
}>;

export function AppShell({ children, variant = 'sidebar' }: Props) {
    // O valor vindo do servidor é usado somente para definir o estado inicial.
    // Depois da montagem, o estado passa a ser controlado pelo React.
    //
    // Isso evita depender de `defaultOpen` em renders posteriores e deixa
    // o comportamento do SidebarProvider determinístico.
    const { sidebarOpen } = usePage().props;

    const [open, setOpen] = useState<boolean>(
        () => sidebarOpen ?? true,
    );

    if (variant === 'header') {
        return (
            <div className="flex min-h-screen w-full flex-col">
                {children}
            </div>
        );
    }

    return (
        <SidebarProvider
            open={open}
            onOpenChange={setOpen}
        >
            {children}
        </SidebarProvider>
    );
}
