# Criação de roteiro

**Acionador:** "Criar roteiro", "Planejar recursos", "Mapear fases do projeto"

## Processo

Com base em PROJECT.md, decomponha a visão em:

- Marcos (incrementos entregáveis)
- Recursos (capacidades voltadas para o usuário)
- Acompanhamento de status (planejado/em andamento/concluído)

## Saída: .specs/project/ROADMAP.md

**Estrutura:**

```markdown
# Roadmap

**Current Milestone:** [milestone name]
**Status:** Planning | In Progress | Complete

---

## [Milestone 1 Name]

**Goal:** [What makes this milestone shippable]
**Target:** [Date or completion criteria]

### Features

**[Feature Name]** - STATUS

- [Capability 1]
- [Capability 2]
- [Capability 3]

**[Feature Name]** - STATUS

- [Capability 1]
- [Capability 2]

---

## [Milestone 2 Name]

**Goal:** [What this milestone adds]

### Features

**[Feature Name]** - PLANNED
**[Feature Name]** - PLANNED

---

## Future Considerations

- [Potential future capability]
- [Potential future capability]
```

**Valores de status:**

- PLANEJADO: Não iniciado
- EM ANDAMENTO: Atualmente em implementação
- COMPLETO: Enviado e verificado

**Limite de tamanho:** 3.000 tokens (aproximadamente 1.800 palavras)

**Estratégia de atualização:**

- Marcar recursos PLANEJADOS → EM ANDAMENTO ao iniciar
- Marque EM ANDAMENTO → CONCLUÍDO quando verificado
- Adicione novos marcos à medida que o projeto evolui

**Validação:**

- Cada marco tem um resultado claro e entregável?
- Os recursos são recursos voltados para o usuário?
- O status reflete a realidade atual?
