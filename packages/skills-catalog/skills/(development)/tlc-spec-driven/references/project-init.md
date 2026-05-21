# Inicialização do Projeto

**Acionador:** "Inicializar projeto", "Configurar projeto", "Iniciar novo projeto"

## Processo

Extraia a visão do projeto por meio de perguntas e respostas iterativas (máximo de 3 a 5 perguntas por mensagem):

**Perguntas essenciais:**

1. O que você está construindo?
2. A quem se destina e que problema resolve?
3. Qual pilha de tecnologia você está usando? (se conhecido)
4. O que está no escopo da v1? O que está explicitamente excluído?
5. Restrições críticas? (cronograma, técnico, recursos)

**Parar quando:** Compreensão clara da visão, das metas e dos limites.

## Saída: .specs/project/PROJECT.md

**Estrutura:**

```markdown
# [Project Name]

**Vision:** [1-2 sentence description]
**For:** [target users]
**Solves:** [core problem being addressed]

## Goals

- [Primary goal with measurable success metric]
- [Secondary goal with measurable success metric]

## Tech Stack

**Core:**

- Framework: [name + version]
- Language: [name + version]
- Database: [name]

**Key dependencies:** [3-5 critical libraries/frameworks]

## Scope

**v1 includes:**

- [Core capability 1]
- [Core capability 2]
- [Core capability 3]

**Explicitly out of scope:**

- [What is NOT being built]
- [What is NOT being built]

## Constraints

- Timeline: [if applicable]
- Technical: [if applicable]
- Resources: [if applicable]
```

**Limite de tamanho:** 2.000 tokens (aproximadamente 1.200 palavras)

**Validação:**

- Visão clara em 1-2 frases?
- As metas têm resultados mensuráveis?
- Os limites do escopo são explícitos?
