# Fase: Preocupações com a base de código

**Acionador:** Parte do mapeamento brownfield ou explicitamente "documentar preocupações", "encontrar dívida tecnológica", "o que é arriscado nesta base de código"

**Objetivo:** Apresentar avisos acionáveis sobre a base de código. Focado em "o que observar ao fazer alterações". Esta é uma documentação viva, não uma lista de reclamações.

## Quando gerar

CONCERNS.md é gerado como parte do fluxo de mapeamento brownfield (juntamente com STACK.md, ARCHITECTURE.md, etc.). Também pode ser criado ou atualizado de forma independente quando:

- Explorar uma nova área da base de código revela riscos
- Uma investigação de bug revela problemas sistêmicos
- A implementação de um recurso atinge uma fragilidade inesperada
- Uma auditoria de dependência revela riscos

## Processo

### 1. Reúna evidências

Durante a exploração da base de código, procure sinais concretos – não opiniões. Fontes de evidências:

- Padrões de código que indicam atalhos (comentários TODO/FIXME/HACK, lógica duplicada, falta de tratamento de erros)
- Lacunas de cobertura de teste (caminhos críticos não testados, casos extremos ausentes)
- Manifestos de dependência (pacotes desatualizados, bibliotecas obsoletas, avisos de segurança)
- Indicadores de desempenho (consultas N+1, índices ausentes, bloqueio síncrono de chamadas)
- Padrões de segurança (verificações de autenticação somente do lado do cliente, entradas não validadas, segredos expostos)

### 2. Classificar e documentar

Cada preocupação deve ter: **qual** é o problema, **onde** ele reside (caminhos de arquivo), **por que** é importante (impacto) e **como** corrigi-lo (abordagem).

### 3. Priorizar por risco

Concentre-se nas preocupações que podem causar danos reais – perda de dados, violações de segurança, falhas enfrentadas pelo usuário, escalada de muros. Problemas menores de estilo e TODOs normais não pertencem aqui.

---

## Modelo: `.specs/codebase/CONCERNS.md`

**Limite de tamanho:** 5.000 tokens (aproximadamente 3.000 palavras)```markdown

# Codebase Concerns

**Analysis Date:** [YYYY-MM-DD]

## Tech Debt

**[Area/Component]:**

- Issue: [What's the shortcut/workaround]
- Files: [Specific file paths with backticks]
- Why: [Why it was done this way]
- Impact: [What breaks or degrades because of it]
- Fix approach: [How to properly address it]

## Known Bugs

**[Bug description]:**

- Symptoms: [What happens]
- Trigger: [How to reproduce]
- Files: [Where the bug lives]
- Workaround: [Temporary mitigation if any]
- Root cause: [If known]
- Blocked by: [If waiting on something]

## Security Considerations

**[Area requiring security care]:**

- Risk: [What could go wrong]
- Files: [Where the risk lives]
- Current mitigation: [What's in place now]
- Recommendations: [What should be added]

## Performance Bottlenecks

**[Slow operation/endpoint]:**

- Problem: [What's slow]
- Files: [Where the bottleneck lives]
- Measurement: [Actual numbers: "500ms p95", "2s load time"]
- Cause: [Why it's slow]
- Improvement path: [How to speed it up]

## Fragile Areas

**[Component/Module]:**

- Files: [Where the fragility lives]
- Why fragile: [What makes it break easily]
- Common failures: [What typically goes wrong]
- Safe modification: [How to change it without breaking]
- Test coverage: [Is it tested? Gaps?]

## Scaling Limits

**[Resource/System]:**

- Current capacity: [Numbers: "100 req/sec", "10k users"]
- Limit: [Where it breaks]
- Symptoms at limit: [What happens]
- Scaling path: [How to increase capacity]

## Dependencies at Risk

**[Package/Service]:**

- Risk: [e.g., "deprecated", "unmaintained", "breaking changes coming"]
- Impact: [What breaks if it fails]
- Migration plan: [Alternative or upgrade path]

## Missing Critical Features

**[Feature gap]:**

- Problem: [What's missing]
- Current workaround: [How users cope]
- Blocks: [What can't be done without it]
- Implementation complexity: [Rough effort estimate]

## Test Coverage Gaps

**[Untested area]:**

- What's not tested: [Specific functionality]
- Risk: [What could break unnoticed]
- Priority: [High/Medium/Low]
- Difficulty to test: [Why it's not tested yet]

---

_Concerns audit: [date]_
_Update as issues are fixed or new ones discovered_

```

**Inclua apenas seções que contenham descobertas.** Seções vazias devem ser totalmente omitidas.

---

## O que pertence versus o que não pertence

**Incluir:**

- Dívida tecnológica com impacto claro e abordagem de correção
- Bugs conhecidos com etapas de reprodução
- Lacunas de segurança e recomendações de mitigação
- Gargalos de desempenho com medições
- Código frágil que quebra facilmente
- Limites de escala com números
- Dependências que precisam de atenção
- Recursos ausentes que bloqueiam fluxos de trabalho
- Lacunas de cobertura de teste

**Excluir:**

- Opiniões sem evidências (“o código é confuso”)
- Reclamações sem soluções ("auth é uma merda")
- Ideias de recursos futuros (para planejamento de produtos)
- TODOs normais (aqueles que vivem em comentários de código)
- Decisões arquitetônicas que estão funcionando bem
- Pequenos problemas de estilo de código

---

## Diretrizes para redação

- **Sempre inclua caminhos de arquivo** — Preocupações sem locais não são acionáveis. Use crases: `src/file.ts`
- Seja específico com medições ("500ms p95" não "lento")
- Inclui etapas de reprodução de bugs
- Sugira abordagens de correção, não apenas problemas
- Concentre-se em itens acionáveis
- Priorizar por risco/impacto

**Tom:** Profissional, não emocional. Orientado para soluções. Focado no risco. Fato.

- ✅ "Padrão de consulta N+1 em `app/api/courses/route.ts` — 1,2s p95 com mais de 50 cursos"
- ❌ "Consultas terríveis, tudo lento"
- ✅ "Correção: adicionar índice em `user_id` na tabela `subscriptions`"
- ❌ "Precisa de conserto"

---

## Como CONCERNS.md é usado

- **Planejamento de recursos:** Verifique CONCERNS.md antes de projetar recursos que afetem áreas sinalizadas
- **Estimativa de risco:** use áreas frágeis e limites de escala para estimar o risco de mudança
- **Integração de novas sessões:** Carregue CONCERNS.md para fornecer contexto sobre o que observar
- **Priorização de refatoração:** Use dívidas tecnológicas e teste lacunas de cobertura para planejar sprints de melhoria
- **Fase de implementação:** Consulte antes de modificar qualquer componente sinalizado

Esta é uma documentação viva. Atualize à medida que os problemas são corrigidos ou novos são descobertos durante qualquer fase do fluxo de trabalho.
```
