import { Breadcrumbs } from '@/components/breadcrumbs';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: Readonly<{
    breadcrumbs?: BreadcrumbItemType[];
}>) {
    return (
        <header className="bg-background flex h-16 shrink-0 items-center gap-2 border-b px-4">
            {/*
             * ÚNICO SidebarTrigger do sistema.
             *
             * Ele fica fora do Sidebar para continuar acessível quando
             * o sidebar estiver retraído.
             */}
            <SidebarTrigger className="-ml-1" />

            <Separator orientation="vertical" className="mr-2 h-4" />

            <Breadcrumbs breadcrumbs={breadcrumbs} />
        </header>
    );
}
