# Estratégias de migração de front-end e back-end

Padrões específicos de pilha para migrações de front-end e back-end. Esta referência é independente de direção – ela cobre decomposição, consolidação e migrações entre pilhas para ambas as camadas.

Sempre verifique as recomendações de ferramentas/estrutura por meio de pesquisa na web antes de incluí-las no plano de migração. Nunca recomende uma ferramenta baseada apenas nesta referência – as versões e os ecossistemas mudam.

## Estratégias de front-end

### Decomposição de front-end: Monolith SPA → Microfrontends

**Quando:** um SPA grande se tornou muito complexo para uma única equipe, a implantação é lenta e as equipes precisam de autonomia.

**Identificação da costura:**

- Limites em nível de rota — Cada rota ou grupo de rotas se torna um candidato a microfrontend.
- Limites de recursos — Recursos distintos (painel, configurações, administrador) que possuem estado compartilhado mínimo.
- Procure: configuração do React Router, configuração do Vue Router, módulos de roteamento Angular. Cite `arquivo:linha`.

**Abordagem estranguladora:**

1. Adicione um aplicativo shell (app shell) que lida com roteamento e carrega microfrontends.
2. Migre uma rota de cada vez para um microfrontend separado.
3. O shell é roteado para o SPA legado ou para o novo microfrontend com base na URL.
4. Os componentes compartilhados são extraídos para uma biblioteca de componentes consumida por todos os microfrontends.

**Estado compartilhado durante a transição:**

- Eventos personalizados via `window.dispatchEvent()` / `window.addEventListener()`.
- Armazenamento de estado compartilhado acessível tanto para o antigo quanto para o novo (por exemplo, um objeto proxy global).
- Estado baseado em URL (parâmetros de consulta, fragmentos de hash) como mecanismo de coordenação.

**Principais riscos:**

- Aumento do tamanho do pacote (dois frameworks carregados simultaneamente).
- Conflitos de CSS entre frameworks antigos e novos.
- Autenticação/estado de sessão compartilhado.
- Degradação de desempenho devido a vários bootstraps de estrutura.

### Consolidação de Frontend: Microfrontends → SPA Unificado

**Quando:** A sobrecarga do microfrontend excede os benefícios: poucas equipes, duplicação excessiva, experiência do usuário insatisfatória devido à interface de usuário inconsistente, pipeline de implantação complexo.

**Abordagem do estrangulador (reverso):**

1. Crie o aplicativo SPA unificado.
2. Para cada microfrontend, reimplemente sua funcionalidade como um módulo/rota dentro do SPA unificado.
3. O aplicativo shell é roteado para o novo SPA unificado para rotas migradas e para microfrontends legados para o restante.
4. Depois que todas as rotas forem migradas, desative o shell e a infraestrutura de microfrontend.

**Principais considerações:**

- Mesclar bibliotecas de componentes compartilhados em uma.
- Consolidar a gestão do estado (múltiplas lojas → loja única).
- Unifique ferramentas de construção e CI/CD.
- Resolver conflitos de CSS/estilo.

### Migração de front-end entre estruturas

**Quando:** jQuery → React, Angular → React, Vue 2 → Vue 3, qualquer framework para framework.

**Abordagem estranguladora:**

1. **Estratégia de ponto de montagem** — A nova estrutura é montada em elementos DOM específicos enquanto a estrutura antiga controla o resto da página.
2. **Migração em nível de rota** — Páginas inteiras são reescritas na nova estrutura. O roteador (ou servidor) decide qual estrutura atende qual rota.
3. **Migração em nível de componente** — Componentes individuais são substituídos. Um componente wrapper conecta a estrutura antiga para renderizar o novo componente.

**Escolhendo o nível certo:**

- O nível de rota é mais seguro e simples (limite claro, sem necessidade de comunicação entre estruturas dentro de uma página).
- O nível de componente é necessário quando as páginas são muito complexas para serem reescritas de uma só vez ou quando um componente compartilhado (por exemplo, barra de navegação) deve ser migrado de forma independente.

**Padrões de ponte de estado compartilhado:**

- **Barramento de eventos** — Ambas as estruturas emitem e escutam eventos DOM personalizados.
- **Proxy de estado global** — Um objeto `Proxy` que aciona novas renderizações em ambas as estruturas quando sofre mutação.
- **Estado da URL** — O estado codificado na URL (parâmetros de consulta, hash) é independente de estrutura.
- **Cookie/localStorage** — Para estado persistente que ambas as estruturas precisam ler.

**Estratégias de isolamento de CSS:**

- Módulos CSS (nomes de classes com escopo definido).
- Shadow DOM (isolamento total).
- Convenção de nomenclatura BEM (menos isolamento, mas sem necessidade de ferramentas).
- CSS-in-JS (específico do framework — funciona apenas para o framework que o utiliza).

### Migração renderizada pelo servidor ↔ Migração renderizada pelo cliente

**SSR → CSR (ou vice-versa):**

1. Identifique quais páginas se beneficiam de SSR (SEO, desempenho de carregamento inicial) versus CSR (interatividade, conteúdo dinâmico).
2. Migrar página por página — o servidor pode retornar HTML SSR ou um shell CSR com base na rota.
3. Utilizar hidratação progressiva ou SSR contínua como passos intermédios se a estrutura alvo o apoiar.

**Principais riscos:**

- Impacto de SEO ao passar de SSR para CSR (verifique com pesquisa na web as melhores práticas atuais).
- Mudanças no desempenho da carga inicial.
- Os padrões de busca de dados diferem (carregamento de dados do lado do servidor versus chamadas de API do lado do cliente).

## Estratégias de back-end

### Decomposição de back-end: Monolith → Microsserviços

**Identificação da costura:**

- **Grupos de rotas de API** — Rotas que compartilham um prefixo (`/api/orders/*`, `/api/users/*`) são candidatas naturais a serviços. Cite as definições de rota em `file:line`.
- **Clusters de tabelas de banco de dados** — Tabelas que são acessadas apenas por um módulo são boas candidatas à extração. Tabelas acessadas por vários módulos precisam de estratégias de fachada/gravação dupla.
- **Grupos de trabalho em segundo plano** — Tarefas agendadas e trabalhadores que processam um domínio específico.

**Abordagem estranguladora:**

1. Coloque um gateway API ou proxy reverso na frente do monólito.
2. Extraia um contexto limitado de cada vez para um novo serviço.
3. O gateway roteia solicitações de endpoints extraídos para o novo serviço e todo o resto para o monólito.
4. O novo serviço possui banco de dados próprio (se os dados foram isolados) ou utiliza gravação dupla (se os dados foram compartilhados).
5. A comunicação entre serviços utiliza eventos (preferenciais) ou chamadas síncronas (quando necessário).

**Padrões de extração de banco de dados:**

- **Tabelas próprias** (somente este domínio grava nelas) → Mover tabelas para o novo banco de dados do serviço. O monólito lê via API em vez de acesso direto ao banco de dados.
- **Tabelas compartilhadas** (gravação de vários domínios) → Padrão de gravação dupla durante a transição. Um serviço se torna o proprietário, outros usam a API.
- **Tabelas de referência** (dados de pesquisa lidos por muitos) → Replique por meio de eventos ou acesso compartilhado somente leitura durante a transição.

**Padrões de comunicação durante a transição:**

- **Síncrono** (HTTP/gRPC) — Mais simples de implementar, mas cria acoplamento em tempo de execução. Use para comandos (gravações) onde o chamador precisa de confirmação imediata.
- **Assíncrono** (fila de mensagens/eventos) — Desacopla serviços, mas adiciona complexidade. Use para notificações, sincronização de dados e operações onde a consistência eventual é aceitável.
- **Híbrido** — Comandos via sincronização, eventos via assíncrono. Padrão mais comum durante a migração.

### Consolidação de back-end: Microsserviços → Monólito Modular

**Quando:** A sobrecarga operacional dos microsserviços excede o valor — muitos serviços para o tamanho da equipe, a complexidade do sistema distribuído é injustificada, problemas de consistência de dados entre os serviços.

**Abordagem do estrangulador (reverso):**

1. Crie o aplicativo monolítico com limites de módulo claros (diretórios separados, injeção de dependência, sem acesso ao banco de dados entre módulos).
2. Para cada microsserviço, reimplemente sua lógica como um módulo dentro do monólito.
3. O gateway da API roteia endpoints migrados para o monólito, não migrados para serviços legados.
4. Substitua chamadas HTTP/gRPC entre serviços por chamadas de função em processo.
5. Mesclar bancos de dados em um único banco de dados com nível de esquema

l isolamento (um esquema por módulo).

**Principais considerações:**

- Preservar os limites do módulo dentro do monólito (não criar uma grande bola de lama).
- Use injeção de dependência para manter o acoplamento fraco entre os módulos.
- Mantenha a opção de extrair novamente os serviços posteriormente, se necessário.
- Consolidar a observabilidade (um conjunto de logs, métricas, rastreamentos em vez de por serviço).

### Migração de back-end entre idiomas

**Quando:** Python → TypeScript/NestJS, Ruby → Go, Java → Kotlin, PHP → Node.js ou qualquer migração de linguagem para linguagem.

**Abordagem estranguladora:**

1. **Rotas de gateway de API** entre serviços de linguagem antigos e novos.
2. Migre um grupo de endpoints por vez para o novo idioma.
3. Ambas as implementações compartilham o mesmo banco de dados durante a transição (ou usam gravação dupla se o esquema for alterado).
4. Os testes de contrato verificam se ambas as implementações produzem respostas idênticas.

**Requisitos críticos de pesquisa:**

- Use a pesquisa na web para encontrar guias oficiais de migração entre linguagens/estruturas específicas.
- Use context7 para consultar a documentação da estrutura de destino para: configuração do projeto, padrões ORM/banco de dados, autenticação, middleware, testes.
- Pesquise o ecossistema: existem bibliotecas equivalentes disponíveis? (por exemplo, o idioma alvo possui um ORM maduro, agendador de tarefas, etc.)
- Implementação da investigação: a língua-alvo adapta-se à infra-estrutura existente?

(Imagens Docker, compatibilidade sem servidor, requisitos de memória/CPU)

**Considerações sobre a camada de dados:**

- Diferenças de ORM (SQLAlchemy vs TypeORM vs Prisma vs GORM) — definições de modelo, ferramentas de migração e construtores de consultas diferem significativamente.
- As estratégias de pooling de conexões diferem de acordo com o tempo de execução do idioma.
- Os padrões de gerenciamento de transações são diferentes (gerenciadores de contexto em Python, decoradores em NestJS, deferimento em Go).

## Estratégias de migração de banco de dados

Eles se aplicam a AMBAS as migrações de front-end (armazenamento do lado do cliente, IndexedDB, localStorage) e de back-end (SQL, NoSQL, etc.).

### Evolução do Esquema (Contrato Expandido)

Para alterar o esquema no mesmo banco de dados:

1. **Expandir** — Adicione novas colunas/tabelas. Não remova nada ainda. Garanta padrões ou anulável.
2. **Migrar código** — Atualize o aplicativo para gravar em AMBAS as colunas antigas e novas.
3. **Preenchimento** — Migre dados existentes de colunas antigas para novas colunas.
4. **Alternar leituras** — O aplicativo lê de novas colunas (com fallback para as antigas).
5. **Contrato** — Remova colunas antigas assim que todas as leituras forem migradas e validadas.

### Mudança tecnológica (PostgreSQL → DynamoDB, etc.)

Use o padrão Database Strangler (Dual-Write) de `strangler-fig-patterns.md`:

1. Novas gravações vão para um novo banco de dados (fonte da verdade).
2. Sincronização assíncrona com banco de dados antigo.
3. Lê, tente o novo primeiro, retorne ao antigo.
4. Migração lenta na leitura.
5. Trabalho de preenchimento para dados frios.
6. Desative o banco de dados antigo.

**Crítico:** Pesquise minuciosamente o banco de dados de destino por meio de pesquisa na Web. Entenda: diferenças de modelagem de dados (relacional vs documento vs chave-valor), mudanças no padrão de consulta, suporte a transações, modelo de consistência e requisitos operacionais (backup, monitoramento, escalabilidade).

## Versionamento de API durante a migração

Quando os endpoints estão sendo migrados, você precisa de uma estratégia de controle de versão para evitar quebrar os consumidores existentes.

**Estratégias (escolha com base no contexto):**

| Estratégia                              | Mecanismo                               | Melhor para                                                      |
| --------------------------------------- | --------------------------------------- | ---------------------------------------------------------------- |
| **Versão de URL**                       | `/api/v1/` vs `/api/v2/`                | APIs públicas com muitos consumidores                            |
| **Controle de versão de cabeçalho**     | `Aceitar versão: 2`                     | APIs internas, menos consumidores                                |
| **Negociação de conteúdo**              | `Aceitar: application/vnd.api.v2+json`  | APIs REST-puristas                                               |
| **Sem versionamento** (somente aditivo) | Novos campos adicionados, nada removido | Migrações simples, alterações compatíveis com versões anteriores |

**Protocolo de descontinuação:**

1. Adicione o cabeçalho de descontinuação às respostas da versão antiga: `X-API-Deprecated: true`, `X-API-Sunset: {date}`.
2. Registrar o uso de endpoints obsoletos para acompanhar o progresso da migração do consumidor.
3. Notificar os consumidores (por meio de documentação, e-mail ou cabeçalhos de resposta da API).
4. Desative a versão antiga somente depois que o uso cair para zero (ou após a data de desativação com aviso prévio).

## Observabilidade durante a migração

Toda migração deve incluir observabilidade para comparar comportamentos antigos e novos:

**Métricas a serem rastreadas:**

- Taxa de erro (antigo vs novo)
- Latência (p50, p95, p99 — antigo vs novo)
- Taxa de transferência (solicitações por segundo — antigas versus novas)
- Métricas de negócios (taxa de conversão, valor do pedido, etc. — verifique se não há degradação)

**Abordagem recomendada:**

- Marque todas as solicitações/eventos com `migration_path: legado | new` na ferramenta de observabilidade.
- Crie um painel comparando o antigo e o novo em todas as métricas.
- Definir alertas para: diferença de taxa de erro > 1%, diferença de latência > 2x, diferença de métrica de negócios > 5%.
- PERGUNTE AO USUÁRIO quais ferramentas de observabilidade ele utiliza. Não presuma.
