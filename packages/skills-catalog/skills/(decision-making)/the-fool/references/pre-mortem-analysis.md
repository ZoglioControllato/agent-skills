# Análise Pré-Mortem

Metodologia pre-mortem (Gary Klein) com pensamento de segunda ordem para identificar como os planos falham antes de falharem.

## Princípio Fundamental

Uma pré-morte inverte a questão. Em vez de "Isso funcionará?" pergunte: **"Faltam 6 meses e isso falhou. Por quê?"** Essa mudança psicológica contorna o viés do otimismo, fazendo do fracasso o ponto de partida, e não a coisa contra a qual se deve argumentar.

A pesquisa mostra que a retrospectiva prospectiva aumenta a identificação correta de falhas em 30% em comparação com perguntar "o que pode dar errado?" diretamente.

## Processo

1. **Defina o cenário** - "Imagine que é [prazo] a partir de agora. Este plano falhou. Não é um pequeno revés - um claro fracasso."
2. **Gerar narrativas de fracasso** — Escreva histórias específicas sobre como ele falhou (primeiro a geração individual silenciosa, depois a presente)
3. **Classificação por probabilidade e impacto** — Nem todas as falhas são iguais
4. **Traçar cadeias de consequências** - Efeitos de primeira → segunda → terceira ordem
5. **Identifique os primeiros sinais de alerta** — O que você veria antes

O fracasso se materializa? 6. **Aplique a técnica de inversão** — "O que garantiria que isso falharia?" Em seguida, verifique se existe alguma condição 7. **Mitigações de projeto** — Ações concretas, não vagas "tenha cuidado"

## Fracasso na Construção Narrativa

As narrativas de fracasso devem ser específicas. “Não cresceu” não é uma narrativa. “Com 50 mil usuários simultâneos, o pool de conexões de banco de dados se esgotou, causando tempos limite em cascata em todos os serviços, o que acionou o disjuntor para rejeitar todas as solicitações por 4 minutos durante os horários de pico” é uma narrativa.

### Lista de verificação de especificidade

Cada narrativa deve passar em todas as 5 verificações:

- [] Nomeia um gatilho específico (não "algo dá errado")
- [] Inclui um número ou limite
- [] Descreve a cadeia de eventos, não apenas o estado final
- [] Identifica quem ou o que é afetado
- [] Poderia realmente acontecer (não é um cenário de fantasia)

### Modelo de narrativa de falha```markdown

**Failure: [Title]**

It's [timeframe] from now. [Specific trigger event]. This caused [first-order effect],
which led to [second-order effect]. The team discovered the problem when [detection point],
but by then [consequence]. The root cause was [underlying assumption that proved wrong].

````
### Exemplo```markdown
**Failure: Migration Data Loss**

It's 3 months from now. During the database migration from PostgreSQL to the new schema,
a batch job silently drops records where the `legacy_id` field contains special characters
(~2% of records). The team discovers the problem 2 weeks post-migration when a customer
reports missing order history. By then, the legacy database has been decommissioned and
backups have rotated past the migration date. The root cause was that the migration script
was tested against a sanitized staging dataset that didn't include special characters.
````

## Cadeias de consequências de segunda ordem

Cada falha tem consequências além do impacto imediato. Rastreie pelo menos dois pedidos de profundidade.

### Modelo de corrente```

Trigger: [event]
→ 1st order: [immediate effect]
→ 2nd order: [consequence of the 1st order effect]
→ 3rd order: [consequence of the 2nd order effect]

````
### Exemplo de Cadeia```
Trigger: Key engineer leaves during migration
  → 1st order: Migration timeline slips 4 weeks
    → 2nd order: Overlap period with legacy system extends, doubling operational cost
      → 3rd order: Budget overrun triggers executive review, project gets descoped
````

### Padrões comuns de segunda ordem

| Primeira Ordem             | Segunda Ordem                             | Terceira Ordem                                                              |
| -------------------------- | ----------------------------------------- | --------------------------------------------------------------------------- |
| Recurso chega com atraso   | Vendas perdem meta trimestral             | Engenharia perde confiança e ganha mais fiscalização                        |
| O desempenho degrada       | Usuários adotam soluções alternativas     | Soluções alternativas tornam-se “requisitos” que restringem o design futuro |
| Membro da equipe se esgota | Conhecimento concentrado em menos pessoas | Fator ônibus cai, risco aumenta                                             |
| Quebras de dependência     | Hotfix ignora teste                       |

g | Novos bugs introduzidos, confiança nos lançamentos cai |
| Problema de qualidade dos dados | Os relatórios downstream estão errados | Decisões de negócios tomadas com base em dados incorretos |
| Superação de custos | Orçamento retirado de outras iniciativas | O moral da equipe cai, o talento vai embora |

## Técnica de Inversão

Pergunte: **"O que garantiria que isso falhasse?"** Em seguida, verifique se alguma dessas condições existe hoje.

### Condições de falha garantidas

| Categoria          | O que garante o fracasso                                                                            |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| **Pessoas**        | Ponto único de conhecimento, sem adesão das partes interessadas, a equipe não acredita na abordagem |
| **Processo**       | Sem plano de reversão, sem validação incremental, implantação do tipo tudo ou nada                  |
| **Tecnologia**     | Não testado na escala desejada, dependências não documentadas, dependência de versão                |
| **Linha do tempo** | Sem buffer para incógnitas, dependências de equipes externas sem SLA, cr paralelo                   |

caminhos iticos |
| **Dados** | Migração sem validação, sem verificações de qualidade de dados, alterações de esquema sem compatibilidade com versões anteriores |
| **Incentivos** | Métricas de sucesso desalinhadas com os objetivos reais, equipe recompensada pela velocidade e não pela qualidade |

## Padrões de falha específicos do domínio

### Falhas Técnicas

| Padrão                  | Gatilho                                                 | Consequência Típica                                                  |
| ----------------------- | ------------------------------------------------------- | -------------------------------------------------------------------- |
| Penhasco de integração  | Novo serviço se conecta a mais de 3 sistemas existentes | Uma integração bloqueia todas as outras                              |
| Surpresa em escala      | Carregue 10x além do teste                              | Falhas em cascata entre serviços dependentes                         |
| Armadilha de migração   | “Basta mover os dados”                                  | Perda de dados, tempo de inatividade prolongado, reversão impossível |
| Podridão de dependência | Fixado em biblioteca abandonada                         | Vulnerabilidade de segurança                                         |

sem caminho de atualização |
| Desvio de configuração | Configuração manual do ambiente | “Funciona na minha máquina” torna-se “funciona em nenhum ambiente” |
| Casa de recuperação | Migração parcial, dois sistemas em execução | O pior dos dois mundos — dupla manutenção, estado inconsistente |

### Falhas Empresariais

| Padrão                           | Gatilho                                       | Consequência Típica                                         |
| -------------------------------- | --------------------------------------------- | ----------------------------------------------------------- |
| Penhasco de adoção               | Construa e eles não vêm                       | Custos irrecuperáveis ​​sem impacto nas receitas            |
| Antecipação do concorrente       | Concorrente envia recurso semelhante primeiro | Posicionamento de mercado perdido, diferenciação desgastada |
| Incompatibilidade de tempo       | Mudanças de mercado durante o desenvolvimento | Produto resolve problema de ontem                           |
| Reversão das partes interessadas | Mudanças de patrocinador executivo            | Projeto perde a priori                                      |

ty, recursos realocados |
| Custo oculto | Encargos operacionais subestimados | O recurso custa mais para ser executado do que gera |

### Falhas no processo

| Padrão                     | Gatilho                                            | Consequência Típica                                             |
| -------------------------- | -------------------------------------------------- | --------------------------------------------------------------- |
| Fantasia na linha do tempo | Estimativas baseadas no melhor caso                | Crunch, cortes de qualidade ou cortes de escopo no pior momento |
| Cadeia de dependência      | Equipe A espera pela Equipe B espera pela Equipe C | Qualquer deslize se espalha por todas as equipes                |
| Silo de conhecimento       | Especialista sai ou fica indisponível              | O progresso para; substituição aumenta por semanas              |
| Aumento do escopo          | "Já que estamos nisso..."                          | Gol original                                                    |

enterrado sob acréscimos |
| Feedback nulo | Nenhum teste de usuário até o lançamento | Produto errado construído corretamente |

## Sinais de alerta precoce

| Sinal de alerta                                          | O que isso indica                                         | Verifique Frequência        |
| -------------------------------------------------------- | --------------------------------------------------------- | --------------------------- |
| “Descobriremos isso mais tarde” repetido mais de 3 vezes | Decisões críticas sendo adiadas, não resolvidas           | Cada sessão de planejamento |
| Ninguém consegue explicar o plano de reversão            | A reversão não foi projetada                              | Antes do lançamento         |
| As estimativas continuam crescendo                       | Complexidade oculta sendo descoberta de forma incremental | Semanalmente                |

| As principais reuniões continuam sendo remarcadas

e | O alinhamento das partes interessadas é mais fraco do que se supunha | Semanalmente |
| "Funciona localmente" | A paridade ambiental é pior do que se supõe | Cada sprint |
| Fase de teste comprimida | A qualidade será sacrificada | Ponto de verificação no meio do projeto |
| Nenhuma métrica definida para o sucesso | Ninguém saberá se isso funcionou | Antes do início |
| Equipe usa linguagem de cobertura | A confiança é inferior ao declarado | Em andamento |

## Modelo de saída```markdown

## Pre-Mortem: [Plan/Decision Name]

**Timeframe:** [When would failure be evident]

### Failure Narratives

#### 1. [Failure Title] — Likelihood: High/Medium/Low | Impact: High/Medium/Low

[Specific failure narrative using the template above]

**Consequence chain:**

- 1st order: [immediate]
- 2nd order: [downstream]
- 3rd order: [systemic]

#### 2. [Failure Title] — Likelihood: High/Medium/Low | Impact: High/Medium/Low

[Narrative]

#### 3. [Failure Title] — Likelihood: High/Medium/Low | Impact: High/Medium/Low

[Narrative]

### Early Warning Signs

| Signal              | Failure It Predicts | Check Frequency           |
| ------------------- | ------------------- | ------------------------- |
| [Observable signal] | Failure #X          | Weekly / Sprint / Monthly |

### Mitigations

| Failure | Mitigation        | Effort       | Reduces Risk By |
| ------- | ----------------- | ------------ | --------------- |
| #1      | [Specific action] | Low/Med/High | [How much]      |
| #2      | [Specific action] | Low/Med/High | [How much]      |
| #3      | [Specific action] | Low/Med/High | [How much]      |

### Inversion Check

**What would guarantee failure:**

1. [Condition]
2. [Condition]
3. [Condition]

**Do any exist now?** [Yes/No with specifics for each]

```

```
