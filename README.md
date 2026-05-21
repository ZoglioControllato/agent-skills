<p align="center">
  <img src=".github/assets/logo.png" alt="Controllato Club" width="400" />
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/@controllato/agent-skills?style=flat-square&color=blue" alt="versão npm" />
  <img src="https://img.shields.io/npm/dt/@controllato/agent-skills?style=flat-square&color=blue" alt="downloads totais" />
  <img src="https://img.shields.io/npm/dm/@controllato/agent-skills?style=flat-square&color=blue" alt="downloads mensais" />
  <img src="https://img.shields.io/github/license/agent-skills/agent-skills?style=flat-square" alt="licença" />
  <img src="https://img.shields.io/github/actions/workflow/status/agent-skills/agent-skills/release.yml?style=flat-square" alt="status do build" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/node-%3E%3D22-brightgreen?style=flat-square&logo=node.js" alt="versão do node" />
  <img src="https://img.shields.io/badge/TypeScript-100%25-blue?style=flat-square&logo=typescript" alt="typescript" />
  <img src="https://img.shields.io/badge/Nx%20Cloud-Enabled-blue?style=flat-square&logo=nx" alt="nx cloud" />
  <img src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square" alt="semantic-release" />
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/agent-skills/agent-skills?style=flat-square&color=yellow" alt="estrelas no GitHub" />
  <img src="https://img.shields.io/github/contributors/agent-skills/agent-skills?style=flat-square&color=orange" alt="contribuidores" />
  <img src="https://img.shields.io/github/last-commit/agent-skills/agent-skills?style=flat-square" alt="último commit" />
  <img src="https://img.shields.io/badge/AI-Powered%20Skills-purple?style=flat-square&logo=openai" alt="skills com IA" />
</p>

<h1 align="center">🧠 Agent Skills</h1>

<p align="center">
  <strong>O registry seguro e validado de skills para agentes profissionais de codificação com IA</strong>
</p>

<p align="center">
  Num ecossistema em que <a href="https://github.com/snyk/agent-scan/blob/main/.github/reports/skills-report.pdf">mais de 13% das skills de marketplaces têm vulnerabilidades críticas</a>,
  o <b>Agent Skills</b> se diferencia como uma biblioteca endurecida de capacidades <b>verificadas</b>, <b>testadas</b> e <b>seguras</b>.
  Estenda <b>Antigravity</b>, <b>Claude Code</b>, <b>Cursor</b> e outros com alta confiança.
</p>

<p align="center">
  <a href="https://agent-skills.github.io/agent-skills/" target="_blank">https://agent-skills.github.io/agent-skills/</a>
</p>

## 📖 Índice

- [✨ O que são Skills?](#-o-que-são-skills)
- [🛡️ Segurança e confiança](#️-segurança-e-confiança)
- [🤖 Agentes suportados](#-agentes-suportados)
- [🌟 Skills em destaque](#-skills-em-destaque)
- [🚀 Início rápido](#-início-rápido)
- [⚡ Como funciona](#-como-funciona)
- [🔌 Servidor MCP](#-servidor-mcp)
- [🤝 Contribuindo](#-contribuindo)
- [🛡️ Conteúdo e autoria](#️-conteúdo-e-autoria)
- [📄 Licença e atribuição](#-licença-e-atribuição)

## ✨ O que são Skills?

Skills são instruções e recursos empacotados que ampliam o que um agente de IA consegue fazer. Pense nelas como **plugins para seu assistente de IA** — ensinam fluxos de trabalho, padrões e conhecimento especializado.

```
packages/skills-catalog/skills/
  (nome-da-categoria)/
    skill/
      SKILL.md          ← Instruções principais
      templates/        ← Templates de arquivo
      references/       ← Documentação sob demanda
```

## 🛡️ Segurança e confiança

A segurança do seu ambiente é prioridade. Ao contrário de marketplaces abertos onde **13,4% das skills apresentam problemas críticos**, `agent-skills` é uma biblioteca gerenciada e endurecida: 100% código aberto (sem binários), análise estática em CI/CD, integridade imutável com lockfiles e hash de conteúdo e prompts curados manualmente. A CLI usa defesa em profundidade (higienização, isolamento de caminhos, proteção contra symlinks, lockfile atômico e trilho de auditoria); cada skill é analisada com [Snyk Agent Scan](https://github.com/snyk/agent-scan) (antes mcp-scan) antes da publicação.

→ **Modelo de ameaças completo, detalhes de implementação e relatório de vulnerabilidades:** [SECURITY.md](SECURITY.md)

## 🤖 Agentes suportados

Instale skills em qualquer um destes agentes de codificação com IA:

<div align="center">
<br />

|                    Tier 1 (populares)                     |                            Tier 2 (em alta)                            |                   Tier 3 (enterprise)                   |
| :-------------------------------------------------------: | :--------------------------------------------------------------------: | :-----------------------------------------------------: |
|         **[Claude Code](https://claude.ai/code)**         |                    **[Aider](https://aider.chat)**                     |   **[Amazon Q](https://aws.amazon.com/q/developer/)**   |
|        **[Cline](https://github.com/cline/cline)**        |               **[Antigravity](https://idx.google.com)**                |       **[Augment](https://www.augmentcode.com)**        |
|             **[Cursor](https://cursor.com)**              | **[Gemini CLI](https://ai.google.dev/gemini-api/docs/code-execution)** |    **[Droid (Factory.ai)](https://www.factory.ai)**     |
| **[GitHub Copilot](https://github.com/features/copilot)** |                  **[Kilo Code](https://kilocode.ai)**                  | **[OpenCode](https://github.com/opencode-ai/opencode)** |
|       **[Windsurf](https://codeium.com/windsurf)**        |                     **[Kiro](https://kiro.dev/)**                      |  **[Sourcegraph Cody](https://sourcegraph.com/cody)**   |
|                                                           |    **[OpenAI Codex](https://openai.com/index/introducing-codex/)**     |         **[Tabnine](https://www.tabnine.com)**          |
|                                                           |                    **[Roo Code](https://roo.dev)**                     |                                                         |
|                                                           |                    **[TRAE](https://docs.trae.ai)**                    |                                                         |

</div>

<p align="center">
  <sub>Falta o seu agente favorito? <a href="https://github.com/agent-skills/agent-skills/issues/new"><strong>Abra uma issue</strong></a> e adicionamos suporte!</sub>
</p>

## 🌟 Skills em destaque

Uma amostra do que há no catálogo em crescimento:

| Skill                                                                                              | Categoria   | Descrição                                                                                                                                                                          |
| -------------------------------------------------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **[tlc-spec-driven](<packages/skills-catalog/skills/(development)/tlc-spec-driven>)**              | Development | Planejamento de projeto e feature em 4 fases: Specify → Design → Tasks → Implement. Gera tarefas atômicas com critérios de verificação e mantém memória persistente entre sessões. |
| **[aws-advisor](<packages/skills-catalog/skills/(cloud)/aws-advisor>)**                            | Cloud       | Consultoria especializada em AWS para arquitetura, segurança e implementação. Usa ferramentas MCP da AWS com respostas apoiadas em documentação.                                   |
| **[playwright-skill](<packages/skills-catalog/skills/(web-automation)/playwright-skill>)**         | Automation  | Automação completa no navegador com Playwright. Testa páginas, preenche formulários, tira screenshots, valida UX e automatiza fluxos web.                                          |
| **[figma](<packages/skills-catalog/skills/(design)/figma>)**                                       | Design      | Obtém contexto de design no Figma e traduz nós em código de produção. Implementação design-to-code com integração MCP.                                                             |
| **[security-best-practices](<packages/skills-catalog/skills/(security)/security-best-practices>)** | Security    | Revisões de segurança por linguagem e framework. Detecta vulnerabilidades, gera relatórios e sugere correções seguras por padrão.                                                  |

<p align="center">
  <a href="#-início-rápido"><strong>→ Ver todas as skills</strong></a>
</p>

## 🚀 Início rápido

### Instalar skills no seu projeto

```bash
npx @controllato/agent-skills
```

Abre um assistente interativo:

1. **Escolher ação** — "Instalar skills" ou "Atualizar skills instaladas"
2. **Navegar e selecionar** — Filtrar por categoria ou buscar
3. **Escolher agentes** — Cursor, Claude Code etc.
4. **Método de instalação** — Copiar (recomendado) ou symlink
5. **Escopo** — Global (~) ou apenas no projeto

Cada etapa oferece **← Voltar** para revisar.

### Opções da CLI

> **Nota:** Você pode usar `npx @controllato/agent-skills` ou instalar globalmente e chamar `agent-skills`.

```bash
# Modo interativo (padrão)
npx @controllato/agent-skills
# ou: agent-skills (se instalado globalmente)

# Listar skills disponíveis
agent-skills list
agent-skills ls        # Alias

# Instalar uma skill
agent-skills install -s tlc-spec-driven

# Instalar várias skills de uma vez
agent-skills install -s aws-advisor coding-guidelines docs-writer

# Instalar em agentes específicos
agent-skills install -s my-skill -a cursor claude-code

# Várias skills em vários agentes
agent-skills install -s aws-advisor nx-workspace -a cursor windsurf cline

# Instalação global (~/.gemini, ~/.claude, etc.)
agent-skills install -s my-skill -g

# Usar symlink em vez de cópia
agent-skills install -s my-skill --symlink

# Forçar novo download (ignora cache)
agent-skills install -s my-skill --force

# Atualizar uma skill específica
agent-skills update -s my-skill

# Atualizar todas as instaladas
agent-skills update

# Remover uma skill
agent-skills remove -s my-skill

# Remover várias de uma vez
agent-skills remove -s skill1 skill2 skill3
agent-skills rm -s my-skill    # Alias

# Remover de agentes específicos
agent-skills remove -s my-skill -a cursor windsurf

# Forçar remoção (ignora verificação do lockfile)
agent-skills remove -s my-skill --force

# Gerenciar cache
agent-skills cache --clear           # Limpa todo o cache
agent-skills cache --clear-registry  # Só o registry
agent-skills cache --path            # Mostra onde fica o cache

# Ver registro de auditoria
agent-skills audit                   # Operações recentes
agent-skills audit -n 20             # Últimas 20 entradas
agent-skills audit --path           # Local do arquivo de auditoria

# Contribuidores e créditos
agent-skills credits

# Ajuda
agent-skills --help
```

### Instalação global (opcional)

```bash
npm install -g @controllato/agent-skills
agent-skills  # Use 'agent-skills' em vez de npx @controllato/agent-skills
```

## ⚡ Como funciona

A CLI busca skills **sob demanda** no CDN:

1. **Navegar** — Busca o catálogo (~45 KB)
2. **Selecionar** — Você escolhe as skills
3. **Baixar** — Download e cache local
4. **Instalar** — Instalação na configuração do agente

### Cache

As skills baixadas ficam em `~/.cache/agent-skills/` para uso offline.

```bash
# Limpar cache
rm -rf ~/.cache/agent-skills
```

## 🔌 Servidor MCP

`@controllato/agent-skills-mcp` é um servidor MCP que expõe o catálogo aos agentes com **divulgação progressiva** — buscar primeiro e só depois obter o necessário.

| Ferramenta          | Finalidade                                       |
| :------------------ | :----------------------------------------------- |
| `list_skills`       | Listar todas as skills por categoria             |
| `search_skills`     | Encontrar skills por intenção (busca aproximada) |
| `read_skill`        | Carregar as instruções principais da skill       |
| `fetch_skill_files` | Obter arquivos de referência específicos         |

Chame `list_skills` somente quando o usuário pedir explicitamente para listar/navegar no catálogo.

**Instalação rápida** (qualquer cliente compatível com MCP):

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

→ Configuração completa para todos os clientes (Cursor, Claude Code, VS Code etc.), cache e erros: **[packages/mcp/README.md](packages/mcp/README.md)**

## 🤝 Contribuindo

Contribuições são bem-vindas! Veja [CONTRIBUTING.md](CONTRIBUTING.md) para ambiente local, novas skills, marketplace e release.

## 🛡️ Conteúdo e autoria

Este repositório reúne skills curadas para a comunidade. Respeitamos a propriedade intelectual e os desejos dos autores.

Se você é autor de algum conteúdo aqui e quer **remoção** ou **atualização**, [abra uma issue](https://github.com/agent-skills/agent-skills/issues/new) ou fale com os mantenedores.

## 📄 Licença e atribuição

- **Motor de software:** O código da aplicação (CLI, scripts, ferramentas) está sob **[MIT License](LICENSE)**.
- **Skills do Controllato Club:** Salvo indicação em contrário, os arquivos de skill (`SKILL.md`) dos mantenedores estão sob **[Creative Commons Attribution 4.0 International (CC-BY-4.0)](https://creativecommons.org/licenses/by/4.0/)**.
- **Skills de terceiros:** Algumas skills são da comunidade ou dos autores originais e mantêm licenças e direitos próprios. Consulte cada `SKILL.md`.

_Se usar nosso catálogo, você **deve** atribuir o Controllato Club, independentemente do uso._

## ⭐ Histórico de estrelas

<p align="center">
  <a href="https://star-history.com/#agent-skills/agent-skills&Date">
    <img src="https://api.star-history.com/svg?repos=agent-skills/agent-skills&type=Date" alt="Gráfico de histórico de estrelas" />
  </a>
</p>

---

<p align="center">
  <sub>Feito com ❤️ pela comunidade Controllato Club</sub>
</p>
