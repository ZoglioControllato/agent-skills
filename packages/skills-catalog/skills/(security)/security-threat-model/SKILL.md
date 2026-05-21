---
name: security-threat-model
description: 'Modelagem de ameaças ancorada no repositório: enumera fronteiras de confiança, ativos, capacidades do atacante, vetores de abuso e mitigações, e produz um modelo de ameaças em Markdown conciso. Use quando pedirem modelagem de ameaças de base ou caminho, enumerar ameaças ou vetores de abuso, ou threat modeling AppSec. NÃO use para resumos arquiteturais gerais, code review genérico, boas práticas de segurança (use security-best-practices) ou design não relacionado a segurança.'
metadata:
  author: github.com/openai/skills
  version: '1.0.0'
---

# Modelo de ameaças no código-fonte

Entregue um modelo de ameaças acionável em nível AppSec, específico ao repositório ou a um caminho do projeto — não uma lista genérica. Ancore cada afirmação arquitetural a evidência no repo e deixe suposições explícitas. Priorize objetivos realistas do atacante e impactos concretos em vez de checklists genéricos.

## Início rápido

1. Coletar (ou inferir) entradas:

- Caminho raiz do repo e caminhos no escopo.
- Uso pretendido, modelo de deploy, exposição à internet e expectativas de auth (se conhecidas).
- Qualquer resumo ou spec de arquitetura existente.
- Use prompts em `references/prompt-template.md` para gerar resumo do repositório.
- Siga o contrato de saída obrigatório em `references/prompt-template.md`. Use-o literalmente quando possível.

## Fluxo de trabalho

### 1) Escopo e extração do modelo do sistema

- Identifique componentes principais, armazenamentos e integrações externas a partir do resumo.
- Identifique como o sistema roda (servidor, CLI, biblioteca, worker) e seus entrypoints.
- Separe comportamento em runtime de CI/build/dev tooling e de testes/exemplos.
- Mapeie locais no escopo a esses componentes e exclua explicitamente o que está fora.
- Não afirme componentes, fluxos ou controles sem evidência.

### 2) Derivar fronteiras, ativos e pontos de entrada

- Enumere fronteiras de confiança como arestas concretas entre componentes, com protocolo, auth, criptografia, validação e rate limiting.
- Liste ativos que puxam risco (dados, credenciais, modelos, config, compute, logs de auditoria).
- Identifique pontos de entrada (endpoints, superfícies de upload, parsers/decoders, gatilhos de jobs, tooling admin, sinks de log/erro).

### 3) Calibrar ativos e capacidades do atacante

- Liste ativos que puxam risco (credenciais, PII, integridade crítica, disponibilidade, artefatos de build).
- Descreva capacidades realistas com base na exposição e uso pretendido.
- Registre explicitamente não-capacidades para não inflar severidade.

### 4) Enumerar ameaças como vetores de abuso

- Prefira objetivos do atacante ligados a ativos e fronteiras (exfiltração, elevação de privilégio, comprometimento de integridade, negação de serviço).
- Classifique cada ameaça e ligue-a aos ativos afetados.
- Poucas ameaças, mas de alta qualidade.

### 5) Priorizar com probabilidade e impacto explícitos

- Use probabilidade e impacto qualitativos (baixo/médio/alto) com justificativas curtas.
- Defina prioridade geral (crítico/alto/médio/baixo) como probabilidade × impacto, ajustando controles existentes.
- Indique quais suposições mais influenciam o ranqueamento.

### 6) Validar contexto e suposições com o usuário

- Resuma suposições-chave que mudem ranqueamento ou escopo e peça confirmação ou correção.
- Faça 1–3 perguntas objetivas sobre contexto faltante (dono do serviço, ambiente, escala/usuários, deploy, authn/authz, exposição, sensibilidade de dados, multitenancy).
- Pause e aguarde feedback antes do relatório final.
- Se o usuário não puder responder, diga quais suposições permanecem e como afetam prioridade.

### 7) Recomendar mitigações e focos

- Separe mitigações existentes (com evidência) das recomendadas.
- Una mitigações a locais concretos (componente, fronteira, entrada) e tipos de controle (authZ, validação, schema, sandbox, rate limit, isolamento de segredos, auditoria).
- Prefira dicas de implementação específicas a conselhos genéricos.
- Com suposições não resolvidas, marque recomendações como condicionais.

### 8) Checagem de qualidade antes de finalizar

- Todos os entrypoints descobertos cobertos.
- Cada fronteira de confiança representada nas ameaças.
- Separação runtime vs CI/dev clara.
- Esclarecimentos do usuário (ou não-respostas explícitas) refletidos.
- Suposições e questões abertas explícitas.
- Formato do relatório alinhado ao template: `references/prompt-template.md`
- Grave o Markdown final em arquivo `<nome-repo-ou-dir>-threat-model.md` (basename do repo raiz ou do diretório no escopo).

## Orientação de priorização de risco (ilustrativa, não exaustiva)

- Alto: RCE pré-auth, bypass de auth, acesso cross-tenant, exfiltração de dados sensíveis, roubo de chave/token, comprometimento de integridade de modelo/config, escape de sandbox.
- Médio: DoS direcionado a componentes críticos, exposição parcial de dados, bypass de rate limit com impacto mensurável, envenenamento de log/métricas que afeta detecção.
- Baixo: vazamento de informação pouco sensível, DoS ruidoso com mitigação fácil, issues com pré-condições improváveis.

## Referências

- Contrato de saída e template completo: `references/prompt-template.md`
- Lista opcional de controles/ativos: `references/security-controls-and-assets.md`

Carregue só as referências necessárias. Mantenha o resultado conciso, ancorado e revisável.
