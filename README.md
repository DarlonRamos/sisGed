# 📁 SisGED - Sistema de Gestão de Documentos Digitalizados

Sistema de gestão de documentos físicos digitalizados com arquitetura multi-tenant, desenvolvido com Laravel 13 e React (Inertia.js).

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura](#arquitetura)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação](#instalação)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Banco de Dados](#banco-de-dados)
- [API Endpoints](#api-endpoints)
- [Autenticação](#autenticação)
- [Testes](#testes)
- [Funcionalidades Implementadas](#funcionalidades-implementadas)
- [Próximos Passos](#próximos-passos)
- [Contribuição](#contribuição)
- [Licença](#licença)

---

## 📖 Sobre o Projeto

O **SisGED** é uma solução standalone para digitalização, indexação, armazenamento e gestão de documentos físicos, atendendo aos requisitos da **Lei do Governo Digital (Lei nº 14.129/2021)** e do **Decreto nº 10.278/2020**.

### 🎯 Objetivos

- Digitalizar documentos físicos com garantia de integridade (SHA-256)
- Gerenciar metadados conforme padrões legais
- Implementar Tabela de Temporalidade Documental (TTD)
- Garantir transparência e auditoria imutável
- Suporte multi-tenant (vários órgãos/entidades)
- Equivalência legal da cópia digital em relação ao original em papel

### 👥 Público-alvo

- Órgãos públicos
- Entidades da administração direta e indireta
- Empresas com acervo físico

---

## 🛠️ Tecnologias Utilizadas

### Backend
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Laravel** | 13.x | Framework PHP |
| **PHP** | 8.3+ / 8.4+ | Linguagem de programação |
| **Laravel Sanctum** | ^4.0 | Autenticação API |
| **Laravel Fortify** | ^1.0 | Autenticação web |
| **SQLite** | 3.x | Banco de dados (desenvolvimento) |
| **spatie/laravel-permission** | ^6.0 | RBAC (Controle de Acesso) |

### Frontend
| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **React** | 19.2.0 | Biblioteca UI |
| **Inertia.js** | 3.0.0 | SPA sem API separada |
| **TypeScript** | 5.7.2 | Tipagem estática |
| **Tailwind CSS** | 4.0.0 | Framework CSS |
| **Shadcn/ui** | - | Componentes UI |
| **Radix UI** | - | Componentes acessíveis |
| **Vite** | 8.0.0 | Build tool |
| **Lucide React** | 0.475.0 | Ícones |

### Ferramentas de Desenvolvimento
- **Composer** - Gerenciador de dependências PHP
- **NPM** - Gerenciador de dependências Node
- **Vite** - Build tool e dev server
- **Postman** - Testes de API

---

## 🏗️ Arquitetura

### Visão Geral


### Camadas do Sistema

1. **Camada de Apresentação**: React SPA com Inertia.js
2. **Camada de Aplicação**: Controllers e Services Laravel
3. **Camada de Domínio**: Models e Regras de Negócio
4. **Camada de Infraestrutura**: Storage, Banco de Dados, Cache

---

## 📂 Estrutura do Projeto

sisged/
├── app/
│ ├── Console/
│ │ └── Commands/
│ │ └── VerificarIntegridade.php # Comando para verificar hash
│ ├── Http/
│ │ ├── Controllers/
│ │ │ └── DocumentoDigitalizadoController.php
│ │ └── Middleware/
│ └── Models/
│ ├── DocumentoDigitalizado.php
│ ├── MetadadoDigitalizacao.php
│ ├── TabelaTemporalidade.php
│ ├── TrilhaAuditoria.php
│ └── User.php
├── bootstrap/
│ └── app.php # Configuração de rotas
├── config/
│ ├── sanctum.php
│ └── filesystems.php
├── database/
│ ├── migrations/
│ │ ├── *create_documento_digitalizados_table.php
│ │ ├── *create_metadado_digitalizacaos_table.php
│ │ ├── *create_tabela_temporalidades_table.php
│ │ ├── *create_trilha_auditorias_table.php
│ │ └── *create_personal_access_tokens_table.php
│ └── database.sqlite
├── resources/
│ ├── js/
│ │ ├── pages/
│ │ │ ├── Digitalizacao/
│ │ │ │ ├── Index.tsx
│ │ │ │ ├── Create.tsx
│ │ │ │ └── Show.tsx
│ │ │ └── auth/
│ │ ├── components/
│ │ └── app.tsx
│ └── views/
│ └── app.blade.php
├── routes/
│ ├── api.php # Rotas da API
│ └── web.php # Rotas Web (Inertia)
├── storage/
│ ├── app/
│ │ └── public/
│ │ └── documentos/
│ │ └── YYYY/MM/DD/
│ │ └── {hash}.pdf # Documentos digitalizados
├── tests/
│ ├── Unit/
│ └── Feature/
├── .env # Configurações de ambiente
├── composer.json # Dependências PHP
├── package.json # Dependências Node
└── README.md # Este arquivo


---

## 🔧 Instalação

### Pré-requisitos

- PHP 8.3 ou 8.4+
- Composer
- Node.js 18+
- NPM
- SQLite (ou MySQL/PostgreSQL)

### Passo a Passo

```bash
# 1. Clonar o repositório
git clone https://github.com/seu-usuario/sisged.git
cd sisged

# 2. Instalar dependências PHP
composer install

# 3. Instalar dependências Node
npm install

# 4. Copiar arquivo de ambiente
cp .env.example .env

# 5. Configurar .env
# Edite as variáveis conforme seu ambiente

# 6. Gerar chave da aplicação
php artisan key:generate

# 7. Configurar banco de dados
php artisan migrate

# 8. Criar link simbólico para storage
php artisan storage:link

# 9. Compilar assets
npm run build

# 10. Iniciar servidor de desenvolvimento
composer run dev
```

## Acesse a aplicação
Frontend: http://localhost:8000

API: http://localhost:8000/api

Vite Dev Server: http://localhost:5173

```bash
# APP
APP_NAME=SisGED
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# DATABASE (SQLite)
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite

# STORAGE
DOC_STORAGE_DRIVER=local
# Para S3/AWS:
# DOC_STORAGE_DRIVER=s3
# AWS_ACCESS_KEY_ID=your_key
# AWS_SECRET_ACCESS_KEY=your_secret
# AWS_DEFAULT_REGION=us-east-1
# AWS_BUCKET=your_bucket

# AUTHENTICATION
SANCTUM_STATEFUL_DOMAINS=localhost:8000
SESSION_DOMAIN=localhost

```
## 📡 API Endpoints
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| **POST** | /api/login | Login (retorna token)|
| **POST** | /api/logout| Logout|
| **GET** | /api/user| Dados do usuário logado|

## Documentos

|Método| Endpoint| Descrição|
|------|---------|----------|
|**GET**|/api/documentos| Lista documentos (paginado)|
|**POST**|/api/documentos|	Upload de novo documento|
|**GET**|/api/documentos/{id}|	Visualizar documento|
|**GET**|/api/documentos/{id}/download|	Baixar arquivo|
|**GET**|/api/documentos/{id}/verificar|	Verificar integridade|

--------------

POST /api/documentos
---
**Authorization:** Bearer {token}

**Content-Type:** multipart/form-data

**arquivo:** [PDF file]

**titulo:** "Processo de Licitação 001/2025"

**assunto:** "Aquisição de equipamentos"

**tipo_documental:** "Processo Administrativo"

**operador_responsavel_cpf:** "123.456.789-00"

**operador_responsavel_nome:** "João Silva"

**destinacao_final:** "GUARDA_TEMPORARIA"

---

## Listar Documentos

```bash
##GET /api/documentos?page=1&per_page=15
##Authorization: Bearer {token}
```
## <span style="color: #a8efff">Autenticação</span>

**1. Crie um usuário (se não tiver):**
```bash
php artisan tinker
```
```bash
App\Models\User::create([
    'name' => 'Admin',
    'email' => 'admin@teste.com',
    'password' => bcrypt('password123')
]);
```
**2. Gere um token:**
```bash
$user = App\Models\User::first();
$user->createToken('api-token')->plainTextToken;
```
**3. Use nos headers:**
```bash
Authorization: Bearer {seu_token}
```

## Login via Interface Web
- Acesse http://localhost:8000/login

- Use o email e senha cadastrados

## Testes
### Testes Unitários
```bash
php artisan test
```

## Testar API com Postman
1.Importe a coleção (disponível na pasta /postman)

2.Configure as variáveis de ambiente

3.Execute os testes

## Testar Comandos Artisan
```bash
# Verificar integridade de todos os documentos
php artisan documentos:verificar-integridade
```

## ✅ Funcionalidades Implementadas
**Fase 1 - Core Backend ✅**
- Laravel 13 com PHP 8.3+
- Autenticação Sanctum (API + Web)
- Modelos e Migrações
- Storage Local (configurável para S3)
- Rotas API protegidas

**Fase 2 - Digitalização e Metadados ✅**
- Upload de arquivos PDF/A
- Cálculo de Hash SHA-256
- Validação de metadados (Decreto 10.278/2020)
- Armazenamento seguro de documentos

**Fase 3 - Auditoria ✅**
- Trilha de auditoria imutável
- Registro de ações (CRIOU, VISUALIZOU, BAIXOU)
- IP e user-agent de origem

**Fase 4 - Integridade ✅**
- Comando de verificação periódica
- Verificação individual de documentos
- Alertas de integridade comprometida

## Próximos Passos
**Fase 5 - Frontend React**
- Página de upload com drag & drop
- Listagem de documentos
- Visualização de detalhes
- Interface de busca

**Fase 6 - TTD (Tabela de Temporalidade)**
- CRUD de tabelas de temporalidade
- Vinculação de documentos à TTD
- Workflow de eliminação

**Fase 7 - Assinatura Digital**
- Integração com Web PKI
- Certificado ICP-Brasil (A1/A3)
- Assinatura PAdES

**Fase 8 - Multi-Tenant**
- Isolamento por tenant
- Subdomínios dinâmicos
- Segregação de storage

**Fase 9 - Portal LAI**
- Busca pública
- Download de cópias autenticadas
- Transparência ativa
---

🧪 Testar a auditoria
Acesse: http://localhost:8000/documentos/3

Clique em "Visualizar PDF" (abre em nova aba)

Rode no terminal:

powershell
php artisan tinker
php
App\Models\TrilhaAuditoria::latest()->first();
Deve aparecer:

text
= App\Models\TrilhaAuditoria {
    id: 5,
    documento_digitalizado_id: 3,
    usuario_id: 1,
    acao: "VISUALIZOU",
    ...
  }

✅ O que você conquistou até agora
Backend Laravel 13
☑ Models (Documento, Metadado, TTD, Auditoria)
☑ Migrations rodadas
☑ API RESTful com Sanctum
☑ Upload de PDF com Hash SHA-256
☑ Trilha de auditoria imutável
☑ Verificação de integridade
Frontend React + Inertia
☑ Login/Registro funcionando
☑ Dashboard
☑ Listagem de documentos com cards e tabela
☑ Upload com drag & drop
☑ Visualização de detalhes com metadados
☑ Download do PDF
☑ Visualizar PDF em nova aba
☑ Verificar integridade (com auditoria)
Auditoria
☑ Registro de CRIOU
☑ Registro de VISUALIZOU
☑ Registro de BAIXOU
☑ Registro de VERIFICOU
🎯 O que você pode fazer agora
Opção 1: Continuar o Frontend
Melhorar a listagem com filtros e busca avançada

Página de auditoria (histórico de ações)

Dashboard com gráficos (estatísticas)

Página de TTD (Tabela de Temporalidade)

Página de configurações

Opção 2: Implementar funcionalidades do documento
Motor de TTD (Tabela de Temporalidade Documental)

Workflow de eliminação de papel

Assinatura digital (ICP-Brasil)

Multi-tenant

Opção 3: Melhorar a experiência
Toasts de sucesso/erro (feedback visual)

Loading states (spinners)

Confirmação de exclusão (modal)

Filtros na listagem (por status, tipo, data)

Paginação melhorada

Opção 4: Testes e qualidade
Testes automatizados (Pest/PHPUnit)

CI/CD (GitHub Actions)

Documentação da API (Swagger)

📊 Status do projeto
Fase	Status
Fase 1 - Core Backend	✅ Completo
Fase 2 - Digitalização e Metadados	✅ Completo
Fase 3 - Auditoria	✅ Completo
Fase 4 - Integridade	✅ Completo
Fase 5 - Frontend React	🟢 80% completo
Fase 6 - TTD	⏳ Pendente
Fase 7 - Assinatura Digital	⏳ Pendente
Fase 8 - Multi-Tenant	⏳ Pendente
Fase 9 - Portal LAI	⏳ Pendente
