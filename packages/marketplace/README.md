# Agent Skills Marketplace

Site estático Next.js que funciona como vitrine para explorar e descobrir agent skills.

## Visão geral

O marketplace gera automaticamente um site estático a partir das skills no diretório `skills/`. Inclui:

- Página inicial com skills em destaque, estatísticas e métricas de downloads NPM
- Listagem com busca, filtro por categoria e paginação
- Páginas de detalhe com conteúdo completo e renderização Markdown
- Página Sobre exibindo o README do repositório
- Modo escuro com persistência de tema
- SEO com dados estruturados JSON-LD
- Layout responsivo com Tailwind CSS
- Export estático hospedado em domínio customizado

## Desenvolvimento

### Ambiente

```bash
npm ci
```

### Gerar dados das skills

```bash
nx run marketplace:generate-data
```

Este comando analisa todos os `SKILL.md` em `skills/` e gera `src/data/skills.json`.

### Servidor de desenvolvimento

```bash
nx run marketplace:dev
```

Abra http://localhost:3000 no navegador.

**Nota:** o site usa a mesma configuração da produção em desenvolvimento, para consistência.

### Build de produção

```bash
nx run marketplace:build
```

Gera arquivos estáticos em `out/.next/` prontos para deploy.

## Implantação

O site faz deploy automaticamente no domínio `agent-skills.techleads.club` quando há push na branch `main` via workflow `.github/workflows/deploy-marketplace.yml`.

### Deploy manual

1. Garantir que o build passa: `nx run marketplace:build`
2. Os arquivos estáticos ficam em `packages/marketplace/.next/`
3. Envie esses arquivos para qualquer hospedagem estática

## Estrutura do projeto

```
marketplace/
├── scripts/
│   └── generate-data.ts        # Analisa skills e gera JSON
├── src/
│   ├── app/
│   │   ├── page.tsx            # Home
│   │   ├── layout.tsx          # Layout raiz com navegação
│   │   ├── about/
│   │   │   └── page.tsx        # Sobre (mostra README)
│   │   └── skills/
│   │       ├── page.tsx        # Wrapper da listagem
│   │       ├── SkillsClient.tsx # Listagem (client component)
│   │       └── [id]/
│   │           └── page.tsx    # Detalhe da skill
│   ├── components/
│   │   ├── CategoryFilter.tsx  # Filtro por categoria
│   │   ├── CopyButton.tsx      # Copiar para a área de transferência
│   │   ├── JsonLd.tsx          # Dados estruturados (SEO)
│   │   ├── NpmDownloadsCard.tsx # Estatísticas de download NPM
│   │   ├── Pagination.tsx      # Paginação
│   │   ├── SearchBar.tsx       # Busca com debounce
│   │   ├── SkillCard.tsx       # Card prévia da skill
│   │   ├── StatsCard.tsx       # Cartão de estatísticas
│   │   ├── ThemeProvider.tsx   # Context do tema escuro
│   │   └── ThemeToggle.tsx     # Alternar claro/escuro
│   ├── data/
│   │   └── skills.json         # Dados gerados
│   └── types/
│       └── index.ts            # Tipos TypeScript
├── next.config.mjs             # Config Next.js
├── postcss.config.cjs          # PostCSS
└── project.json                # Projeto Nx
```

## Tecnologias

- **Next.js 16:** React com App Router
- **Tailwind CSS 4:** utilitários CSS
- **TypeScript:** tipagem
- **React Markdown:** renderização Markdown
- **Gray Matter:** frontmatter YAML
- **Rehype/Remark:** plugins (destaque de sintaxe, GFM)
- **Nx:** build e monorepo

## Funcionalidades

### Modo escuro

- Detecção da preferência do sistema
- Alternância manual
- Persistência em localStorage
- Transições suaves entre temas

### SEO

- JSON-LD em todas as páginas
- OpenGraph e Twitter Cards
- URLs canônicas e meta tags
- Suporte a sitemap

### Desempenho

- Geração estática (SSG)
- Build otimizado
- Imagens responsivas
- Code splitting

## Configuração

O site está preparado para o domínio:

- Domínio: `agent-skills.techleads.club`
- Export estático: `output: 'export'`
- Imagens não otimizadas (exigência do export estático)
- Barras finais habilitadas para compatibilidade

Para outro domínio, atualize a URL `metadataBase` em `src/app/layout.tsx`.

## Novas skills

As skills aparecem automaticamente quando:

1. Um novo diretório é adicionado em `skills/`
2. O diretório contém `SKILL.md`
3. A skill está em `skills/categories.json`

O marketplace incluirá a skill no próximo build.
