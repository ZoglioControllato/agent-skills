---
name: security-best-practices
description: Revise segurança com boas práticas por linguagem e framework e sugira melhorias. Use quando pedirem orientação explícita de boas práticas de segurança, relatório/revisão de segurança ou código secure-by-default. Cobre Python, JavaScript/TypeScript e Go. NÃO use para code review geral, debugging, modelagem de ameaças (use security-threat-model) ou tarefas sem relação com segurança.
metadata:
  author: github.com/openai/skills
  version: '1.0.0'
---

# Boas práticas de segurança

## Visão geral

Esta skill descreve como identificar linguagem e frameworks do contexto atual e carregar, no diretório `references/`, orientações de segurança alinhadas a essa stack.

Use essas informações para escrever código secure-by-default, detectar passivamente problemas graves em código existente ou, se o usuário pedir, produzir relatório de vulnerabilidades e sugestões de correção.

## Fluxo de trabalho

O primeiro passo é identificar **todas** as linguagens e **todos** os frameworks relevantes ao escopo — foco nos frameworks principais. Muitas vezes há frontend e backend.

Depois verifique em `references/` documentação para a linguagem/framework. Leia **todos** os arquivos pertinentes. O padrão de nome é `<language>-<framework>-<stack>-security.md`. Verifique também `<language>-general-<stack>-security.md` quando agnóstico de framework.

Em aplicação web com frontend e backend, verifique referências para **ambos**.

Se o frontend não estiver especificado, consulte `javascript-general-web-frontend-security.md`. É importante proteger as duas pontas.

Se não houver material em `references/`, use conhecimento sólido sobre a stack e boas práticas conhecidas; se pedirem relatório e não houver guia concreto, informe que a orientação específica não está disponível (ainda assim pode relatório ou apontar vulnerabilidades óbvias).

Modos de operação:

1. **Primário** — usar a informação para escrever código seguro daqui em diante (novo projeto ou novo código).

2. **Secundário** — detectar passivamente vulnerabilidades ao trabalhar no projeto; problemas críticos ou que ferem muito as diretrizes podem ser sinalizados ao usuário. Foque nos maiores impactos.

3. **Relatório** — a pedido, produza relatório priorizado sobre onde o projeto falha em relação às boas práticas; depois ofereça corrigir. Veja #fixes abaixo.

## Árvore de decisão

- Se linguagem/framework estiver incerto, inspecione o repo, liste evidências.
- Se existir guia em `references/`, carregue só o relevante e siga as instruções.
- Se não existir, use conhecimento geral; em relatório, deixe claro quando a orientação concreta falta.

## Sobrescritas

As referências trazem boas práticas, mas projetos podem precisar contorná-las. Respeite regras do próprio projeto em documentação ou prompts. Ao contornar uma prática, você pode informar o usuário, mas não insista. Se o bypass for recorrente, sugira documentar o motivo no projeto.

## Formato do relatório

Grave em `security_best_practices_report.md` ou onde o usuário indicar. Pergunte o caminho se necessário.

- Resumo executivo curto no topo.
- Seções por severidade dos achados, com IDs numéricos para referência.
- Para achados críticos: uma frase de impacto.

Depois de gravar o arquivo, resuma ao usuário (pode ser menos verboso), ofereça explicar achados e indique o caminho do relatório.

Ao referenciar código no relatório, inclua números de linha quando possível.

## Correções (#fixes)

Após o relatório, deixe o usuário ler e pedir para começar correções.

Se achar algo crítico em modo passivo, avise e pergunte se deseja correção.

Uma correção por vez. Comentários concisos ligando à prática de segurança específica e por que o contrário é perigoso.

Avalie impacto funcional e regressões; código inseguro pode ser dependência implícita. Prefira correção bem fundamentada a mudança rápida e quebradiça.

Siga o fluxo de commit/change do usuário. Mensagens de commit claras alinhadas a segurança. Evite misturar achados não relacionados em um único commit.

Rode testes do projeto quando existirem; avalie efeitos de segunda ordem e avise o usuário antes se houver risco.

## Conselhos gerais de segurança

### Evite IDs incrementais pequenos como identificadores públicos

Para recursos expostos na internet, prefira UUID v4 ou strings aleatórias longas em vez de IDs auto-incrementais pequenos — reduz enumerabilidade e vazamento de volume.

### Nota sobre TLS

TLS é essencial em produção, mas desenvolvimento local frequentemente roda sem TLS ou atrás de proxy fora de escopo. **Não** classifique ausência de TLS em dev como problema de segurança sem contexto. Cuidado com cookies `Secure`: só fazem sentido com HTTPS real; em dev HTTP podem quebrar a aplicação. Flags/ambiente para ligar `Secure` só em produção ajudam. **Evite recomendar HSTS** sem entender impacto duradouro (pode causar bloqueio prolongado de usuários e incidentes); em muitos projetos de revisão não é recomendação padrão.
