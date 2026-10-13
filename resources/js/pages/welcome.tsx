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

export default function Welcome({ auth, laravelVersion, phpVersion }: Readonly<WelcomeProps>) {
    // Verificar se o usuário está logado com segurança
    const isAuthenticated = auth?.user !== undefined && auth?.user !== null;
    const user = isAuthenticated ? auth.user : null;

    return (
        <>
            <Head title="SisGED" />
            <div className="bg-background min-h-screen flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl font-bold mb-4">📁 SisGED</h1>
                    <p className="text-xl text-muted-foreground mb-8">
                        Sistema de Gestão de Documentos Digitalizados
                    </p>
                    
                    {/* Mostrar mensagem diferente se estiver logado */}
                    {isAuthenticated ? (
                        <div className="space-y-4">
                            <p className="text-lg">Bem-vindo, {user?.name}!</p>
                            <a 
                                href="/dashboard" 
                                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                            >
                                Ir para o Dashboard
                            </a>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-lg">Bem-vindo ao SisGED</p>
                            <div className="flex gap-4 justify-center">
                                <a 
                                    href="/login" 
                                    className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                                >
                                    Login
                                </a>
                                <a 
                                    href="/register" 
                                    className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
                                >
                                    Registrar
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Informações técnicas */}
                    <div className="mt-12 text-sm text-muted-foreground">
                        <p>Laravel v{laravelVersion} | PHP v{phpVersion} | React 19</p>
                    </div>
                </div>
            </div>
        </>
    );
}
