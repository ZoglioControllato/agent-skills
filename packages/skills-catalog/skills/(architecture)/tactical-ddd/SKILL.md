---
name: tactical-ddd
description: Detecta modelos de domínio anêmicos, valida e refatora para modelos ricos e reforça padrões táticos de DDD (Entidades, Objetos de Valor, Agregados, Serviços de Domínio, Eventos de Domínio). Use quando o usuário pedir para validar, revisar ou verificar modelos de domínio ou código DDD; detectar anemia; refatorar objetos de domínio; melhorar encapsulamento; ou citar termos como "anemic model", "rich domain", "aggregate", "value object", "domain event", "ubiquitous language", "is this good DDD", "does this follow DDD" ou "check my domain". NÃO use para desenho de fronteiras de módulos ou serviços, decomposição arquitetural, strategic DDD context mapping ou código fora da camada de domínio (DTOs, controllers, adaptadores de infraestrutura).
---

# DDD tático — modelagem rica de domínio

## Fluxo de trabalho

Determine primeiro a intenção do usuário:

| Intenção                                       | Fases a executar                                                         |
| ---------------------------------------------- | ------------------------------------------------------------------------ |
| "validar / revisar / conferir / está correto?" | Somente fases 1 + 2 → relatório dos achados; pergunte antes de refatorar |
| "corrigir / refatorar / melhorar / limpar"     | Fases 1 + 2 + 3                                                          |
| "como devo desenhar / modelar isto?"           | Carregue [reference.md](reference.md) diretamente                        |

### Fase 1 — Detectar

Carregue [detection.md](detection.md) e varra o código alvo por sinais de anemia. Produza pontuação de severidade e lista de classes afetadas.

### Fase 2 — Avaliar

Para cada classe afetada, determine o building block correto:

| Tem identidade única ao longo do tempo?                     | Tem invariantes ligando vários objetos? | → Building Block   |
| ----------------------------------------------------------- | --------------------------------------- | ------------------ |
| Sim                                                         | —                                       | **Entity**         |
| Não                                                         | —                                       | **Value Object**   |
| Sim (raiz) + filhos com invariantes compartilhadas          | Sim                                     | **Aggregate**      |
| Operação atravessa vários Agregados / não pertence a nenhum | —                                       | **Domain Service** |

Prefira Objetos de Valor a Entidades. Prefira Agregados pequenos a grandes.

**Se a intenção era validar/revisar**: pare aqui. Relate achados usando o formato de saída abaixo. Pergunte se deseja aplicar as correções antes de seguir.

### Fase 3 — Refatorar

Carregue [refactoring.md](refactoring.md) para os passos. Aplique nesta ordem:

1. Substituir cadeias de setters por um único método expressivo
2. Mover lógica de serviço para o Agregado que a possui
3. Adicionar guardas de negócio no topo de cada método
4. Publicar um Domain Event após cada mudança de estado bem-sucedida
5. Substituir tipos primitivos por Objetos de Valor

Para dúvidas profundas de padrão (desenho de fronteira, modelagem de eventos, decisão serviço vs. entidade), carregue [reference.md](reference.md).

---

## Sinais rápidos de anemia (varrer primeiro)

```
public setX() / public setY()        → comportamento deve ser encapsulado
service.doX(entity, ...)              → lógica provavelmente pertence à entidade
entity.setA(); entity.setB(); ...     → cadeia de setters = método de intenção ausente
sem métodos de domínio além de getters → saco de dados puro
```

---

## Regras de ouro

1. **Comportamento com dados** — Objetos possuem estado e as operações que o alteram
2. **Ubiquitous Language** — Nomes de métodos vêm do domínio, não de CRUD (`commitTo`, não `setStatus`)
3. **Agregados pequenos** — Raiz + Objetos de Valor por padrão; filhos Entity só para invariantes reais
4. **Uma transação = um Agregado** — Regras entre Agregados usam eventual consistency via Domain Events
5. **Referenciar por ID** — Nunca manter referências a outros Agregados
6. **Objetos de Valor primeiro** — Entity só quando identidade individual for essencial
7. **Domain Services com parcimônia** — Serviços em excesso → modelo anêmico
8. **Proteger invariantes** — O Agregado é a última linha de defesa; nunca confiar no chamador

---

## Formato de saída

Ao revisar código, relate:

```
## Diagnóstico de anemia: <ClassName>

Severidade: [Nenhuma | Leve | Moderada | Grave]

Problemas:
- <descrição do problema>

Refatoração recomendada:
- <ação específica de refactoring.md>
```

Ao refatorar, mostre um diff antes/depois para cada classe tocada.
