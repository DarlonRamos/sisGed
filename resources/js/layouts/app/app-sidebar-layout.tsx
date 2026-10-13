import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: Readonly<AppLayoutProps>) {
    return (
        <AppShell variant="sidebar">
            {/*
             * Um único AppSidebar dentro de um único AppShell.
             */}
            <AppSidebar />

            <AppContent variant="sidebar">
                {/*
                 * O trigger fica no header do conteúdo.
                 * Assim ele continua visível quando o Sidebar estiver
                 * recolhido e não disputa espaço com o logo.
                 */}
                <AppSidebarHeader breadcrumbs={breadcrumbs} />

                {children}
            </AppContent>
        </AppShell>
    );
}
