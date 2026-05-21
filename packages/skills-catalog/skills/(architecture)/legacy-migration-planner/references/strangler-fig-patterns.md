# Padrões de Figo Estrangulador

O padrão Strangler Fig, cunhado por Martin Fowler, substitui gradualmente os sistemas legados, construindo novas funcionalidades em torno do sistema antigo, eventualmente substituindo-o totalmente. Nomeado em homenagem a figueiras tropicais que germinam em uma árvore hospedeira, extraem nutrientes dela e eventualmente se tornam autossustentáveis.

Esta referência cobre o padrão em TODAS as direções - não apenas na decomposição.

## Conceito Central

Quatro atividades de alto nível (por Cartwright, Horn e Lewis, citados por Fowler):

1. **Estabeleça resultados desejados claros** com alinhamento organizacional.
2. **Identifique as costuras** para decompor o sistema em componentes gerenciáveis.
3. **Substitua componentes isolados** por níveis de risco aceitáveis.
4. **Evoluir a cultura organizacional** e as práticas de desenvolvimento junto com o sistema.

Princípio-chave: **arquitetura de transição** — código temporário que permite a coexistência de sistemas novos e legados. Esta sobrecarga é justificada pelo risco reduzido em comparação com a substituição big bang.

## Padrão 1: API Gateway Strangler

Use quando o sistema expõe APIs HTTP/REST/GraphQL e você precisa rotear o tráfego entre implementações legadas e novas.

**Como funciona:**

1. Coloque uma camada de roteamento (gateway de API, proxy reverso ou roteador em nível de aplicativo) na frente do sistema legado.
2. Registro de novas implementações para rotas específicas.
3. O roteador direciona o tráfego com base em sinalizadores de recursos, distribuição percentual ou segmentos de usuários.
4. As rotas legadas são desativadas assim que a nova implementação for validada.

**Aplica-se a:**

- Monolith → microsserviços (rotear endpoints individuais para novos serviços)
- Microsserviços → monólito (rotear endpoints de serviço de volta para um aplicativo unificado)
- Migração de framework (por exemplo, Flask → FastAPI: proxy de rotas não migradas para framework antigo)

**Lógica de decisão de roteamento:**

- `porcentagem = 0` → todo o tráfego para legado
- `porcentagem = 100` → todo o tráfego para novo
- `0 <porcentagem <100` → use hashing consistente no ID do usuário ou sessão para roteamento fixo (para que o mesmo usuário sempre acesse a mesma implementação durante o canário)

**Reversão:** Defina a porcentagem de roteamento de volta para 0. Instantâneo. Nenhuma implantação necessária.

## Padrão 2: Extração de serviço com adaptador

Use ao extrair um contexto limitado de um monólito para um serviço separado (ou o inverso — absorvendo um serviço em um monólito).

**Como funciona:**

1. **Extrair interface** — Defina uma abstração (interface/protocolo/ABC) que represente a capacidade.
2. **Wrap legado** — Crie um adaptador que implemente a interface delegando ao código legado.
3. **Implementar novo** — Construa a nova implementação por trás da mesma interface.
4. **Rota via injeção de dependência** — Use sinalizadores de recursos para selecionar qual implementação injetar.

**Aplica-se a:**

- Monolith → serviços (extraia o módulo atrás da interface e mova a implementação para uma implantação separada)
- Serviços → Monolith (criar interface no Monolith, implementar chamando o serviço, em seguida, incorporar a implementação e remover o serviço)

**Principais considerações:**

- O adaptador deve lidar com diferenças de protocolo (sincronização → assíncrona, diferentes tipos de erros, tradução de formato de dados).
- Ambas as implementações devem satisfazer os mesmos testes de contrato.
- Durante a transição, a interface atua como costura.

## Padrão 3: Estrangulador de banco de dados (gravação dupla)

Use quando a migração envolver a alteração do armazenamento de dados (banco de dados diferente, esquema diferente ou divisão de um banco de dados compartilhado).

**Como funciona:**

1. **Novas gravações vão para um novo banco de dados** (fonte da verdade).
2. **Sincronização assíncrona com banco de dados legado** para compatibilidade com versões anteriores (melhor esforço — registra falhas, mas não falha na operação).
3. **As leituras tentam primeiro o novo banco de dados**, retornam ao legado se não forem encontradas.
4. **Migração lenta** — Quando um registro é lido do legado, copie-o para o novo banco de dados antes de retornar.
5. **Depois que todos os dados forem migrados**, interrompa a gravação dupla e desative o banco de dados legado.

**Aplica-se a:**

- Migração de esquema (esquema antigo → novo esquema no mesmo banco de dados ou em banco de dados diferente)
- Mudança de tecnologia de banco de dados (PostgreSQL → DynamoDB, MongoDB → PostgreSQL, etc.)
- Divisão de banco de dados (banco de dados compartilhado → bancos de dados por serviço)
- Mesclagem de banco de dados (bancos de dados por serviço → banco de dados unificado)

**Proteções críticas:**

- O novo banco de dados é SEMPRE a fonte da verdade para gravações assim que a gravação dupla começa.
- As falhas de sincronização herdadas são registradas e repetidas, nunca bloqueando a operação principal.
- A validação de consistência de dados é executada continuamente comparando os dois bancos de dados.
- O trabalho de preenchimento migra dados históricos que nunca são migrados lentamente (dados frios).

## Padrão 4: Estrangulador de componentes de UI

Use ao migrar frameworks de frontend (jQuery → React, Angular → Vue, microfrontends → monolith, etc.).

**Como funciona:**

1. **Ambos os frameworks coexistem** na mesma página/aplicativo.
2. **Componente wrapper do sinalizador de recurso** decide qual implementação renderizar.
3. **Novos componentes são carregados lentamente** (divisão de código) para evitar inchaço do pacote durante a transição.
4. **Ponte de estado compartilhada** conecta estruturas antigas e novas para dados que devem estar sincronizados.
5. **Migração em nível de rota** — Migre páginas/rotas inteiras de uma vez, não componentes individuais (a menos que os componentes sejam realmente independentes).

pendente).

**Aplica-se a:**

- jQuery/Backbone → React/Vue/Svelte
- Microfrontends → SPA unificado
- SPA unificado → microfrontends
- Angular → React (ou qualquer framework para framework)
- Renderizado pelo servidor → renderizado pelo cliente (ou vice-versa)

**Principais considerações:**

- O tamanho do pacote aumenta durante a transição (duas estruturas carregadas). Mitigue com carregamento lento e divisão de código baseada em rota.
- O estado compartilhado é o problema mais difícil. Use um barramento de eventos ou um proxy de estado global que ambas as estruturas possam assinar.
- Conflitos CSS entre estruturas precisam de escopo (módulos CSS, Shadow DOM ou convenções de nomenclatura).

## Padrão 5: Interceptação de Eventos

Use quando o sistema legado se comunica por meio de eventos (filas de mensagens, emissores de eventos, webhooks) e você precisa interceptar e redirecionar esses eventos.

**Como funciona:**

1. **Interceptar eventos** na origem — agrupar produtores de eventos legados para também emitirem para o novo barramento de eventos.
2. **Consumidores antigos e novos** recebem eventos durante a transição.
3. **Novos consumidores processam eventos** usando o formato/lógica moderna.
4. **Consumidores legados são desativados** assim que novos consumidores são validados.

**Aplica-se a:**

- Modernização de arquiteturas orientadas a eventos
- Migração de tecnologia de fila de mensagens (RabbitMQ → Kafka, SQS → EventBridge)
- Adicionar fonte de eventos a um sistema que atualmente faz gravações diretas

**Principais considerações:**

- A transformação do formato do evento deve ser bem definida e testada (formato antigo → mapeamento de novo formato).
- As garantias de pedido podem diferir entre sistemas antigos e novos — documente e lide com isso.
- Durante a transição, alguns eventos serão processados ​​duas vezes (por antigos e novos consumidores). Garanta a idempotência.

## Padrão 6: Ramificação por Abstração

Use para refatoração em larga escala onde você não pode extrair um serviço, mas precisa substituir uma implementação interna.

**Como funciona:**

1. **Crie uma abstração** (interface) para o componente que está sendo substituído.
2. **Todos os sites de chamada são atualizados** para usar a abstração em vez da implementação concreta.
3. **Implementação legada envolvida** por trás da abstração.
4. **Nova implementação construída** por trás da mesma abstração.
5. **Alterações de sinalizadores de recurso** entre implementações.
6. **Implementação legada removida** assim que a nova for validada.

**Aplica-se a:**

- Substituição de bibliotecas internas (ORM personalizado → SQLAlchemy, cliente HTTP personalizado → axios)
- Substituição de algoritmo (otimização de desempenho)
- Substituição de SDKs de fornecedores
- Qualquer refatoração interna que seja muito grande para um único PR

**Diferença da extração de serviço:** A ramificação por abstração permanece na mesma unidade de implantação. A Extração de Serviço move a implementação para uma implantação separada.

## Gerenciamento da fase de migração

Independentemente dos padrões usados, toda migração segue estas fases:

| Fase             | Tráfego para Novo            | Duração                           | Validação               | Gatilho de reversão |
| ---------------- | ---------------------------- | --------------------------------- | ----------------------- | ------------------- |
| **Configuração** | 0%                           | Até a infraestrutura estar pronta | Testes de fumaça passam | N/A                 |
| **Sombra**       | 0% (execução dupla, comparar |

e resultados) | 1-2 semanas | Paridade de resultados > 99% | Taxa de incompatibilidade > 5% |
| **Canário** | 5-10% | 1-2 semanas | Taxa de erro < valor inicial + 0,1% | Taxa de erro > valor de base + 1% |
| **Rampa** | 25% → 50% → 75% | 2-4 semanas por etapa | Paridade de desempenho | Latência > 2x linha de base |
| **Completo** | 100% | Mínimo 30 dias

| Todas as métricas verdes | Qualquer degradação métrica |
| **Limpeza** | 100% (legado removido) | 1-2 semanas | Legado sem uso por 30 dias | N/A (não é possível reverter) |

**Regra crítica:** Nunca prossiga para a próxima fase até que os critérios de validação da fase atual sejam atendidos. Se um gatilho de reversão for acionado, volte UMA fase (não até 0%).

## Escolhendo o padrão certo

Ao escrever o plano de migração, use esta matriz de decisão para selecionar padrões para cada domínio:

| Situação                                     | Padrão Primário                 | Padrões de suporte                     |
| -------------------------------------------- | ------------------------------- | -------------------------------------- |
| A API HTTP precisa rotear entre antigo/novo  | Estrangulador de gateway de API | Extração de serviço para cada endpoint |
| Módulo precisa se tornar um serviço separado | Extração de serviço             |

n com adaptador | Ramificação por Abstração para dependências internas |
| O esquema do banco de dados deve mudar | Estrangulador de banco de dados (gravação dupla) | API Gateway para roteamento de leitura/gravação |
| Mudança na estrutura do front-end | Estrangulador de componentes de UI | Interceptação de eventos para estado compartilhado |
| Substituição de biblioteca interna | Ramificação por Abstração | -

|
| Alteração do sistema de eventos/mensagens | Interceptação de Eventos | Estrangulador de banco de dados se eventos geram gravações |
| Vários serviços → monólito | API Gateway Strangler (reverso) | Extração de serviço (reverso - absorção) |
| Monólito → monólito modular | Ramificação por Abstração | — (sem limite de serviço, apenas módulos internos) |
