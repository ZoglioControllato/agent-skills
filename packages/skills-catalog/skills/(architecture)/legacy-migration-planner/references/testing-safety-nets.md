# Testando Redes de Segurança

Nenhuma etapa de migração deve ser executada sem uma rede de segurança. Esta referência define as estratégias de teste a serem aplicadas antes, durante e depois de cada fase de migração. O objetivo é detectar regressões comportamentais ANTES que cheguem à produção.

## Matriz de Seleção de Estratégia

Escolha estratégias de teste com base no contexto de migração:

| Situação                   | Estratégia Primária                | Estratégias de Apoio                   |
| -------------------------- | ---------------------------------- | -------------------------------------- |
| Código legado sem testes   | Testes de Caracterização           | Mestre Dourado                         |
| Migração de API            | Testes de Contrato                 | Execução Paralela, Testes Instantâneos |
| Migração de banco de dados | Validação de consistência de dados | Corrida Paralela                       |
| Migração de front-end      | Regressão Visual                   | Testes instantâneos, E2E               |
| Substituição de algoritmo  | Testes baseados em propriedades    | Corrida Paralela                       |

| Completo

l migração de sistema | Corrida Paralela | Todos os itens acima |

## Testes de Caracterização

**Objetivo:** Capturar o comportamento atual do código legado ANTES de qualquer alteração. Esses testes documentam o que o código faz hoje – mesmo que esse comportamento seja problemático. Os bugs são documentados, e não corrigidos, durante esta fase.

**Quando usar:** Código legado sem testes ou cobertura de testes insuficiente (abaixo de 60% para o módulo que está sendo migrado).

**Método:**

1. Identifique a interface pública do módulo (funções, métodos, endpoints de API).
2. Para cada função pública, escreva testes que a chamem com entradas representativas e afirmem a saída REAL.
3. Incluir casos extremos: entradas nulas/indefinidas, coleções vazias, valores limite, condições de erro.
4. Se a função tiver efeitos colaterais (gravações de banco de dados, chamadas de API, E/S de arquivo), simule a dependência externa e afirme que a simulação foi chamada com o argumento esperado

entes.

**Formato de documentação no plano de domínio:**

```markdown
### Testing: Characterization Tests

**Target**: `src/orders/service.ts` (functions: createOrder, updateOrder, cancelOrder)
**Coverage goal**: 80% line coverage before any migration begins
**Edge cases to cover**:

- Empty order items (`file:line` — current behavior: throws generic Error)
- Negative quantities (`file:line` — current behavior: accepts silently, BUG)
- Concurrent modifications (`file:line` — no locking, potential race condition)
  **Known bugs captured** (do not fix during characterization):
- {Bug description} at `file:line`
```

## Golden Master / Teste de instantâneo

**Objetivo:** capturar a saída completa de funções complexas ou endpoints de API como um instantâneo de referência. Qualquer desvio do instantâneo indica uma mudança comportamental.

**Quando usar:** Funções com saída complexa (relatórios, respostas formatadas, renderização HTML) onde escrever asserções individuais é impraticável.

**Método:**

1. Execute a função com entradas fixas.
2. Salve a saída completa como um arquivo "golden master".
3. Em cada execução subsequente, compare a saída atual com o golden master.
4. Qualquer diferença requer revisão humana: foi uma mudança intencional?

**Ferramentas para recomendar** (verifique através de pesquisa na web antes de recomendar):

- Python: `approvaltests`, `syrupy`
- JavaScript/TypeScript: instantâneos Jest (`toMatchSnapshot`), `storybook` para UI
- Vai: `go-snaps`
- Geral: `insta` (Rust), comparação de arquivos personalizados

**Formato de documentação no plano de domínio:**

```markdown
### Testing: Golden Master

**Target**: `src/reports/monthly.ts:generateReport()`
**Golden master location**: `./migration-plan/golden-masters/monthly-report-{date}.txt`
**Fixed inputs**: {Describe the deterministic test data}
**Non-deterministic elements to normalize**: timestamps, UUIDs, random IDs
```

## Testes de contrato

**Objetivo:** verificar se o contrato de interface entre dois sistemas (ou entre implementações antigas e novas) é mantido. Se a nova implementação satisfizer o mesmo contrato, é uma substituição segura.

**Quando usar:** Migração de API, extração de serviço, qualquer cenário onde o consumidor de uma interface não perceba a mudança.

**Método:**

1. Defina o contrato: formato de solicitação, formato de resposta, códigos de status, respostas de erro, cabeçalhos.
2. Escreva testes que validem AMBAS as implementações legadas e novas em relação ao mesmo contrato.
3. Execute testes de contrato em CI – ambas as implementações devem passar antes das alterações no roteamento do tráfego.

**Tipos de contratos:**

- **Contratos de API** — Método HTTP, caminho, esquema do corpo da solicitação, esquema do corpo da resposta, códigos de status.
- **Contratos de eventos** — Nome do evento, esquema de carga útil, garantias de pedido.
- **Contratos de banco de dados** — Esquema de tabela, colunas obrigatórias, tipos de dados, restrições.

**Formato de documentação no plano de domínio:**

```markdown
### Testing: Contract Tests

**Contract**: Order API
**Endpoints covered**:

- `POST /api/orders` — request: OrderCreate schema, response: Order schema, status: 201
- `GET /api/orders/:id` — response: Order schema, status: 200 | 404
  **Schema location**: `file:line` (OpenAPI spec) or defined inline
  **Both implementations must pass**: Legacy (`src/legacy/orders.ts`) and New (`src/new/orders.ts`)
```

## Teste de execução paralela

**Objetivo:** Executar implementações antigas e novas simultaneamente com as mesmas entradas e comparar resultados. O resultado legado é usado na produção; o novo resultado é registrado para comparação.

**Quando usar:** Migrações de alto risco em que você precisa ter certeza de que a nova implementação produzirá resultados idênticos antes de alternar o tráfego.

**Método:**

1. Envolva o site de chamada para invocar AMBAS as implementações.
2. Devolva o resultado LEGACY ao chamador (segurança de produção).
3. Execute a nova implementação em segundo plano.
4. Compare os resultados e registre as discrepâncias.
5. Quando a taxa de discrepância cair abaixo do limite (por exemplo, <0,1%), inicie a migração do tráfego.

**Proteções críticas:**

- Novas falhas de implementação NUNCA devem afetar a resposta da produção.
- A comparação deve levar em conta diferenças aceitáveis ​​(IDs diferentes, carimbos de data e hora, ordenação de campos).
- Registrar contexto suficiente para reproduzir discrepâncias (argumentos de entrada, ambas as saídas).
- Execute uma amostra estatisticamente significativa antes de tirar conclusões.

**Formato de documentação no plano de domínio:**

```markdown
### Testing: Parallel Run

**Target function**: `calculateShipping()` at `file:line`
**Comparison criteria**:

- Result amount must match within $0.01
- Delivery date must match exactly
- Carrier selection must match
  **Acceptable discrepancy rate**: < 0.1% over 10,000 invocations
  **Duration**: 2 weeks minimum
  **Monitoring**: Log to `{observability tool}` — ASK USER what they use
```

## Teste Baseado em Propriedades

**Objetivo:** descobrir casos extremos testando propriedades (invariantes) que devem ser válidas para TODAS as entradas, não apenas para casos de teste escolhidos a dedo. Uma estrutura de teste gera centenas de entradas aleatórias e verifica as propriedades.

**Quando usar:** Substituição de algoritmo, migração de lógica de negócios, qualquer função em que o espaço de entradas válidas seja grande e os casos extremos sejam difíceis de enumerar.

**Método:**

1. Identifique as propriedades que SEMPRE devem ser mantidas (por exemplo, “o resultado nunca é negativo”, “a saída é classificada”, “o desconto nunca excede 50%”).
2. Defina geradores de entrada (entradas válidas aleatórias).
3. Execute o teste de propriedade com mais de 100 iterações.
4. Qualquer entrada com falha é uma regressão potencial.

**Ferramentas recomendadas** (verifique por meio de pesquisa na web):

- Python: `hipótese`
- JavaScript/TypeScript: `verificação rápida`
- Vá: `gopter`
- Ferrugem: `proptest`

**Formato de documentação no plano de domínio:**

```markdown
### Testing: Property-Based

**Target**: `calculateDiscount()` at `file:line`
**Properties**:

- Result >= 0 (never negative)
- Result <= originalPrice (never exceeds price)
- Result >= originalPrice \* 0.5 (max 50% discount, per business rule at `file:line`)
  **Input space**: price [0.01, 100000], quantity [1, 1000], customerType [regular, premium]
```

## Validação de consistência de dados

**Objetivo:** Durante a migração do banco de dados (fase de gravação dupla), verifique continuamente se ambos os bancos de dados contêm os mesmos dados.

**Quando usar:** Qualquer migração que envolva alterações de banco de dados — migração de esquema, mudança de tecnologia de banco de dados, divisão/mesclagem de banco de dados.

**Método:**

1. **Comparação de contagem de linhas** — Ambos os bancos de dados devem ter o mesmo número de registros (com uma pequena tolerância de atraso para sincronização assíncrona).
2. **Comparação de amostras** — Amostra aleatória de N registros e comparação campo por campo.
3. **Comparação de somas de verificação** — Calcula somas de verificação em campos-chave para tabelas grandes.
4. **Trabalho de reconciliação** — Trabalho agendado que encontra e relata discrepâncias.

**Formato de documentação no plano de domínio:**

```markdown
### Testing: Data Consistency

**Tables under dual-write**: `orders`, `order_items`
**Validation frequency**: Every 15 minutes during migration
**Tolerance**: Row count difference < 100 (accounting for async lag)
**Sample size**: 1000 random records per validation run
**Discrepancy handling**: Log to monitoring, alert if > 0.1% mismatch
```

## Teste de regressão visual

**Objetivo:** detectar alterações visuais não intencionais ao migrar componentes de front-end.

**Quando usar:** Migração de framework de front-end, refatoração de CSS, substituição de biblioteca de componentes.

**Método:**

1. Capture capturas de tela de cada página/componente ANTES da migração.
2. Após migrar um componente, faça capturas de tela novamente.
3. A comparação pixel-diff identifica regressões visuais.

**Ferramentas recomendadas** (verifique por meio de pesquisa na web):

- Comparações visuais de dramaturgos
- Cromático (livro de histórias)
  -Percy
- Backstop JS

**Formato de documentação no plano de domínio:**

```markdown
### Testing: Visual Regression

**Pages/components captured**: {List with routes or component names}
**Baseline screenshots**: `./migration-plan/visual-baselines/`
**Tool**: {Verified via web search — include version}
**Threshold**: < 0.1% pixel difference per component
```

## Cronograma da fase de teste

Mapeie estratégias de teste para fases de migração:

| Fase de migração               | Testes Necessários            | Finalidade                            |
| ------------------------------ | ----------------------------- | ------------------------------------- |
| **Fase 0 (Rede de Segurança)** | Caracterização, Golden Master | Capturar o comportamento atual        |
| **Fase 0 (Rede de Segurança)** | Testes de Contrato            | Definir o contrato de interface       |
| **Fase sombra**                | Corrida Paralela              | Compare o antigo com o novo sem risco |
| **Fase Canário**               | Tudo acima + monitoramento    | Valide com tráfego real               |
| **Fase de rampa**              | Contrato contínuo + contras   |

consistência | Garantir que não haja desvios em escala |
| **Migração completa** | Conjunto completo de regressão | Confirme que não há regressões |
| **Pós-migração** | Remova a execução paralela, mantenha os contratos | Validação contínua |
