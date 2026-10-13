import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    FileText,
    FolderGit2,
    LayoutGrid,
    Table2,
    Upload,
} from 'lucide-react';

import AppLogoIcon from '@/components/app-logo-icon';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Documentos',
        href: '/documentos' as any,
        icon: FileText,
    },
    {
        title: 'Novo Documento',
        href: '/documentos/upload' as any,
        icon: Upload,
    },
    {
        title: 'Tabela de Temporalidade',
        href: '/ttd' as any,
        icon: Table2,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repositório',
        href: 'https://github.com/laravel/react-starter-kit' as any,
        icon: FolderGit2,
    },
    {
        title: 'Documentação',
        href: 'https://laravel.com/docs/starter-kits#react' as any,
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { name } = usePage().props;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        {/*
                         * IMPORTANTE:
                         * O SidebarTrigger não fica mais dentro do Sidebar.
                         *
                         * Isso impede que o botão de retração dispute espaço
                         * com o logo e evita a sobreposição observada no modo
                         * colapsado.
                         */}
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                {/*
                                 * Ícone do logo:
                                 * fica sempre visível, inclusive no modo "icon".
                                 */}
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                                    <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
                                </div>

                                {/*
                                 * Nome da aplicação:
                                 * fica visível no modo expandido e desaparece
                                 * somente quando o sidebar estiver recolhido.
                                 */}
                                <div className="ml-1 min-w-0 flex-1 text-left text-sm group-data-[collapsible=icon]:hidden">
                                    <span className="mb-0.5 block truncate leading-tight font-semibold">
                                        {name}
                                    </span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter
                    items={footerNavItems}
                    className="mt-auto"
                />

                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
