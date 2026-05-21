---
name: modular-design-principles
description: >
  Orientação agnóstica de tecnologia para sistemas modulares: bounded contexts, fronteiras claras,
  composabilidade, isolamento de estado, contratos explícitos, contenção de falhas, fluxos de scaffolding,
  critérios de divisão/fusão, subunidades dentro de um contexto e sinais de revisão de conformidade. Use quando
  projetar ou revisar estrutura de módulos, fronteiras de serviço, layout de pacotes, dependências transversais,
  o usuário pergunta "como dividir isso?", "como modularizar?", avaliações de modularidade, acoplamento entre domínios,
  design de contexto novo (greenfield) ou discussões de arquitetura sem assumir framework,
  linguagem ou layout de repositório específicos. NÃO use para executar o pipeline completo de decomposição do repositório Patterns 1–5
  ou inventários por padrão (use modular-decomposition), roadmaps de extração faseados como entrega principal (use decomposition-planning-roadmap), ou
  estratégia ponta a ponta de migração legada (use legacy-migration-planner).
---

# Princípios de design modular

Use esta skill ao raciocinar sobre **estrutura e fronteiras** em qualquer base de código. Ela evita propositalmente nomes de framework, convenções de pastas e ferramentas — mapeie os princípios para sua stack localmente.

## O que carregar

| Tarefa                                                           | Onde                       |
| ---------------------------------------------------------------- | -------------------------- |
| Tabela de princípios + violações + fluxos (este arquivo)         | `SKILL.md`                 |
| Definição por princípio, regras para agentes, exemplos abstratos | `references/principles.md` |

---

## Modelo mental em camadas

- **Composition roots** (aplicações, hosts, runners): conectam módulos; mantenha a orquestração fina.
- **Módulos / bounded contexts**: unidades coesas de comportamento e propriedade de dados; cada uma deve ser compreensível e testável sozinha.
- **Shared kernels** (use com parcimônia): apenas conceitos estáveis e verdadeiramente transversais; evite virar um saco de “tudo que todo mundo precisa”.

Como você organiza fisicamente (monorepo, multirepo, pacotes, bibliotecas) é uma **escolha de entrega**, não a definição de modularidade. Os princípios abaixo continuam válidos.

---

## Os dez princípios

| #   | Princípio                    | Intenção                                                                                                                                                            |
| --- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Fronteiras bem definidas** | **Superfície pública** pequena e estável; o resto é interno. Consumidores dependem de contratos, não de internals.                                                  |
| 2   | **Composabilidade**          | Módulos podem ser usados sozinhos ou combinados sem conhecimento especial dos internals uns dos outros.                                                             |
| 3   | **Independência**            | Sem estado mutável compartilhado oculto através de fronteiras; cada módulo deve ser testável isolado (com fakes ou doubles nas bordas).                             |
| 4   | **Escala individual**        | Recursos (compute, armazenamento, rate limits, tamanho de batch) podem ser ajustados **por módulo** onde importa, sem reescrever os outros.                         |
| 5   | **Comunicação explícita**    | Interação entre módulos usa **contratos documentados** (APIs, eventos, mensagens, tipos compartilhados) — não acoplamento incidental.                               |
| 6   | **Substituibilidade**        | Dependências de outros módulos são expressas por **interfaces ou protocols** para que implementações possam mudar.                                                  |
| 7   | **Independência de deploy**  | Módulos não assumem processo, host ou cadência de release compartilhados salvo decisão arquitetural explícita.                                                      |
| 8   | **Isolamento de estado**     | Cada módulo **possui** seu estado persistente e nomenclatura; sem compartilhamento silencioso do mesmo datastore lógico ou nomes globais ambíguos entre fronteiras. |
| 9   | **Observabilidade**          | Cada módulo pode ser diagnosticado sozinho: logs, métricas, traces, health — atribuíveis à unidade que emitiu.                                                      |
| 10  | **Falha independente**       | Falhas são **contidas** (timeouts, bulkheads, circuit breaking, idempotência) para que a indisponibilidade de um módulo não propague em cascata cega.               |

O **princípio 8** costuma ser o mais difícil: propriedade ambígua de dados ou nomes é fonte frequente de bugs de integração do tipo “funciona até não funcionar”.

Para **profundidade** (regras para agentes + exemplos abstratos por princípio), carregue `references/principles.md`.

---

## Violações típicas (formuladas de modo abstrato)

1. **Conceitos colidentes** — mesmo nome ou schema para coisas diferentes em módulos diferentes, ou definições “globais” duplicadas que divergem com o tempo.
2. **Persistência reach-through** — um módulo lendo ou escrevendo tabelas, buckets ou documentos de outro **sem** passar por contrato acordado.
3. **Propriedade centralizada de dados** — uma única camada de persistência que registra e expõe **todos** os stores para **todos** os módulos, incentivando acoplamento oculto.
4. **Lógica na borda** — regras de negócio em adaptadores de transporte (handlers HTTP, UI, CLI) em vez de código de domínio/aplicação.
5. **Borda falando direto com storage** — adaptadores dependendo de APIs de persistência de baixo nível em vez de casos de uso ou application services.
6. **Transações sem dono** — escritas que atravessam fronteiras sem dono claro da transação e semântica de falha.
7. **Exports vazados** — repositórios, serviços internos ou tipos de implementação expostos como API pública do módulo.
8. **Fachadas que não são finas** — pontos de entrada “públicos” que embutem consulta, mapeamento ou política em vez de delegar à camada certa dentro do módulo.

---

## Criar um bounded context (fluxo)

Use ao introduzir uma área **nova** e coesa do sistema (módulo greenfield ou domínio extraído).

1. **Escopo e linguagem** — Nomeie o contexto; liste substantivos/verbos centrais (**ubiquitous language**). Rejeite nomes vagos que colidem com outros contextos.
2. **Responsabilidades** — Que decisões acontecem **somente** aqui? O que está explicitamente _fora_?
3. **Propriedade de estado** — Quais fatos são **autoritativos** neste contexto? Onde ficam armazenados conceitualmente (mesmo que a tecnologia ainda não esteja definida)?
4. **Contrato público** — Operações e/ou eventos que outros contextos podem usar. Evolua esse contrato de forma intencional.
5. **Integrações** — Para cada vizinho: chamada síncrona, mensagem assíncrona, read model compartilhado ou sync em batch? Documente **consistência** (imediata, eventual) e comportamento em **falha**.
6. **Invariantes e lifecycles** — O que deve ser sempre verdadeiro dentro desta fronteira? O que inicia/completa um lifecycle?
7. **Checagem de isolamento** — Você testa o comportamento central **sem** subir contextos não relacionados (fakes nas ports)?
8. **Observabilidade** — Como rastrear uma requisição ou job **neste** contexto com identificadores claros?

**Interação entre módulos** (durante o design): prefira o contrato **mínimo**; defina **timeouts**, **retries**, **idempotência** para fluxos assíncronos; evite atalho de acesso direto a store “temporário”.

---

## Quando dividir ou fundir

**Padrão:** **menos fronteiras** até aparecer dor real — “flat is often better” que fragmentação prematura. Dividir aumenta coordenação, versionamento e custo operacional.

### Teste dos seis critérios (favoreça divisão quando vários forem verdadeiros)

| #   | Critério             | Pergunta                                                                                                                   |
| --- | -------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Linguagem**        | As subáreas usam **vocabulários diferentes** ou definições conflitantes da mesma palavra?                                  |
| 2   | **Ritmo de mudança** | Partes mudam em **cadências diferentes** ou por motivos não relacionados (a maioria dos edits toca um lado)?               |
| 3   | **Escala / SLO**     | Partes precisam de **diferentes** vazão, latência ou disponibilidade?                                                      |
| 4   | **Consistência**     | Precisam de **fronteiras de transação diferentes** (não dá para compartilhar um modelo de escrita atômico de forma limpa)? |
| 5   | **Propriedade**      | **Times diferentes** ou linhas claras de propriedade reduziriam conflito e churn de review?                                |
| 6   | **Sinal de dor**     | Há dor de integração **observável**: efeito dominó, medo de mudar, dono do bug incerto?                                    |

**Coesão / acoplamento (qualitativo).** Favoreça **alta coesão** dentro do módulo e **baixo acoplamento explícito** entre módulos. Se a única motivação é “arquivo ficou grande” ou “estética de pasta”, **fundir ou esperar**.

### Quando fundir ou ainda não dividir

- Fronteiras são **artificiais** (mesma linguagem, mesmo lifecycle, chamadas cruzadas constantes).
- Dividir **duplicaria** lógica ou dados sem regra clara de **single writer**.
- O time não está pronto para **possuir** contratos, versionamento e ops de unidades extras.

### Prompts de decisão (curtos)

- A separação **reduziria** acoplamento acidental mais do que **aumentaria** custo de coordenação?
- Existe uma fronteira natural de **ubiquitous language**, ou só um corte técnico?

---

## Subunidades dentro de um bounded context

Às vezes uma fronteira externa está certa, mas dentro há **subáreas nomeadas** (subdomínios, áreas de feature). Os princípios continuam válidos **dentro** do contexto.

**Propriedade**

- Cada subunidade deve **possuir** sua fatia de modelo e preocupações de persistência quando possível — evite um mega registration layer que conecte **todo** store e repositório de **toda** subunidade num só lugar (incentiva reach-through e acoplamento oculto).

**Acesso entre subunidades**

- Prefira **application APIs internas** ou **fachadas internas finas** (mesmo contexto, superfície explícita) a peers importando tipos de storage uns dos outros diretamente.
- Em fluxos assíncronos, prefira **payloads enriquecidos** para que handlers não **conversem** entre subunidades por dado que poderia viajar com o evento/comando.

**Shared kernel dentro do contexto**

- Tipos ou enums compartilhados pequenos e estáveis podem morar numa **área compartilhada estreita** — mas resista a um “utils” em crescimento que vire o verdadeiro ponto de acoplamento.

**Anti-pattern:** Um submódulo único de “persistência” ou “dados” que é o **único** lugar que conhece todas as tabelas/documentos de todas as subunidades, e todos os outros atravessam — os mesmos problemas de reach-through entre contextos, **dentro** da fronteira.

---

## Passagem de conformidade arquitetural

Use em **reviews** ou **auditorias** sem assumir ferramentas. Trate itens como **sinais**, não prova — confirme com especialistas de domínio.

### Sinais de dependência e API

- **Inbound vs outbound:** Dependências devem alinhar à arquitetura escolhida (ex.: domínio no centro, adaptadores fora). **Vazamentos para dentro** de tipos de infra na lógica central são smell.
- **Superfície pública:** Você lista operações/eventos/tipos **exportados** sem incluir storage ou serviços internos? Se não, há vazamento.
- **Imports de vizinho:** Tipos ou clientes do **módulo A** usados no **módulo B** — são só tipos de **contrato**, ou tipos de persistência/implementação?

### Sinais de persistência e dados

- **Reach-through:** Referências aos dados **físicos** de outro contexto (schema, coleção, nome de bucket) fora de contrato acordado.
- **Colisões de nome:** Mesmo nome lógico para coisas diferentes, ou IDs globais compartilhados sem regra de mapeamento documentada.
- **Dono da transação:** Escritas que atravessam contextos sem **saga**, **outbox** ou regra de **single-owner** documentada e casos de falha.

### Sinais operacionais

- **Blame:** Incidentes em que “não sabemos qual módulo possui esta linha/comportamento” → lacuna de propriedade ou observabilidade.
- **Cascatas:** Lentidão ou falha de uma dependência derruba jornadas não relacionadas → faltam **timeouts**, **bulkheads** ou caminhos de **degradação**.

### Heurística de severidade (para relatório)

| Camada | Significado                                                                                                  |
| ------ | ------------------------------------------------------------------------------------------------------------ |
| **P0** | Risco de corrupção de dados, violação de fronteira de segurança ou persistência entre contextos sem contrato |
| **P1** | Propriedade pouco clara, API pública vazada, semântica de falha ausente nas fronteiras                       |
| **P2** | Lacunas de observabilidade, cheiros de composabilidade, dívida técnica que aumenta acoplamento futuro        |

**Nota de maturidade:** Pontuação é **qualitativa** salvo portões numéricos definidos pelo time. Use tendências: menos P0/P1 ao longo do tempo, contratos mais claros.

---

## Checklist rápido (antes de propor estrutura)

- [ ] API pública é mínima; internals não são exportados casualmente.
- [ ] Nomes e propriedade de armazenamento são inequívocos por módulo.
- [ ] Sem atalhos de persistência entre módulos sem contrato explícito.
- [ ] Regras de negócio ficam atrás de uma camada clara de aplicação/domínio, não só em adaptadores.
- [ ] Chamadas entre módulos têm comportamento explícito de falha e timeout.
- [ ] Observabilidade responde “qual módulo falhou e por quê?” sem garimpo.
- [ ] Se o contexto tem subunidades: cada uma tem propriedade clara; sem saco único de persistência que “registra tudo”.

---

## Relação com skills específicas de stack

Quando o projeto tem **convenções concretas** (módulos de framework, DI, padrões de repositório, layout de pastas, codegen, checagens de CI), prefira esses documentos para o **como** implementar. Use **esta** skill para o **porquê** das fronteiras existirem e **o que** um bom design modular otimiza — assim o conselho específico de stack permanece alinhado aos mesmos princípios.
