# .notebook/Especificação

Leia este arquivo quando precisar criar ou atualizar notas durante o
Fase de interrogatório, ou quando você precisa entender o formato do caderno
durante o briefing.

## Estrutura```

.notebook/
├── INDEX.md # Always read first. Compact index of all notes.
├── auth-flow.md # Individual note files — flat by default.
├── error-handling.md
└── checkout-race.md

````
As notas começam planas na raiz de `.notebook/`. Quando o volume excede
~15 notas, organizadas em subdiretórios por categoria:```
.notebook/
├── INDEX.md
├── flows/
│   ├── auth-flow.md
│   └── checkout-flow.md
├── patterns/
│   └── error-handling.md
├── gotchas/
│   └── checkout-race.md
└── domain/
    └── coupon-types.md
````

Categorias:

- **fluxos** — Como as coisas funcionam. Integrações, sequências, caminhos de dados.
- **padrões** — Como as coisas são feitas aqui. Convenções, estruturas recorrentes.
- **pegadinhas** — Armadilhas. Bugs, peculiaridades, comportamento contra-intuitivo.
- **domínio** — Conceitos de negócios. Terminologia, regras e lógica não são óbvias no código.

Estas categorias são diretrizes e não regras rígidas. Se uma nota se encaixa
várias categorias, escolha a principal. Se nenhum couber, coloque-o na raiz.

## Formato INDEX.md

O índice deve ser compacto. Uma linha por nota. A IA lê isso todo
sessão, então cada byte conta.```markdown

# .notebook

> Project intelligence — read before every mission

Last updated: 2026-02-22

- [auth-flow](auth-flow.md) — OAuth2 + refresh rotation | flow | auth, security
- [error-handling](error-handling.md) — Error boundaries + custom hook | pattern | react, errors
- [checkout-race](checkout-race.md) — Race condition on cart update | gotcha | checkout, cart
- [coupon-types](coupon-types.md) — Percentage vs fixed vs BOGO rules | domain | coupons, pricing

````
Formato por linha:```
- [slug](path) — summary (max ~80 chars) | category | tags
````

Regras para INDEX.md:

- Mantenha os resumos curtos e digitalizáveis.
- As tags são minúsculas e separadas por vírgula. Use-os para um grep rápido.
- Atualize `Última atualização` sempre que o índice for alterado.
- Se estiver usando subdiretórios, os caminhos incluem a pasta: `flows/auth-flow.md`.
- Classifique pelas atualizações mais recentes, não em ordem alfabética.

## Formato de nota individual

As notas são telegráficas. Pense em notas de campo, não em documentação.```markdown

# Auth Flow

> OAuth2 with refresh token rotation

Entry: `src/middleware/auth.ts:authMiddleware()` (L12)
Flow: middleware → `services/auth/jwt.ts:verify()` → `services/user/find.ts:findById()`

Refresh: `services/auth/refresh.ts:rotateToken()`

- Single-use tokens — consumed on refresh, new pair issued
- Stored in Redis with TTL (see `lib/redis.ts:sessionStore`)

OAuth providers: `config/oauth.ts` — Google, GitHub

- Each provider maps to `services/auth/oauth/[provider].ts`

Session: Redis-backed via `lib/redis.ts` (L45-62)

Updated: 2026-02-22

````
### Princípios de formato

1. **Ponteiros, não cópias.** Sempre faça referência como:
   - `file/path.ts:functionName()` para funções
   - `file/path.ts` (L10-25) para intervalos de linhas específicos
   - `file/path.ts:ClassName.method()` para métodos de classe
   Nunca cole blocos de código em notas. Mudanças de código; ponteiros
   pode ser verificado novamente. O código colado torna-se mentiras obsoletas.

2. **Um conceito por nota.** Se precisar de rolagem, divida-o.
   Uma observação sobre o fluxo de autenticação não deve abranger também o gerenciamento de sessões
   a menos que sejam inseparáveis.

3. **Prosa mínima.** Use fragmentos, setas, travessões. Não são sentenças.
   "middleware → verificar JWT → carregar usuário → anexar ao req" é melhor
   do que "O middleware primeiro verifica o token JWT e depois carrega
   o usuário do banco de dados e, finalmente, anexa-o ao
   objeto de solicitação."

4. **Sempre inclua o ponto de entrada.** Cada nota deve ter um texto claro
   ponto de partida para que o leitor saiba por onde começar a explorar.

5. **Sempre inclua a data de atualização.** Para que o leitor saiba o quão recente
   a informação é.

6. **Sem opiniões, apenas observações.** "Usa Redux para estado" não
   "Usa Redux em vez de uma solução melhor." Se algo estiver
   genuinamente problemático, indique o impacto observável:
   "A loja Redux tem 47 chaves de nível superior - encontrando estados relevantes
   requer pesquisa em 12 redutores."

## Criando o .notebook/ pela primeira vez

Quando `.notebook/` ainda não existe:

1. Crie o diretório.
2. Crie INDEX.md apenas com o cabeçalho:

```redução
   #.notebook
   > Inteligência do projeto — leia antes de cada missão

   Última atualização: [hoje]
````

3. NÃO faça uma análise completa do projeto. As notas são criadas organicamente
   enquanto você trabalha. As primeiras notas virão da sua primeira missão
   Questionário.

## Atualizando Notas

Ao atualizar uma nota existente:

1. Leia o conteúdo atual.
2. Adicione, modifique ou remova informações com base no que você descobriu.
3. Atualize a data `Atualizado` na parte inferior.
4. Se o resumo em INDEX.md mudou, atualize-o também.

Quando a informação se torna inválida (por exemplo, um fluxo alterado devido a
seu trabalho), atualize a nota imediatamente – notas obsoletas são piores
do que nenhuma nota.

## Orçamento de token

Todo o sistema `.notebook/` foi projetado para divulgação progressiva:

- **INDEX.md** é lido em todas as sessões (cerca de 5 a 50 linhas). Custo: mínimo.
- **Notas individuais** são lidas somente quando relevantes para o atual
  missão. A IA decide qual abrir com base nas tags INDEX.md.
- **Custo total por sessão:** INDEX.md + 0-3 notas relevantes.

Se INDEX.md ultrapassar 50 entradas, considere arquivar notas antigas
em um subdiretório `archive/` e removendo-os do ativo
índice. As notas arquivadas ainda podem ser pesquisadas, mas não são carregadas por padrão.
