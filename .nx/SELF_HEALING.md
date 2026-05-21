# Configuração de CI auto-reparável

Este arquivo fornece instruções específicas do projeto para o agente Nx Cloud Self-Healing CI para o monorepo `agent-skills`.

## Contexto do Projeto

Trata-se de um monorepo TypeScript gerenciado por Nx, contendo:

- ** Pacote CLI ** (`@ tech-leads-club/agent-skills`) - CLI do Node.js para instalar habilidades de agente de IA
- ** Biblioteca principal ** (`@tech-leads-club/core`) - Utilitários e tipos compartilhados
- ** Plugin de habilidade ** - Gerador Nx para criar novas habilidades
- ** Coleção de habilidades ** - Habilidades pré-construídas para agentes de IA (Claude, Cursor, Copiloto, etc.)

Consulte [AGENTS.md](../AGENTS.md) para obter um contexto arquitetônico abrangente.

## Regras de confiança

- **Alta confiança necessária** para:
  - Alterações em `packages/cli/src/index.ts` (ponto de entrada)
  - Mudanças nos geradores de habilidades em `tools/skill-plugin/`
  - Quaisquer modificações nas versões publicadas do pacote
  - Alterações nos fluxos de trabalho de CI/CD (`.github/workflows/`)
  - Falhas nas tarefas `*build*` ou `*e2e*`

- ** Confiança média aceitável** para:
  - Atualizações da regra ESLint
  - Modificações de arquivo de teste (`*.spec.ts`)
  - Atualizações da documentação (README, CHANGELOG)
  - Melhorias na definição de tipo
  - Falhas nas tarefas de `*teste*`

- **Baixa confiança aceitável** para:
  - Correções de formatação (Prettier, ESLint auto-fix)
  - Normalização de espaços em branco
  - Importar organização
  - Falhas em tarefas `*format*` ou `*lint*`

- **Classificar como environment_state**:
  - Falhas na instalação da dependência
  - Problemas de variáveis de ambiente específicas de CI
  - Erros de permissão ou autenticação

## Áreas fora dos limites

- `/tmp/` - Saídas temporárias de compilação, não modifique
- `CHANGELOG.md` - Gerenciado por liberação semântica, não edite manualmente
- `package-lock.json` - Atualize apenas via `npm install`, nunca manualmente
- `/node_modules/` - Dependências, nunca modifique diretamente

## Corrigir preferências

### Fiapos e formatação

- **Sempre prefira** executar `formato nx` em vez de correções de formatação manual
- **Sempre prefira** atualizar a configuração do ESLint em vez de adicionar comentários `eslint-disable`
- Para erros de TypeScript, prefira tipos explícitos em vez de `any` ou `@ts-ignore`
- Use `// @ts-expect-error with explanation` somente quando absolutamente necessário

### Teste

- Quando ocorrerem falhas de teste nos arquivos `* .spec.ts`:
  1. Primeiro verifique se o teste em si está desatualizado
  2. Em seguida, verifique se a implementação mudou o comportamento esperado
  3. Só então sugira correções de código para fazer os testes passarem
- Prefere atualizar instantâneos de teste (`nx test --updateSnapshot') quando as alterações de UI/saída são intencionais

### Qualidade do código

- Manter padrões de código existentes (por exemplo, uso de `@clack/prompts` para interações CLI)
- Siga o kebab-case para nomes de arquivos/diretórios no diretório `skills/`
- Certifique-se de que todas as novas habilidades tenham um frontmatter válido em `SKILL.md`
- Respeite a estrutura monorepo - mantenha os pacotes independentes

### Construir falhas

- Para erros de compilação TypeScript, verifique primeiro a configuração `tsconfig.json`
- Para problemas de resolução de módulos, verifique as entradas nos caminhos `tsconfig.base.json`
- Falhas de compilação no CI geralmente indicam problemas de instalação de dependência - verifique `package.json` e lockfile

## Correções predefinidas

### Comandos Determinísticos Nx

Para essas falhas específicas, sempre execute o comando FIX correspondente:

- ** Falhas de formatação ** (`nx format:check`): Execute `nx format` para corrigir automaticamente
- ** Falhas de verificação de sincronização ** (`nx sync:check`): Execute `nx sync` para sincronizar o espaço de trabalho
- ** Falhas de fiapos **: Tente `nx affected -t lint --fix' antes de propor alterações de código
- ** Instantâneos de teste **: para alterações intencionais, execute `nx affected -t test --updateSnapshot`

# ## Falhas de validação de habilidades

Se o trabalho `validate-skills` falhar:

1. Verifique se há arquivos `SKILL.md` ausentes nos diretórios de habilidades
2. Verifique se o frontmatter começa com `---` em SKILL.md
3. Certifique-se de que as habilidades estejam devidamente listadas em `skills/categories.json`
4. Valide contra `skills/categories.schema.json`

### Questões Convencionais de Compromisso

Se a validação da mensagem de confirmação falhar:

- Certifique-se de que os commits sigam o formato: `type(scope): description`
- Tipos válidos: `feat`, `fix`, `docs`, `chore`, `test`, `refactor`, `ci`
- As alterações de interrupção requerem `!` ou `ALTERAÇÃO DE INTERRUPÇÃO:` no rodapé

### Erros de TypeScript

Para erros de caminho de importação:

- Verifique `tsconfig.base.json` para mapeamentos de caminho corretos
- Verifique as exportações de pacotes em arquivos `package.json`
- Usar importações relativas ao espaço de trabalho por meio de pseudônimos de caminhos (por exemplo, `@ tech-leads-club/core`)

## Critérios de aplicação automática

Os seguintes padrões de tarefas são seguros para aplicação automática quando o agente tem **alta confiança**:

- `*format*` - Formatação de código via Prettier/ESLint
- `*lint*` - Correções de fiapos que não mudam a lógica
- Testar atualizações quando a implementação mudar intencionalmente o comportamento

**Nunca aplicar automaticamente** correções para:

- Tarefas de `*build*` quando podem afetar pacotes publicados
- `*e2e*` ou testes de integração
- Geração de solavancos de versão ou changelog

## Contexto

Consulte [AGENTS.md](../AGENTS.md) para arquitetura completa do projeto, estrutura monorepo e diretrizes de desenvolvimento.

Arquivos de configuração principais:

- `nx.json` - Configuração do espaço de trabalho Nx e configurações do executor de tarefas
- `tsconfig.base.json` - Mapeamentos de caminho TypeScript para monorepo
- `skills/categories.json` - Taxonomia e categorização de habilidades
- `.github/workflows/ci.yml' - Definição do pipeline CI

## Notas específicas do

projeto ### Criação de habilidades

Novas habilidades devem:

1. Ser criado via `nx g @tech-leads-club/skill-plugin:skill<name>`
2. Tenha nomes de diretório kebab-case
3. Incluir frontmatter em SKILL.md com `name` e `description`
4. Siga a estrutura do modelo (consulte `tools/skill-plugin/src/generators/skill/files/`)

### Desenvolvimento CLI

Ao modificar `packages/cli/`:

- Garantir que as alterações mantenham a compatibilidade com versões anteriores
- Atualizar testes no diretório `__tests__/`
- Verificar em relação a todos os agentes suportados (Claude, Cursor, Copiloto, Antigravidade, OpenCode)
- Teste com os modos de instalação `--local` e `--global`

### Estratégia de teste

- Use `NODE_OPTIONS: ' --experimental-vm-modules'' para Jest (suporte a ESM)
- Executar testes afetados via `nx affected -t test`
- Os relatórios de cobertura estão em `coverage/` (gitignored)

## Classificação da falha

Ao analisar falhas, classifique-as como:

- **CODE_Quality**: Fiapos, formatação, erros de digitação
- **test_failure**: falhas no teste de unidade/integração
- **build_failure**: erros de compilação e agrupamento
- **Dependency_Issue**: dependências ausentes ou incompatíveis
- **configuration_error**: Configurações incorretas de nx.json, tsconfig ou package.json
- **Environment_STATE**: problemas específicos de CI (permissões, env vars)

Isso ajuda a determinar a estratégia de correção apropriada e o nível de confiança.
