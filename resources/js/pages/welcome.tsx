import { Head } from '@inertiajs/react';

interface WelcomeProps {
    laravelVersion: string;
    phpVersion: string;
    auth?: {
        user?: {
            id: number;
            name: string;
            email: string;
        } | null;
    };
}

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
}: Readonly<WelcomeProps>) {
    // Verificar se o usuário está logado com segurança
    const isAuthenticated = auth?.user !== undefined && auth?.user !== null;
    const user = isAuthenticated ? auth.user : null;

    return (
        <>
            <Head title="SisGED" />
            <div className="bg-background flex min-h-screen flex-col items-center justify-center p-4">
                <div className="mx-auto w-full max-w-4xl text-center">
                    <h1 className="mb-4 text-4xl font-bold">📁 SisGED</h1>
                    <p className="text-muted-foreground mb-8 text-xl">
                        Sistema de Gestão de Documentos Digitalizados
                    </p>

                    {/* Mostrar mensagem diferente se estiver logado */}
                    {isAuthenticated ? (
                        <div className="space-y-4">
                            <p className="text-lg">Bem-vindo, {user?.name}!</p>
                            <a
                                href="/dashboard"
                                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md px-6 py-3 transition-colors"
                            >
                                Ir para o Dashboard
                            </a>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-lg">Bem-vindo ao SisGED</p>
                            <div className="flex justify-center gap-4">
                                <a
                                    href="/login"
                                    className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md px-6 py-3 transition-colors"
                                >
                                    Login
                                </a>
                                <a
                                    href="/register"
                                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 inline-flex items-center justify-center rounded-md px-6 py-3 transition-colors"
                                >
                                    Registrar
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Informações técnicas */}
                    <div className="text-muted-foreground mt-12 text-sm">
                        <p>
                            Laravel v{laravelVersion} | PHP v{phpVersion} |
                            React 19
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
