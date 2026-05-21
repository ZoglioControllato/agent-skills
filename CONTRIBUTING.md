# 🤝 Contribuindo com o Agent Skills

Antes de tudo, obrigado por dedicar tempo para contribuir! 🎉

> **Nota**: Este documento reúne o necessário para configurar o ambiente local, entender a arquitetura, criar novas skills e enviar contribuições com segurança.

## 🛠 Pré-requisitos

- **Node.js** ≥ 22
- **npm** (incluído com o Node.js)

## 🚀 Setup

```bash
git clone https://github.com/tech-leads-club/agent-skills.git
cd agent-skills
npm ci
npm run build
```

## 💻 Comandos de desenvolvimento

| Comando                            | Descrição                                 |
| ---------------------------------- | ----------------------------------------- |
| `npm run start:dev:cli`            | Executar CLI localmente (modo interativo) |
| `npm run start:dev:mcp`            | Build do MCP e abrir o Inspector          |
| `npm run generate:skill <name>`    | Gerar uma nova skill                      |
| `npm run validate`                 | Validar todas as skills                   |
| `npm run build`                    | Build de todos os pacotes                 |
| `npm run test`                     | Executar todos os testes                  |
| `npm run lint`                     | Lint do codebase                          |
| `npm run format`                   | Formatar código com Prettier              |
| `npm run scan`                     | Scan de segurança incremental             |
| `nx run marketplace:dev`           | Executar marketplace localmente           |
| `nx run marketplace:generate-data` | Atualizar dados de skills do marketplace  |

## ⭐ Criando uma nova skill

> **Importante**: Ao criar uma skill nova ou adicionar uma skill externa ao catálogo, você **deve** usar a skill **`skill-architect`** para guiar o processo e garantir os padrões de qualidade. Se você é um agente de IA, carregue a skill `skill-architect` antes de prosseguir. Se contribuir manualmente, revise os [Padrões de qualidade da description](#padrões-de-qualidade-da-description) abaixo.

```bash
# Com categoria (recomendado)
nx g @tech-leads-club/skill-plugin:skill my-skill --category=development

# Opções completas
nx g @tech-leads-club/skill-plugin:skill my-skill \
  --description="O que minha skill faz" \
  --category=development \
  --author="github.com/username" \
  --skillVersion="1.0.0"
```

O gerador cria:

- `packages/skills-catalog/skills/(development)/my-skill/SKILL.md`

Depois do scaffold, refine o conteúdo do `SKILL.md` (especialmente o campo `description`) seguindo os padrões abaixo.

## 📁 Estrutura do projeto

```
agent-skills/
├── packages/
│   ├── cli/                      # CLI @tech-leads-club/agent-skills
│   ├── marketplace/              # Site estático Next.js do registry
│   └── skills-catalog/           # Coleção de skills
│       └── skills/               # Todas as definições de skills
│           ├── (category-name)/  # Skills por categoria
│           └── _category.json    # Metadados de categoria
├── tools/
│   └── skill-plugin/             # Gerador Nx de skills
├── skills-registry.json          # Catálogo gerado automaticamente
├── .github/
│   └── workflows/                # Pipelines CI/CD
└── nx.json                       # Configuração Nx
```

## 📝 Estrutura de uma skill

```
packages/skills-catalog/skills/
├── (category-name)/              # Pasta da categoria
│   └── my-skill/                 # Pasta da skill
│       ├── SKILL.md              # Obrigatório: instruções principais
│       ├── scripts/              # Opcional: scripts executáveis
│       ├── templates/            # Opcional: templates de arquivos
│       └── references/           # Opcional: docs sob demanda
└── _category.json                # Metadados da categoria
```

### Formato do SKILL.md

```markdown
---
name: my-skill
description: O que esta skill faz em uma frase. Use quando o usuário diz "frase gatilho", "outra frase", ou "terceira frase". NÃO use para o que outra-skill cobre.
metadata:
  version: 1.0.0
  author: github.com/username
---

# Minha Skill

Descrição breve.

## Processo

1. Primeiro passo
2. Segundo passo
```

### Metadados de categoria

`_category.json`:

```json
{
  "(development)": {
    "name": "Desenvolvimento",
    "description": "Skills para desenvolvimento de software",
    "priority": 1
  }
}
```

### Boas práticas

- **Mantenha o SKILL.md com menos de 500 linhas** — use `references/` para documentação detalhada
- **Escreva descriptions específicas** — inclua frases gatilho
- **Assuma que o agente é inteligente** — adicione só o que ele ainda não sabe
- **Prefira scripts a código inline** — reduz uso da janela de contexto
- **Use a skill `skill-architect`** — para criar ou validar skills

### Padrões de qualidade da description

Toda description **deve** seguir esta estrutura:

```
[O que faz] + [Use quando ...] + [NÃO use para ...]
```

**Regras obrigatórias:**

| Regra                                                       | Exemplo                                                            |
| ----------------------------------------------------------- | ------------------------------------------------------------------ |
| Incluir `Use quando` com frases gatilho voltadas ao usuário | `Use quando o usuário diz "faça deploy do app", "coloque no ar"`   |
| Incluir `NÃO use para` com gatilhos negativos               | `NÃO use para deploy na Netlify (use netlify-deploy)`              |
| Até 1024 caracteres                                         | Seja conciso, porém completo                                       |
| Sem colchetes angulares XML (`< >`) no YAML                 | Use aspas normais                                                  |
| Perspectiva do usuário, não jargão interno                  | "conserta meu build" em vez de "remediar falhas de pipeline de CI" |

**Exemplo bom:**

```yaml
description: Faz deploy de aplicações na Vercel. Use quando o usuário pede "faça deploy do app",
  "coloque no ar" ou "crie um preview deployment". NÃO use para deploy na
  Netlify, Cloudflare ou Render (use as skills respectivas).
```

**Exemplo ruim:**

```yaml
# ❌ Sem gatilhos nem escopo negativo
description: Ajuda com deploys.
```

### Tradução e marca

Ao traduzir arquivos `.md` do repositório:

- Substitua **Tech Leads Club** por **Controllato Club** em prosa, títulos e atribuições
- **Não altere** slugs npm (`@tech-leads-club/...`), URLs GitHub (`github.com/tech-leads-club/...`) nem conteúdo dentro de blocos de código quando o identificador for técnico
- Use `node tools/translate-markdown.mjs --file <caminho>` e o manifesto `tools/translation-manifest.json` para rastrear o progresso

## 🔒 Scan de segurança

Cada skill é analisada com [Snyk Agent Scan](https://github.com/snyk/agent-scan) antes da publicação. O scan é **incremental** — só skills cujo conteúdo mudou desde a última execução são reanalisadas.

```bash
npm run scan              # Incremental (padrão); requer SNYK_TOKEN
npm run scan -- --force   # Forçar re-scan completo
```

### Como funciona

Cada skill tem um hash de conteúdo SHA-256 (calculado a partir de todos os arquivos). Os resultados ficam em cache em `.security-scan-cache.json` (gitignored). Na próxima execução, skills cujo hash não mudou pulam o re-scan e carregam o cache.

```
Hash inalterado → carrega do cache (rápido)
Hash alterado   → re-scan com snyk-agent-scan
```

### Quando o CI falha no Security Scan

1. **Abra a execução** → No job "CI Checks" haverá o passo **"Print scan failure summary"** (e/ou **"Security Scan"**) com contagens Critical/High e skills afetadas + códigos (ex.: `frontend-design: W011`).
2. **PRs do mesmo repositório** → Um bot comenta no PR com os mesmos achados e link para a execução.
3. **Corrija:**
   - **Problema real** → Ajuste a skill (remova ou restrinja o comportamento sinalizado).
   - **Falso positivo** → Adicione entrada em `packages/skills-catalog/security-scan-allowlist.yaml` (veja abaixo). Combine `skill` + `code`; inclua `reason` e `allowedBy`/`allowedAt`.
4. **Execute localmente** (opcional): `SNYK_TOKEN=<seu-token> npm run scan` antes do push. PRs de forks não rodam o scan no CI (sem secrets); use Merge Queue ou rode o scan localmente.

### Falsos positivos

Se o scanner sinalizar algo intencional (ex.: integração com servidor MCP first-party), adicione à allowlist:

**`packages/skills-catalog/security-scan-allowlist.yaml`**

```yaml
version: '1.0.0'

entries:
  - skill: my-skill
    code: W011
    reason: >
      Busca API first-party confiável — comportamento esperado.
    allowedBy: github.com/username
    allowedAt: '2026-01-01'
    expiresAt: '2027-01-01' # Opcional, mas recomendado
```

- A correspondência é por `skill + code` — não precisa re-scan após adicionar a entrada
- `expiresAt` é opcional, mas recomendado — força revisão periódica
- Entradas expiradas reativam o achado automaticamente
- Use YAML para legibilidade, comentários e diffs mais limpos

A allowlist é versionada no repositório e revisável em PRs.

## 🔄 Processo de release

O projeto usa **Conventional Commits** para versionamento automatizado:

| Prefixo do commit | Bump de versão | Exemplo                      |
| ----------------- | -------------- | ---------------------------- |
| `feat:`           | Minor (0.X.0)  | `feat: add new skill`        |
| `fix:`            | Patch (0.0.X)  | `fix: correct symlink path`  |
| `feat!:`          | Major (X.0.0)  | `feat!: breaking API change` |
| `docs:`           | Sem bump       | `docs: update README`        |
| `chore:`          | Sem bump       | `chore: update deps`         |

Releases são automatizadas via GitHub Actions ao fazer merge em `main`.

## 🛍️ Contribuindo com o Marketplace

O Agent Skills Marketplace é um site estático Next.js em `packages/marketplace`. É o frontend para navegar e descobrir skills.

Para trabalhar no marketplace localmente:

```bash
# Analisa SKILL.md e gera o JSON usado pela UI
nx run marketplace:generate-data

# Sobe o servidor de desenvolvimento (config de produção alinhada ao export estático)
nx run marketplace:dev
```

Abra `http://localhost:3000` no navegador. Para arquitetura do marketplace, SEO e setup Next.js, veja o [README do Marketplace](packages/marketplace/README.md).

## 🤝 Enviando contribuições

1. **Fork** o repositório
2. **Crie** um branch (`git checkout -b feat/minha-skill`)
3. **Commit** com conventional commits (`git commit -m "feat: add amazing skill"`)
4. **Push** para o fork (`git push origin feat/minha-skill`)
5. **Abra** um Pull Request
