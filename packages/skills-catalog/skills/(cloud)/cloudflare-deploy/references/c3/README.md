# C3 (criar cloudflare)

CLI oficial para estruturar projetos Cloudflare Workers e Pages com modelos, TypeScript e implantação instantânea.

## Início rápido```bash

# Interactive (recommended for first-time)

npm create cloudflare@latest my-app

# Worker (API/WebSocket/Cron)

npm create cloudflare@latest my-api -- --type=hello-world --ts

# Pages (static/SSG/full-stack)

npm create cloudflare@latest my-site -- --type=web-app --framework=astro --platform=pages

```

## Platform Decision Tree

```

O que você está construindo?

├─ API / WebSocket / Cron / Manipulador de e-mail
│ └─ Trabalhadores (padrão) - não é necessário sinalizador --platform
│ npm create cloudflare@latest my-api -- --type=hello-world

├─ Site estático/SSG/Documentação
│ └─ Páginas - requer --platform=pages
│ npm create cloudflare@mais recente meu site -- --type=web-app --framework=astro --platform=pages

├─ Aplicativo full-stack (Next.js/Remix/SvelteKit)
│ ├─ Precisa de objetos duráveis, filas ou recursos somente para trabalhadores?
│ │ └─ Trabalhadores (padrão)
│ └─ Caso contrário, use Pages para integração git e visualizações de ramificações
│ └─ Adicionar --platform=páginas

└─ Converter projeto existente
└─ npm criar cloudflare@latest. -- --type=pré-existente --existente-script=./src/worker.ts

````
**Crítico:** Projetos de páginas exigem o sinalizador `--platform=pages`. Sem ele, o padrão C3 é Trabalhadores.

## Fluxo interativo

Quando executado sem sinalizadores, C3 solicita nesta ordem:

1. **Nome do projeto** - Diretório a ser criado (o padrão é o diretório atual com `.`)
2. **Tipo de aplicação** - `hello-world`, `web-app`, `demo`, `pré-existente`, `remote-template`
3. **Plataforma** - `workers` (padrão) ou `pages` (somente para aplicativos da web)
4. **Framework** - Se aplicativo web: `next`, `remix`, `astro`, `react-router`, `solid`, `svelte`, etc.
5. **TypeScript** - `sim` (recomendado) ou `não`
6. **Git** - Inicializar repositório? `sim` ou `não`
7. **Implantar** - Implantar agora? `sim` ou `não` (requer `login do wrangler`)

## Métodos de instalação```bash
# NPM
npm create cloudflare@latest

# Yarn
yarn create cloudflare

# PNPM
pnpm create cloudflare@latest
````

## Nesta referência

| Arquivo             | Finalidade                             | Usar quando                                |
| ------------------- | -------------------------------------- | ------------------------------------------ |
| **api.md**          | Referência completa do sinalizador CLI | Scripting, CI/CD, uso avançado             |
| **configuração.md** | Arquivos gerados, ligações, tipos      | Noções básicas sobre saída, personalização |
| **padrões.md**      | Fluxos de trabalho, CI/CD, monorepos   | Integração no mundo real                   |
| **pegadinhas.md**   | Solução de problemas de falhas         | Implantação bloqueada, erros               |

## Ordem de leitura

| Tarefa                            | Leia                   |
| --------------------------------- | ---------------------- |
| Crie o primeiro projeto           | Somente LEIA-ME        |
| Configurar CI/CD                  | README → API → padrões |
| Falha na depuração na implantação | pegadinhas             |
| Entenda os arquivos gerados       | configuração           |
| Referência CLI completa           | API                    |
| Criar modelo personalizado        | padrões → configuração |
| Converter projeto existente       | LEIA-ME → padrões      |

## Pós-Criação```bash

cd my-app

# Local dev with hot reload

npm run dev

# Generate TypeScript types for bindings

npm run cf-typegen

# Deploy to Cloudflare

npm run deploy

```

## See Also

- **workers/README.md** - Workers runtime, bindings, APIs
- **workers-ai/README.md** - AI/ML models
- **pages/README.md** - Pages-specific features
- **wrangler/README.md** - Wrangler CLI beyond initial setup
- **d1/README.md** - SQLite database
- **r2/README.md** - Object storage
```
