# Lista de verificação de qualidade

Use esta lista de verificação no final da fase de Validação para garantir que a habilidade
atende a todos os critérios de qualidade antes da entrega.

---

## Verificações estruturais (aprovado/reprovado)

Esses são requisitos difíceis. Qualquer falha deve ser corrigida.

- [] SKILL.md existe com maiúsculas e minúsculas exatas
- [] O frontmatter YAML possui delimitadores `---` de abertura e fechamento
- [ ] campo `name` está presente e kebab-case
- [ ] `name` corresponde ao nome da pasta
- [ ] campo `descrição` está presente
- [ ] `descrição` tem menos de 1024 caracteres
- [ ] `description` não contém colchetes angulares XML (< >)
- [ ] `name` não contém "claude" ou "antrópico"
- [] Não README.md dentro da pasta de habilidades
- [] O nome da pasta é kebab-c

ase (sem espaços, sem letras maiúsculas, sem sublinhados)

## Descrição Qualidade (pontuação 1-5)

Avalie cada um e segmente 4+ em todos:

- [ ] **Especificidade (1-5):** Descreve uma capacidade concreta?
- [ ] **Clareza do gatilho (1-5):** O agente saberia quando carregar isso?
- [ ] **Idioma do usuário (1-5):** Ele usa frases que um usuário realmente diria?
- [ ] **Limites do escopo (1-5):** Está claro o que esta habilidade NÃO faz?
- [ ] **Agressividade (1-5):** É assertivo o suficiente para evitar o undertriggering?

## Qualidade da instrução (pontuação 1-5)

- [ ] **Acionabilidade (1-5):** O agente consegue seguir cada passo sem ambiguidade?
- [ ] **Especificidade (1-5):** As instruções são concretas (não "validam corretamente")?
- [ ] **Exemplos (1-5):** Existem exemplos realistas de entrada/saída?
- [ ] **Tratamento de erros (1-5):** As falhas comuns são abordadas?
- [ ] **Divulgação progressiva (1-5):** O SKILL.md é focado, com detalhes nas referências?
- [ ] **Combinabilidade (1-5):** Funciona bem com outras habilidades?

## Teste de gatilho

### Deve ser acionado (teste de 3 a 5 frases)

1. [] "[Solicitação óbvia]" → gatilhos? S/N
2. [] "[Solicitação parafraseada]" → gatilhos? S/N
3. [] "[Solicitação informal]" → gatilhos? S/N

### NÃO deve ser acionado (teste de 3 a 5 frases)

1. [ ] "[Tarefa não relacionada]" → permanece em silêncio? S/N
2. [ ] "[Escopo semelhante, mas diferente]" → permanece em silêncio? S/N
3. [ ] "[Pergunta genérica]" → permanece em silêncio? S/N

## Metas de desempenho

Benchmarks aspiracionais (adaptar-se à sua habilidade):

- [] Aciona em ≥90% das consultas relevantes
- [] Conclui o fluxo de trabalho sem correção do usuário
- [] Resultados consistentes em sessões separadas
- [] Nenhuma chamada de ferramenta/API com falha por fluxo de trabalho
- [] Os usuários não precisam avisar o agente sobre as próximas etapas

## Aprovação final

- [] O usuário revisou a habilidade
- [] Frases de teste produzem o comportamento esperado
- [] A habilidade está empacotada e pronta para upload
