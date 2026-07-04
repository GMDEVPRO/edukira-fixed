# Edukira Frontend

Este repositório contém a aplicação frontend completa da **Edukira**, uma plataforma de gestão escolar projetada para a África. O projeto engloba a Landing Page institucional, fluxos de registro e o painel de administração (Dashboard).

## Visão Geral do Projeto

A aplicação foi desenvolvida com foco em alta performance, internacionalização (suporte a múltiplos idiomas e RTL) e uma interface de usuário moderna. O sistema atende tanto escolas que desejam se registrar quanto alunos/pais e administradores do sistema.

**Principais Funcionalidades:**
- **Landing Page Interativa:** Uma landing page rica e completa, convertida de HTML para React, com seções de Hero, Problema/Solução, Funcionalidades, Integrações, Depoimentos, Como Funciona, Preços e Contato. Inclui animações de rolagem e um mini-dashboard interativo.
- **Internacionalização (i18n):** Suporte nativo a Francês, Inglês e Árabe (incluindo layout RTL) para todo o conteúdo da landing page e formulários.
- **Fluxos de Autenticação:** Login de administradores, registro de novas escolas (em 4 etapas) e registro de estudantes/tutores.
- **Dashboard de Gestão:** Painel protegido por autenticação para visualização de métricas, alunos, receitas e alertas.
- **Integração Completa:** Comunicação direta com o backend via Axios e chamadas Fetch otimizadas para formulários e dados.

## Tecnologias Utilizadas

A stack tecnológica foi escolhida para garantir escalabilidade e facilidade de manutenção:

| Categoria | Tecnologia | Descrição |
| --- | --- | --- |
| **Core** | React 18.3 | Biblioteca principal para construção da interface de usuário. |
| **Build Tool** | Vite 5 | Empacotador extremamente rápido com Hot Module Replacement (HMR). |
| **Roteamento** | React Router v6 | Gerenciamento de rotas e navegação protegida. |
| **Estilização** | Tailwind CSS 3 | Framework utilitário para estilização rápida e responsiva. |
| **Estado Global** | Zustand | Gerenciamento de estado leve, utilizado para persistência de sessão (Auth). |
| **Data Fetching** | TanStack Query v5 | Gerenciamento de cache e requisições assíncronas. |
| **HTTP Client** | Axios & Fetch API | Interceptadores Axios para chamadas seguras e Fetch para endpoints públicos. |

## Estrutura de Diretórios

A arquitetura do projeto foi organizada para separar claramente responsabilidades, componentes de interface e lógicas de integração:

```text
src/
├── api/
│   └── axios.js              # Configuração do Axios com interceptadores JWT
├── assets/                   # Imagens, ícones e recursos estáticos
├── components/
│   ├── layout/               # Navbar e Footer (atualizados com i18n e nova estrutura)
│   ├── sections/             # Seções da Landing Page (Hero, ProblemSolution, Features, Integrations, Testimonials, HowItWorks, Pricing, Contact)
│   └── ui/                   # Componentes de interface reutilizáveis
├── hooks/
│   ├── useLang.js            # Contexto de i18n (FR/EN/AR) e controle RTL (atualizado com novas traduções)
│   └── useReveal.js          # Hook para animações de rolagem (IntersectionObserver)
├── lib/
│   └── api.js                # Funções centralizadas para chamadas Fetch públicas (createLead, registerSchool, etc.)
├── pages/
│   ├── auth/                 # Login e Registro de Administradores
│   ├── dashboard/            # Painel de Controle protegido
│   ├── landing/              # Contém LandingPage.jsx (a nova landing page completa)
│   ├── RegisterPage.jsx      # Fluxo de registro de escola em 4 etapas
│   └── StudentRegisterPage.jsx # Registro de alunos e tutores
├── store/
│   └── authStore.js          # Store Zustand para persistência de token e usuário
├── App.jsx                   # Configuração de rotas públicas e protegidas
├── index.css                 # Estilos globais e diretivas do Tailwind (atualizado com novas fontes e estilos)
└── main.jsx                  # Ponto de entrada do React com Providers (atualizado para i18n e TanStack Query)
```

## Integrações com o Backend (API)

A aplicação se comunica com o backend rodando em `http://localhost:8080/api`. As principais integrações implementadas são:

| Endpoint | Método | Utilização |
| --- | --- | --- |
| `/v1/leads` | `POST` | Envio de formulário de contato na Landing Page. |
| `/v1/register` | `POST` | Criação de nova conta de escola (etapa final do RegisterPage). |
| `/v1/auth/login` | `POST` | Autenticação de administradores. |
| `/v1/countries` | `GET` | Busca da lista de países disponíveis para registro. |

*Nota: O proxy do Vite está configurado para redirecionar todas as chamadas `/api` para o backend durante o desenvolvimento, evitando problemas de CORS.*

## Configuração do Ambiente

Para rodar o projeto localmente, é necessário configurar as variáveis de ambiente.

1. Crie uma cópia do arquivo de exemplo:
   ```bash
   cp .env.example .env
   ```
2. O arquivo `.env` deve conter a URL base da API:
   ```env
   VITE_API_URL=http://localhost:8080/api
   ```

## Instalação e Execução

Siga os passos abaixo para iniciar o ambiente de desenvolvimento:

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   A aplicação estará disponível em `http://localhost:5173`.

3. **Para gerar o build de produção:**
   ```bash
   npm run build
   ```

4. **Para visualizar o build localmente:**
   ```bash
   npm run preview
   ```

## Considerações de Design

- **Responsividade:** O design foi construído seguindo a abordagem "mobile-first" através do Tailwind CSS, garantindo funcionamento perfeito em dispositivos móveis.
- **Acessibilidade:** Suporte completo à leitura da direita para a esquerda (RTL) quando o idioma Árabe é selecionado, alterando automaticamente a direção do documento HTML.
- **Segurança:** O token JWT é armazenado via Zustand (localStorage) e injetado automaticamente pelo Axios. Em caso de resposta `401 Unauthorized`, o usuário é deslogado e redirecionado para a tela de login.
