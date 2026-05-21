# Fase de Pesquisa — Metodologia Detalhada

Esta referência contém o processo passo a passo para a fase de PESQUISA. Cada descoberta deve citar `file:line` da base de código do usuário ou de uma URL externa verificada. Se você não puder verificar algo, não inclua – pergunte ao usuário.

## Etapa 1: análise profunda da base de código

### 1.1 — Verificação da estrutura do projeto

Leia o diretório raiz e mapeie a estrutura de nível superior. Identificar:

- **Pontos de entrada** — `main.ts`, `index.ts`, `app.py`, `manage.py`, `server.go`, etc. Cite cada um como `file:line`.
- **Arquivos de configuração** — `package.json`, `requirements.txt`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `pom.xml`, `docker-compose.yml`, `Makefile`, etc. Eles revelam a pilha, versões e scripts.
- **Construir e implantar configuração** — `Dockerfile`, pipelines CI/CD (`.github/workflows/`, `Jenkinsfile`, `.gitlab-ci.yml`), infraestrutura como

código (`terraform/`, `cdk/`, `cloudformation/`).

- **Indicadores Monorepo** — `nx.json`, `lerna.json`, `turbo.json`, `pnpm-workspace.yaml`, definições de espaço de trabalho em `package.json`.

### 1.2 — Inventário de Dependências

Para cada arquivo de dependência encontrado:

1. Leia o arquivo completamente.
2. Liste cada dependência com sua **versão fixada ou de intervalo**.
3. Use a pesquisa na web para verificar: esta dependência ainda é mantida? Qual é a versão mais recente? Existem vulnerabilidades de segurança conhecidas?
4. Sinalize dependências obsoletas, não mantidas ou em fim de vida.

Formato de saída para `dependency-map.md`:```markdown

## Dependencies — {file:line ref to dependency file}

| Dependency | Current Version | Latest Version | Status     | Notes                       |
| ---------- | --------------- | -------------- | ---------- | --------------------------- |
| express    | 4.17.1          | 4.21.2         | Active     | Minor upgrade needed        |
| moment     | 2.29.1          | 2.30.1         | Deprecated | Replace with dayjs/date-fns |

````
### 1.3 — Mapeamento de responsabilidades do módulo

Para cada diretório/módulo na base de código:

1. Leia os principais arquivos (ponto de entrada, índice, exportações de barril).
2. Identifique a **responsabilidade única** do módulo em uma frase.
3. Liste suas **importações internas** (de quais outros módulos ela depende?).
4. Liste suas **exportações** (o que ele expõe a outros módulos?).
5. Identifique **chamadas de serviço externo** (clientes HTTP, consultas de banco de dados, filas de mensagens, gRPC, etc.).

NÃO resuma ou parafraseie o código. Faça referência a ele: "O módulo `src/orders/` (consulte `src/orders/index.ts:1-45`) lida com a criação de pedidos e delega o pagamento para `src/payments/` (importação em `src/orders/service.ts:3`)."

### 1.4 — Análise de banco de dados e camada de dados

Identifique toda a persistência de dados:

- **Conexões de banco de dados** — Strings de conexão, configurações ORM, arquivos de migração.
- **Definições de esquema** — Modelos, entidades, arquivos de migração. Mapeie cada tabela/coleção e seus relacionamentos.
- **Bancos de dados compartilhados** — Vários módulos acessando as mesmas tabelas são um ponto de acoplamento crítico. Sinalize cada instância com `file:line`.
- **Fluxo de dados** — Onde os dados são gravados? Onde é lido? Existem réplicas de leitura, caches ou armazenamentos derivados?

## Etapa 2: Mapeamento de domínio/contexto limitado

Carregue `references/assessment-framework.md` para a metodologia de pontuação.

### 2.1 — Identificação do Candidato

Com base no mapeamento do módulo da Etapa 1, agrupe os módulos em contextos limitados candidatos. Um contexto limitado é um grupo de módulos que:

- Compartilhe um domínio comercial comum (por exemplo, "Pedidos", "Pagamentos", "Gerenciamento de usuários")
- Têm elevada coesão interna (muitas importações entre si)
- Possuem baixo acoplamento externo (poucas importações de outros grupos)

### 2.2 — Análise de Acoplamento

Para cada domínio candidato, calcule:

- **Dependências internas** — Número de importações entre módulos dentro deste domínio.
- **Dependências externas** — Número de importações de módulos fora deste domínio.
- **Tabelas de banco de dados compartilhadas** — Tabelas acessadas por este domínio E por outros domínios.
- **Taxa de acoplamento** — `external_deps / (internal_deps + external_deps)`. Menor é melhor. Acima de 0,5 significa que o limite do domínio está errado.

### 2.3 — Relatório de candidato a domínio

Formato de saída para `domain-candidates.md`:```markdown
## Domain: {Name}

**Modules**: `src/orders/`, `src/order-items/`, `src/order-history/`
**Responsibility**: Handles order lifecycle from creation to fulfillment.
**Internal cohesion**: 12 internal imports
**External coupling**: 3 external imports (payments, inventory, notifications)
**Shared tables**: `orders`, `order_items` (also accessed by `src/reports/` at `src/reports/monthly.ts:45`)
**Coupling ratio**: 0.20 (good)
**Migration complexity**: Medium — shared table access from reports needs facade.
````

## Etapa 3: pesquisa de pilha

Esta etapa é OBRIGATÓRIA. Nunca pule isso. Nunca confie apenas em dados de treinamento.

### 3.1 — Pesquisa de pilha atual

Para cada tecnologia identificada no inventário de dependências:

1. **Pesquisa na Web** o nome da tecnologia + "documentação" + ano atual.
2. **Context7** (se disponível): resolva o ID da biblioteca e consulte guias de migração, avisos de suspensão de uso e caminhos de atualização.
3. Documento: versão atual em uso, versão estável mais recente, status do LTS, datas de fim de vida útil, caminhos de migração conhecidos.

### 3.2 — Target Stack Research (se aplicável)

Se a migração envolver uma nova pilha (por exemplo, Python para NestJS, jQuery para React):

1. **Pesquisa na Web** para guias oficiais de migração entre as duas pilhas.
2. **Context7**: consulte a documentação da estrutura de destino para obter informações básicas, padrões de arquitetura e práticas recomendadas.
3. **Pesquisa na Web** sobre experiências de migração comunitária (postagens em blogs, palestras em conferências, estudos de caso).
4. Documento: recomendação da versão da pilha alvo (com justificativa), diferenças arquitetônicas, lacunas de paridade de recursos e considerações sobre a curva de aprendizado.

### 3.3 — Matriz de Compatibilidade

Formato de saída para `stack-research.md`:```markdown

## Current Stack

| Technology | Version in Use | Latest Stable | EOL Date | Source                     |
| ---------- | -------------- | ------------- | -------- | -------------------------- |
| Node.js    | 16.x           | 22.x LTS      | 2023-09  | [nodejs.org/releases](url) |

## Target Stack (if applicable)

| Technology | Recommended Version | Justification           | Source                 |
| ---------- | ------------------- | ----------------------- | ---------------------- |
| NestJS     | 10.x                | Latest stable, TS-first | [docs.nestjs.com](url) |

## Migration Guides Found

- [Official NestJS migration from Express](url) — covers middleware, guards, pipes
- [Community: Django to NestJS lessons learned](url) — data layer considerations

````
## Etapa 4: Mapeamento de riscos e dependências

Carregue `references/assessment-framework.md` para a metodologia da matriz de risco.

### 4.1 — Catálogo de Pontos de Integração

Para cada integração externa (APIs, bancos de dados, filas de mensagens, serviços de terceiros):

1. Identifique o ponto de integração com `file:line`.
2. Documento: protocolo, método de autenticação, formato de dados, tratamento de erros.
3. Avalie: essa integração pode ser envolta em uma fachada? Existe um contrato/esquema?

### 4.2 — Detecção de Dependência Circular

Rastreie cadeias de importação em busca de ciclos: A importa B, B importa C, C importa A. Cada ciclo é um bloqueador crítico para extração de domínio. Documente cada ciclo com a cadeia de importação completa e referências `file:line`.

### 4.3 — Avaliação de Risco

Para cada risco identificado, documente em `risk-assessment.md`:```markdown
## Risk: {Description}

**Impact**: Critical | High | Medium | Low
**Probability**: High | Medium | Low
**Evidence**: {file:line or external reference}
**Mitigation**: {Specific strategy}
**Residual risk after mitigation**: {Assessment}
````

## Lista de verificação de conclusão de pesquisa

Antes de passar para a fase PLANEJAR, verifique TODOS os itens a seguir:

- [] Cada módulo na base de código foi lido e mapeado
- [] Todas as dependências foram verificadas em relação às versões atuais por meio de pesquisa na web
- [] Candidatos de contexto limitado são identificados com taxas de acoplamento
- [] A pilha atual é pesquisada com fontes verificadas e citadas
- [] A pilha de destino (se aplicável) é pesquisada com fontes verificadas e citadas
- [] Todos os pontos de integração são catalogados com referências `file:line`
- [] Dependências circulares são ide

notificado

- [] A avaliação de risco está completa com mitigações
- [] Todos os quatro arquivos de resultados de pesquisa são gravados em `./migration-plan/research/`
- [] Não existem declarações não verificadas em nenhum arquivo de saída
