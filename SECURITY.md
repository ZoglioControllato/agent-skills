# 🛡️ Política de segurança

## Filosofia

Agent Skills é um registry de skills **gerenciado e endurecido**. Ao contrário de marketplaces abertos onde [mais de 13% das skills apresentam problemas críticos](https://github.com/snyk/agent-scan/blob/main/.github/reports/skills-report.pdf), cada skill e cada ferramenta deste repositório trata segurança como restrição de primeira classe — não como detalhe depois.

Aqui segurança significa três coisas: proteger **seu ambiente** (defesa em profundidade na CLI), proteger **sua janela de contexto** (divulgação progressiva no MCP) e proteger **sua confiança** (integridade da cadeia de suprimentos).

## 🎯 Modelo de ameaças

Abordamos diretamente as ameaças do [Relatório de Ameaças a Agentes Snyk 2026](https://github.com/snyk/agent-scan/blob/main/.github/reports/skills-report.pdf):

| Ameaça                   | Marketplaces públicas                                      | Garantia do Agent Skills                                                                                       |
| :----------------------- | :--------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------- |
| **Cargas maliciosas**    | Código ofuscado, binários ou instruções “caixa preta”      | **100% código aberto**: sem binários, texto e código legíveis. Tudo auditável.                                 |
| **Roubo de credenciais** | Skills exfiltrando variáveis de ambiente silenciosamente   | **Análise estática**: o pipeline de CI/CD bloqueia skills com chamadas de rede suspeitas ou acesso a segredos. |
| **Ataques à cadeia**     | Autores publicando atualizações maliciosas em skills       | **Integridade imutável**: lockfiles e hash de conteúdo garantem que o código não mude sem upgrade explícito.   |
| **Injeção de prompt**    | Instruções ocultas para sequestrar o agente (“jailbreaks”) | **Curadoria humana**: cada prompt passa por revisão manual dos mantenedores quanto a limites de segurança.     |

## 🔐 Defesa em profundidade na CLI

O instalador da CLI (`packages/cli`) aplica várias camadas independentes. Cada operação passa por **todas** — defesa em profundidade significa que um único bypass não basta.

### 1. Higienização de entrada

Todo nome de skill e caminho de arquivo é higienizado antes do uso:```typescript
// packages/cli/src/services/installer.ts
const sanitizeName = (name: string): string => {
return (
name
.replace(/[/\\]/g, '') // Remove path separators
.replace(/[\0:*?"<>|]/g, '') // Remove null bytes and Windows-forbidden chars
.replace(/^[.\s]+|[.\s]+$/g, '') // Strip leading/trailing dots and spaces
.replace(/\.{2,}/g, '') // Collapse consecutive dots (no "..")
.replace(/^\.+/, '') // No leading dots (hidden files)
.substring(0, 255) || // Enforce filesystem name length limit
'unnamed-skill'
)
}

````
Isso bloqueia: `../../../etc/passwd`, `skill\0name`, `/etc/passwd`, `skill:name`, `.hidden`, `a`.repeat(300).

### 2. Isolamento do sistema de arquivos (proteção contra path traversal)

Mesmo após a higienização, todo caminho resolvido é verificado para estar estritamente dentro do diretório base permitido:```typescript
// packages/cli/src/services/installer.ts
const isPathSafe = (basePath: string, targetPath: string): boolean => {
  const normalizedBase = normalize(resolve(basePath))
  const normalizedTarget = normalize(resolve(targetPath))
  return normalizedTarget.startsWith(normalizedBase + sep) || normalizedTarget === normalizedBase
}
````

Ambos os caminhos são **totalmente resolvidos** (`resolve()`) antes da comparação — caminhos relativos, symlinks e sequências `..` são eliminados antes da checagem. O separador específico do SO (`sep`) evita truques como `/allowed/dir../escape`.

Esse controle vale em toda escrita, leitura e exclusão: `installSkillForAgent()`, `getInstallPath()`, `getCanonicalPath()`, `removeSkill()` e `isSkillInstalled()`.

### 3. Proteção contra symlinks

Symlinks são tratados como não confiáveis por padrão:

- **`lstat()` e não `stat()`** — detecta symlinks sem segui-los, reduzindo ataques TOCTOU
- **Validação do destino** — resolve o destino final e confirma que está no diretório base permitido, inclusive com symlinks encadeados
- **Detecção de ciclo** — erros `ELOOP` (cadeias circulares) são tratados e o link é removido à força
- **Junções no Windows** — em Windows, junções de diretório são usadas em lugar de symlinks para melhor contenção no SO```typescript
  const validateSymlinkTarget = async (linkPath: string, baseDir: string): Promise<boolean> => {
  const stats = await lstat(linkPath) // Never follows the link
  if (stats.isSymbolicLink()) {
  const target = await readlink(linkPath)
  const resolvedTarget = resolve(join(linkPath, '..'), target)
  return isPathSafe(baseDir, resolvedTarget) // Target must stay inside allowed dir
  }
  return true
  }

````
### 4. Integridade do lockfile

O lockfile (`.agents/.skill-lock.json`) é a fonte da verdade das skills instaladas. Está protegido por:

**Validação de schema (Zod):** toda leitura passa por um schema Zod estrito. Entradas inválidas são rejeitadas e o arquivo migra para um estado íntegro — sem corrupção silenciosa.

**Escritas atômicas:** o lockfile nunca é sobrescrito in-place:```
1. Backup do arquivo → .skill-lock.json.bak
2. Nova versão → .skill-lock.json.tmp
3. Renomeação atômica → .skill-lock.json.tmp → .skill-lock.json
````

Se o processo morrer no meio, o arquivo antigo permanece intacto. Se o rename falhar, o temporário é limpo.

**Hash de conteúdo:** cada skill registra SHA-256 de todos os arquivos — alteração local após instalação gera inconsistência detectável na próxima operação.

**Autorização de remoção:** skills só podem ser removidas se constarem no lockfile. A flag `--force` ignora essa verificação e é registrada no log de auditoria.

### 5. Trilho de auditoria

Toda instalação, atualização e remoção é registrada em `~/.config/agent-skills/audit.log` (formato JSON Lines):```json
{"action":"install","skillName":"codenavi","agents":["cursor"],"success":1,"failed":0,"timestamp":"2026-02-25T10:00:00Z"}
{"action":"remove","skillName":"codenavi","agents":["cursor"],"success":1,"failed":0,"forced":false,"timestamp":"2026-02-25T11:00:00Z"}

````
O log é **somente acrescentado** — entradas nunca são sobrescritas. É o registro forense de operações com skills nos agentes.

## 🔍 Varredura de segurança

Toda skill do catálogo passa por [**Snyk Agent Scan**](https://github.com/snyk/agent-scan) (antigo `mcp-scan`) antes da publicação. A varredura é **incremental** — apenas skills com conteúdo alterado são reanalizadas. É necessário `SNYK_TOKEN` (veja [Configuração da varredura](docs/security-scan.md) para CI e PRs de fork).```bash
export SNYK_TOKEN=seu-token   # Obrigatório; em https://app.snyk.io/account
npm run scan                   # Incremental (padrão — só skills alteradas)
npm run scan -- --force        # Revarredura completa
````

### Como funciona

Cada skill tem hash SHA-256 de todos os arquivos. Resultados ficam em `.security-scan-cache.json` (gitignored). Na próxima execução:```
Hash inalterado → usa cache (rápido, sem nova varredura)
Hash alterado → nova varredura com snyk-agent-scan, cache atualizado

````
Isso permite rodar em todo PR/release sem travar o CI/CD.

### Falso positivo

Se a varredura sinalizar algo intencional (ex.: integração MCP própria), adicione em `packages/skills-catalog/security-scan-allowlist.yaml`:```yaml
version: '1.0.0'

entries:
  - skill: my-skill
    code: W011
    reason: >
      Busca na API própria em api.example.com — comportamento esperado,
      não vetor de exfiltração. Revisado pelos mantenedores em 2026-01-01.
    allowedBy: github.com/username
    allowedAt: '2026-01-01'
    expiresAt: '2027-01-01' # Opcional mas muito recomendado
````

**Regras:**

- Matching é `skill + code` — sem nova varredura, efeito imediato
- `expiresAt` é opcional mas **fortemente recomendado** — obriga revisão periódica
- Entradas expiradas reativam o achado automaticamente
- O allowlist é commitado e revisado em todo PR — exceções não ficam ocultas

### Varredura no CI/CD

A varredura precisa passar antes de qualquer release. O pipeline (`release.yml`) executa `npm run scan` quando há acesso a segredos (PRs do mesmo repo e push em `main`). **PRs de fork não rodam a varredura** no fluxo normal (secrets não expostos). Para **bloquear merge até passar** em todos os PRs, use [Merge Queue do GitHub](docs/security-scan.md#blocking-merge-for-fork-prs-merge-queue) e exija o check "Security Scan (merge queue)". Detalhes em [Configuração da varredura](docs/security-scan.md). Varredura com falha bloqueia release quando ela efetivamente roda.

## 🔌 Segurança do servidor MCP

`@controllato/agent-skills-mcp` (`packages/mcp`) tem superfície de ameaça menor por desenho:

- **Somente leitura** — sem escrita no registry; só CDN
- **Sem autenticação** — roda localmente via stdio; sem endpoint exposto na rede
- **Validação de caminhos** — `fetch_skill_files` valida cada caminho contra `files[]` do registry antes de qualquer rede; não permite URL arbitrária
- **Sem acesso ao disco local do usuário pela lógica de fetch** — obtém apenas do CDN
- **`stdout` reservado ao JSON-RPC** — logs apenas em `stderr` para não corromper o protocolo

## 🛡️ Confiança no conteúdo e autoria

Este repositório reúne skills curadas em benefício da comunidade. Respeitamos a propriedade intelectual e a vontade de todos os criadores.

**Se você é autor** de algo aqui e deseja remoção ou atualização, [abra uma issue](https://github.com/agent-skills/agent-skills/issues/new) ou contate os mantenedores. Responderemos com agilidade.

Para licenciamento, veja **[Licença e atribuição](README.md#-licença-e-atribuição)** no README.

## 🚨 Reportar uma vulnerabilidade

**Por favor não abra issue pública para vulnerabilidades.**

Use um [GitHub Security Advisory](https://github.com/agent-skills/agent-skills/security/advisories/new) (privado, só para mantenedores).

Inclua:

- Descrição da vulnerabilidade
- Passos para reproduzir
- Componente afetado (`cli`, `mcp`, `skills-catalog`, skill específica)
- Impacto potencial

Objetivos: reconhecer em até **48 horas** e corrigir vulnerabilidades confirmadas em até **14 dias**. Daremos crédito no commit de correção, salvo pedido de anonimato.
