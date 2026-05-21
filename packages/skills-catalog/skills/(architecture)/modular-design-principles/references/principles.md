# Princípios em profundidade

Uma seção por princípio: **definição**, **regras para agentes**, **exemplo abstrato**. Nenhuma suposição de pilha ou pasta.

---

## 1 — Limites bem definidos

**Definição.** Os consumidores dependem de uma **superfície pública pequena e intencional** (operações, eventos, tipos que fazem parte do contrato). Todo o resto são detalhes de implementação.

**Regras para agentes.**

- Prefira estender o comportamento adicionando à API **documentada** em vez de importar componentes internos.
- Ao sugerir refatoradores, preserve ou reduza a superfície pública; não o amplie “por conveniência”.
- Nomeie as coisas de forma que **contrato versus interno** seja óbvio nas revisões (por exemplo, “operação pública” versus “ajudante interno” é uma distinção conceitual mesmo sem ferramentas).

**Exemplo abstrato.** Um contexto “Checkout” expõe os eventos `placeOrder(command)` e `OrderPlaced`. Outros contextos não devem chegar às tabelas internas de preços do Checkout; eles assinam eventos ou chamam `placeOrder`, não “atualizam a linha X”.

---

## 2 — Composição

**Definição.** Os módulos podem ser **montados em diferentes produtos ou implantações** sem reescrever sua lógica principal para cada combinação.

**Regras para agentes.**

- Evite suposições ocultas como “isso só é executado quando o módulo B está presente”, a menos que expressado como um contrato de **integração opcional** ou de **plugin**.
- Os sinalizadores de configuração e recursos não devem se tornar um espaguete que apenas uma implantação entende.

**Exemplo abstrato.** O mesmo módulo “Inventário” funciona em uma ferramenta CLI pequena e em um aplicativo web grande porque seu contrato não pressupõe uma UI ou host específico – apenas a raiz da composição muda.

---

## 3 - Independência

**Definição.** Os módulos não dependem de **estado mutável compartilhado oculto** entre limites. Os testes podem executar um módulo com **falsificações** nas bordas.

**Regras para agentes.**

- Sinalize “singletons globais” que codificam políticas entre módulos sem um contrato explícito.
- Prefira **passar dependências explicitamente** ou **injeção declarada** em vez de ambientes globais para questões transversais.

**Exemplo abstrato.** Dois serviços em módulos diferentes alteram um cache de todo o processo codificado por “id do usuário” sem coordenação → a independência é violada; substitua por uma interface de cache explícita pertencente a um módulo ou a um serviço compartilhado documentado.

---

## 4 — Escala individual

**Definição.** **A taxa de transferência, o armazenamento, os lotes e os limites** podem ser ajustados por módulo quando necessário, sem forçar uma configuração global para todos.

**Regras para agentes.**

- Ao ajustar o desempenho, pergunte **qual contexto limitado** possui o gargalo; evite “consertar” acoplando caminhos de código não relacionados.
- Sugira cotas, pools ou tamanhos de lote **por módulo** quando os perfis de carga forem diferentes.

**Exemplo abstrato.** “Pesquisa” precisa de uma grande réplica de leitura e cache agressivo; “Faturamento” precisa de gravações seriais estritas. As políticas de escalabilidade não são idênticas e nenhum dos módulos força as configurações do outro.

---

## 5 — Explicit communication

**Definição.** Toda interação **entre módulos** passa por **contratos conhecidos**: APIs, mensagens, eventos ou esquemas versionados, e não por arquivos compartilhados incidentais ou canais secundários implícitos.

**Regras para agentes.**

- Documente **entradas, saídas, erros e controle de versão** para qualquer coisa que ultrapasse um limite.
- Desencoraje “basta importar este DTO do pacote” quando esse DTO for realmente uma forma de persistência **interna**.

**Exemplo abstrato.** O Módulo A notifica o Módulo B via `OrderPlaced { orderId, placeAt }` em um barramento, não escrevendo no banco de dados de B “porque é mais rápido”.

---

## 6 - Substituibilidade

**Definição.** As dependências de outros módulos são expressas em termos de **interfaces, protocolos ou contratos estáveis** para que as implementações possam ser trocadas ou simuladas.

**Regras para agentes.**

- Nos limites, prefira **interfaces estreitas** (“gateway de pagamento”, “relógio”, “gerador de id”) em vez de tipos concretos de fornecedores que vazam para dentro.
- Refatoradores que **fixam** um módulo a uma tecnologia em todos os lugares devem ser questionados, a menos que seja uma escolha deliberada de plataforma.

**Exemplo abstrato.** “Notificações” depende de `Notifier` com `send(recipient, body)`; email vs SMS vs push é substituível por trás dessa porta.

---

## 7 — Independência de implantação

**Definição.** O código do módulo não **assume** a co-localização no mesmo processo ou versão, a menos que seja uma decisão arquitetônica **explícita**.

**Regras para agentes.**

- Evite “chamar esta função diretamente no pacote” como a única história de integração quando múltiplas implantações são possíveis.
- Prefira contratos que funcionem em entrega **em processo, fora de processo ou assíncrona** com alterações mínimas.

**Exemplo abstrato.** A mesma lógica de domínio pode ser executada em um monólito hoje e atrás de uma fila de mensagens amanhã porque as interações foram modeladas como operações/eventos, e não como singletons codificados no processo.

---

## 8 — Isolamento do Estado

**Definição.** Cada módulo **possui** seu armazenamento oficial e nomenclatura para seus fatos. Não há compartilhamento silencioso dos mesmos dados lógicos entre fronteiras sem uma **regra clara** (quem escreve, quem lê, como a consistência é alcançada).

**Regras para agentes.**

- Trate a **persistência de alcance** (ler/escrever diretamente no armazenamento de outro módulo) como um **cheiro de design**, a menos que documentado como um padrão excepcional e revisado.
- Exigir **nomes inequívocos** para conceitos persistentes quando vários módulos tiverem substantivos semelhantes.

**Exemplo abstrato.** “Cliente” no CRM e “Cliente” no Faturamento são agregados diferentes com IDs diferentes ou mapeamento explícito – e não dois módulos atualizando uma linha "clientes" ambígua.

---

## 9 - Observabilidade

**Definição.** Logs, métricas, rastreamentos e verificações de integridade podem ser **atribuídos** a um módulo (e geralmente a um caso de uso) para que os incidentes sejam diagnosticáveis sem a leitura de todo o sistema.

**Regras para agentes.**

- Ao adicionar diagnósticos, inclua **contexto** (qual operação, qual ID de correlação), não apenas “erro ocorrido”.
- Evite linhas de log que **não** possam ser filtradas pela equipe ou subsistema proprietário.

**Exemplo abstrato.** Um pagamento com falha mostra o intervalo `billing.capture` com `orderId` e código de erro limpo; o suporte não faz grep no ruído de módulos não relacionados para encontrar a causa raiz.

---

## 10 - Falha na independência

**Definição.** As falhas são **limitadas**: tempos limite, novas tentativas com espera, anteparos, interrupção de circuito, idempotência — para que a interrupção de um módulo não **cautele cegamente**.

**Regras para agentes.**

- Chamadas entre módulos devem ter tempo limite **explícito** e semântica de falha; “pendurar para sempre” é um bug de design no limite.
- Os manipuladores assíncronos devem ser **idempotentes** ou desduplicados onde duplicatas são possíveis.

**Exemplo abstrato.** Quando o Recommendations está inativo, o Checkout ainda é concluído usando padrões ou uma camada em cache; a IU degrada em vez de bloquear a compra.
