# AGENTS.md

Orientações para agentes de codificação com IA ao trabalhar neste repositório.

## Orquestração de workflow

### 1. Modo plano por padrão

- Entre em modo plano para qualquer tarefa não trivial (3+ passos ou decisões de arquitetura)
- Se algo sair do controle, PARE e replaneje imediatamente — não force a barra
- Use modo plano para verificação, não só para implementação
- Escreva especificações detalhadas no início para reduzir ambiguidade

### 2. Estratégia de subagentes

- Use subagentes com liberdade para manter a janela de contexto principal limpa
- Delegue pesquisa, exploração e análise paralela a subagentes
- Para problemas complexos, use mais compute via subagentes
- Uma tarefa por subagente para execução focada

### 3. Verificação antes de concluir

- Nunca marque uma tarefa como concluída sem provar que funciona
- Execute a suíte de testes completa antes de considerar o trabalho pronto
- Verifique suas mudanças contra o comportamento existente
- Pergunte-se: "Um staff engineer aprovaria isso?"

### 4. Busque elegância (com equilíbrio)

- Em mudanças não triviais: pause e pergunte "existe um jeito mais elegante?"
- Se um fix parecer gambiarra: "Sabendo tudo que sei agora, implemente a solução elegante"
- Pule isso para correções simples e óbvias — não superengenharia
- Desafie seu próprio trabalho antes de apresentar

### 5. Correção autônoma de bugs

- Diante de um bug reportado: apenas corrija. Não peça orientação passo a passo
- Rode testes para achar a causa raiz
- Zero troca de contexto exigida do usuário
- Corrija testes falhando sem que te digam como

## Princípios centrais

- **Simplicidade primeiro**: faça cada mudança o mais simples possível. Impacto mínimo no código.
- **Sem preguiça**: encontre causas raiz. Sem workarounds temporários. Padrão de desenvolvedor sênior.
- **Impacto mínimo**: mudanças devem tocar só o necessário. Evite introduzir bugs.

---

## Repositório

**Monorepo Agent Skills** — registry e CLI para distribuir "skills" (instruções empacotadas) a agentes de codificação com IA (Claude Code, Cursor, Copilot, Windsurf, Cline e mais 14).

Mantido pelo **Controllato Club** (fork/localização PT-BR do ecossistema agent-skills).

## Comandos

```bash
# Setup
npm ci && npm run build

# Desenvolvimento
npm run start:dev:cli          # CLI interativo (tsx, sem build)
npm run start:dev:mcp          # Build MCP e Inspector
SKILLS_CDN_REF=main npm run dev -- install  # Testar CLI contra registry local

# Build e testes
npm run build                  # Build de todos os pacotes (Nx)
npm run test                   # Todos os testes (Node --experimental-vm-modules)
npm run test --workspace=@controllato/agent-skills  # Só testes da CLI

# Qualidade
npm run lint                   # ESLint
npm run lint:fix
npm run format:check           # Prettier
npm run format

# Skills
npm run generate:data          # Regenerar skills-registry.json + dados do marketplace
npm run scan                   # Scan de segurança (snyk-agent-scan, incremental; SNYK_TOKEN)
nx g @controllato/skill-plugin:skill {name} --category={cat}  # Nova skill
```

## Arquitetura

**Monorepo Nx** com versionamento independente e conventional commits.

### Pacotes

- `**packages/cli`\*\* — `@controllato/agent-skills`. Instalador para o usuário. Modo duplo: TUI interativa (React + Ink) e CLI não interativa (Commander.js). Entrada: `src/index.ts`. Lógica em `src/services/` (registry, instalação, lockfile, configs de agentes).
- `**packages/skills-catalog**` — Definições em `skills/{(categoria)}/{nome-skill}/SKILL.md` com frontmatter YAML. `src/generate-registry.ts` gera `skills-registry.json` (commitado, npm, jsDelivr CDN).
- `**packages/marketplace**` — Site estático Next.js 16 no GitHub Pages. Lê `src/data/skills.json` (gerado do registry).
- `**libs/core**` — `@controllato/core`. Tipos compartilhados (`AgentType`, `SkillInfo`, `CategoryInfo`) e constantes.
- `**tools/skill-plugin**` — Gerador Nx de skills.

### Fluxos principais

**Instalação de skill**: CLI busca `skills-registry.json` no CDN → baixa arquivos (lotes, 10 concorrentes) para `~/.cache/agent-skillsls/` → instala por cópia ou symlink no diretório do agente → registra em `.agents/.skill-lock.json` (v2, Zod, escrita atômica).

**Geração do registry**: `generate-registry.ts` varre `SKILL.md`, parseia frontmatter, calcula SHA-256, gera `skills-registry.json`.

### Configuração de agentes

Config canônica em `packages/cli/src/services/agents.ts`. Cada um dos 19 agentes tem `skillsDir` (projeto) e `globalSkillsDir` (home). Tiers: Tier 1 (Cursor, Claude Code, Copilot, Windsurf, Cline), Tier 2, Tier 3.

## Convenções de código

- **Somente ESM**. Jest exige `NODE_OPTIONS='--experimental-vm-modules'`.
- **TypeScript strict**. `@typescript-eslint/no-explicit-any: error`. Variáveis não usadas com prefixo `_` são permitidas.
- **Prettier**: sem ponto e vírgula, aspas simples, trailing commas, largura 120, plugin organize-imports.
- **Node ≥ 24** (monorepo), **Node ≥ 22** (pacote CLI).
- Testes: Jest 30 + ts-jest. Testes baseados em propriedades: fast-check (`*.pbt.test.ts`). Testes de segurança para installer e lockfile.

## Estrutura de skill

```
skills/(categoria)/{nome-skill}/
├── SKILL.md          # Obrigatório — frontmatter YAML + corpo markdown
├── scripts/          # Scripts executáveis opcionais
├── templates/        # Templates de arquivo opcionais
└── references/       # Documentação sob demanda opcional
```

Use sempre o gerador Nx (`nx g @controllato/skill-plugin:skill`). Mantenha `SKILL.md` com menos de 500 linhas; material de referência em `references/`.

### Padrões de qualidade de skill

**Ao criar ou modificar uma skill, você DEVE usar a skill `skill-architect`** para garantir boas práticas. Se `skill-architect` não estiver instalada, siga estas regras obrigatórias de description:

- **Estrutura**: `[O que faz] + [Use quando ...] + [NÃO use para ...]`
- `**Use quando`\*\* é obrigatório — inclua frases que o usuário diria de fato
- `**NÃO use para**` é obrigatório — gatilhos negativos para evitar sobreposição com skills similares
- **Até 1024 caracteres** — sem colchetes angulares XML (`< >`)
- **Perspectiva do usuário** — frases gatilho como o usuário fala, não jargão interno

### Tooling de tradução (PT-BR)

- Manifesto: `tools/translation-manifest.json` (646 arquivos `.md`)
- Traduzir: `node tools/translate-markdown.mjs --file <path> [--translate]`
- Validadores e MCP aceitam padrões EN e PT em descriptions (`Use quando`, `Aciona em`, `NÃO use para`)

## Release

Nx Release com conventional commits. Prefixos `chore`, `test`, `style`, `build`, `ci` não disparam bump. Scan de segurança deve passar antes do release (`npm run scan`). Dois grupos independentes: `cli` e `skills-catalog`.
