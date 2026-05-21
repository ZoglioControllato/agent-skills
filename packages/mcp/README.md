# 🔌 agent-skills-mcp

Servidor MCP que expõe o mesmo catálogo [agent-skills](https://github.com/agent-skills/agent-skills) para qualquer cliente de IA compatível com MCP. Use quando quiser que o agente **consulte skills sob demanda** durante a sessão — buscar por intenção e só então baixar o necessário.

## CLI versus MCP

Ambos usam o **mesmo catálogo** e o mesmo CDN. Escolha pelo fluxo de trabalho:

|                  | **CLI** (`@controllato/agent-skills`)                                               | **MCP** (este pacote)                                                       |
| :--------------- | :---------------------------------------------------------------------------------- | :-------------------------------------------------------------------------- |
| **Use quando**   | Você quer skills **instaladas** no agente (projeto ou globais), sempre disponíveis. | Você quer que o agente **consulte** skills durante o chat — sem instalação. |
| **Persistência** | Skills ficam em `.agents/`, `~/.cursor/skills/`, etc.                               | Sem instalação local; o agente busca no CDN quando precisa.                 |
| **Ideal para**   | Conjunto curado que você usa muito; lockfile, updates, vários agentes.              | Ajuda pontual, explorar o catálogo ou testar antes de instalar via CLI.     |

É possível usar **os dois**: instale suas favoritas com a CLI e adicione o MCP para puxar outras sob demanda.

## Por que usar este MCP

Quando uma skill é necessária no meio da sessão, carregar o catálogo inteiro desperdiça tokens. Este servidor segue um **fluxo em três etapas** — buscar por intenção, carregar a skill certa e só buscar referências quando preciso — assim o agente encontra skills em menos chamadas e não faz overfetch nem chuta nomes.

Para pedidos explícitos de navegação no catálogo, existe também a ferramenta `list_skills`, com lista compacta agrupada por categoria e descrições truncadas.

A busca usa **Fuse.js**: correspondência aproximada em nome, palavras-chave de gatilho extraídas, descrição e categoria, com operadores estendidos e pontuação de relevância (0–100 + qualidade do match).

## 🛠️ Ferramentas

### `list_skills`

> **Ferramenta de navegação (somente pedido explícito).**
> **Quando:** O usuário pediu explicitamente listar/navegar skills disponíveis.
> **Entrada:** `explicit_request: true` (obrigatório) e `description_max_chars` opcional (padrão `120`, intervalo `40..240`).
> **Retorno:** Skills agrupadas por `category`, cada uma com `name` e `description` truncada, além de `total_skills` e `total_categories`.
> **Restrições:** Não chame de forma proativa no fluxo normal de search/read/fetch.

- Pensado para baixo uso de tokens com JSON compacto
- Usa dados de índice em memória (sem fetch extra do registry ao executar)
- Retorna apenas skills atualmente disponíveis

### `search_skills`

> **Etapa 1 de 3** do fluxo. Sempre chame antes de `read_skill`.
> **Quando:** O usuário precisa de ajuda técnica (implementar, refatorar, testar, implantar, revisar etc.).
> **Entrada:** Frase curta de intenção, ex.: `typescript api error handling`, `react component testing`.
> **Retorno:** Até 5 skills ordenadas por relevância, com `name`, `description`, `category`, `usage_hint`, `score` (0-100) e `match_quality`.
> **Depois:** Escolha o melhor match e chame `read_skill` com o nome da skill.
> **Dicas:** Várias palavras usam AND. Use `|` para OR (ex.: `react | vue testing`). Use `=` para igualdade exata.

**Recursos de busca:**

- Fuzzy Fuse.js com **operadores estendidos** (AND, OR `|`, exato `=`, prefixo `^`)
- **Campos ponderados:** `name` (0,45), `triggers` extraídos (0,30), `description` (0,20), `category` (0,05)
- **Extração de gatilhos:** interpreta trechos tipo "Triggers on...", "Use when...", "Keywords -..." nas descrições
- **Pontuação:** cada resultado inclui score 0–100 e `match_quality` (`exact` / `strong` / `partial` / `weak`)
- Tamanho mínimo de caracteres do match: 2, para reduzir ruído
- Consulta vazia → `UserError("Query cannot be empty")`
- Sem matches → array vazio com mensagem explicativa

### `read_skill`

> **Etapa 2 de 3.** Chame depois de `search_skills` — não chame direto sem buscar antes.
> **Entrada:** `name` da skill retornado por `search_skills`.
> **Retorno:** `[0]` instruções principais (SKILL.md). `[1]` lista de caminhos de referência (`scripts/`, `references/`, `assets/`).
> **Depois:** Aplique as instruções. Só chame `fetch_skill_files` se as instruções citarem arquivos específicos.

- Obtém explicitamente `SKILL.md` de `files[]`
- Lista de referências só sob `scripts/`, `references/` e `assets/`
- Dois blocos: conteúdo principal + lista de referências (máx. 50 caminhos)
- Skill com um arquivo só → um único bloco
- Nome inválido → `UserError("Skill '{name}' not found. Use search_skills to find valid names.")`
- CDN indisponível → `UserError("CDN unavailable. Try again shortly.")`

### `fetch_skill_files`

> **Etapa 3 de 3 (opcional).** Busque arquivos de referência que as instruções pediram.
> **Entrada:** `skill_name` + até 5 `file_paths` da lista devolvida por `read_skill`.
> **Retorno:** Conteúdo de cada arquivo, separado por delimitadores `---`.
> **Restrições:** Só são válidos caminhos vindos da lista de `read_skill` — não invente caminhos. Faça várias chamadas se precisar de mais de 5 arquivos.

- Valida **todos** os caminhos contra `skill.files[]` antes de rede — erro com lista de inválidos
- Aceita só caminhos sob `scripts/`, `references/` e `assets/` de `read_skill`
- Downloads em paralelo (`Promise.allSettled`)
- Falha parcial: retorna o que deu certo e indica falhas — não aborta tudo

---

## 📦 Recurso e prompts

### `skills://catalog`

Registry JSON completo (`application/json`). Clientes MCP com suporte a Resources podem cachear nativamente.

### Prompts (comandos com /)

Prompts MCP aparecem como **slash commands** (`/`) em clientes compatíveis (Claude Desktop, Cursor, VS Code + Copilot, Claude Code). Permitem usar o catálogo sem digitar nomes das ferramentas.

#### `/skills` — Entrada principal

O caminho mais simples: descreva a tarefa em linguagem natural e o prompt guia por `search_skills` → `read_skill` → aplicar.

| Argumento | Obrigatório | Descrição                                                 |
| :-------- | :---------- | :-------------------------------------------------------- |
| `task`    | Sim         | O que você quer fazer (ex.: "optimize React performance") |

Exemplos:

- `/skills task:"refactor a large React component"`
- `/skills task:"review accessibility issues in my UI"`
- `/skills task:"plan migration from monolith to modular architecture"`

#### `/use` — Atalho direto

Use quando já souber o nome exato da skill.

| Argumento | Obrigatório | Descrição                             |
| :-------- | :---------- | :------------------------------------ |
| `name`    | Sim         | Nome exato (ex. `docs-writer`)        |
| `context` | Não         | Em que contexto você precisa de ajuda |

Exemplos:

- `/use name:"docs-writer" context:"write a README for this package"`
- `/use name:"react-best-practices" context:"improve Next.js page performance"`

#### `/skills-help` — Exemplos rápidos

Mostra quando usar `/skills` versus `/use`.

#### `/find-skill` — Alias

Alias para `/skills` com o mesmo argumento `task`.

---

## 🚀 Início rápido

### Plugin (recomendado)

Mais rápido — sem editar JSON manualmente.

#### Cursor

Acesse [cursor.com/marketplace](https://cursor.com/marketplace), busque **`agent-skills`**, ou no Cursor:

```bash
/add-plugin agent-skills
```

#### Claude Code

Adicione o marketplace da organização, depois instale o plugin:

```bash
/plugin marketplace add agent-skills/agent-skills
/plugin install agent-skills-mcp@controllato
```

Ou use o [diretório oficial de plugins Anthropic](https://claude.com/plugins) e busque **`agent-skills-mcp`**.

### Instalação manual (qualquer agente compatível com MCP)

Adicione o servidor ao arquivo de config. O trecho segue o formato MCP usual:

```json
{
  "mcpServers": {
    "agent-skills": {
      "command": "npx",
      "args": ["-y", "@controllato/agent-skills-mcp"]
    }
  }
}
```

#### Claude Code (CLI)

```bash
claude mcp add agent-skills -- npx -y @controllato/agent-skills-mcp
```

#### VS Code (GitHub Copilot)

`.vscode/mcp.json` usa schema levemente diferente:

```json
{
  "servers": {
    "agent-skills": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@controllato/agent-skills-mcp"]
    }
  }
}
```

## ⚡ Cache

O registry é buscado no [CDN jsDelivr](https://cdn.jsdelivr.net/gh/agent-skills/agent-skills@latest/packages/skills-catalog/skills-registry.json) e em cache em memória:

- **TTL:** 15 minutos — cache hit não faz rede
- **Revalidação ETag:** ao expirar, envia `If-None-Match`; `304` renova o TTL sem baixar o payload
- **Retry no cold start:** 3 tentativas com backoff exponencial — servidor não sobe sem alcançar o CDN nas condições iniciais
- **Stale fallback:** se o CDN falhar após warmup, devolve cache antigo em vez de erro
- Logs de cache vão só para `stderr` (nunca `stdout` — reservado ao JSON-RPC)

## 🔒 Referência de erros

| Situação                                | Comportamento                                                    |
| :-------------------------------------- | :--------------------------------------------------------------- |
| CDN do registry indisponível na partida | 3 tentativas com backoff, depois o servidor sai com erro         |
| CDN indisponível após aquecimento       | Cache antigo devolvido; aviso em `stderr`                        |
| JSON do registry malformado             | Erro registrado em `stderr`; usa cache velho se houver           |
| `skill_name` fora do registry           | `UserError`: Skill não encontrada; use `search_skills`           |
| `file_paths` com caminho inválido       | `UserError` listando todos os inválidos — nenhum arquivo baixado |
| `search_skills` com query vazia         | `UserError`: query não pode ser vazia                            |
| Uma falha em fetch paralelo de arquivo  | Sucesso parcial: devolve arquivos ok e marca os que falharam     |

## 🧪 Desenvolvimento

Na **raiz do repositório**:

```bash
npm run build              # Build completo (ou: npx nx build @controllato/agent-skills-mcp)
npx nx lint @controllato/agent-skills-mcp
npx nx test @controllato/agent-skills-mcp
npm run start:dev:mcp      # Build MCP + Inspector
```

Em **packages/mcp**:

```bash
npx nx build @controllato/agent-skills-mcp
npx nx lint @controllato/agent-skills-mcp
npx nx test @controllato/agent-skills-mcp
npm run start:dev          # Build + Inspector (usa ../../dist/packages/mcp)
```

## ⚙️ Requisitos

- Node.js ≥ 24

## 📄 Licença e repositório

MIT — [Controllato Club](https://github.com/agent-skills). Mesmo repositório da [CLI](https://github.com/agent-skills/agent-skills) e do [catálogo de skills](https://agent-skills.github.io/agent-skills/).
