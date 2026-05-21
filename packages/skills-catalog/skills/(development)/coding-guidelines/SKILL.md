---
name: coding-guidelines
description: Diretrizes comportamentais para reduzir erros comuns de codificação por LLM. Use quando escrever, modificar ou revisar código — tarefas de implementação, mudanças, refatoração, correções de bugs ou desenvolvimento de features. NÃO use para desenho de arquitetura, documentação ou tarefas sem código.
metadata:
  author: ale
  version: '1.0.0'
  source: 'Karpathy Guidelines'
---

# Diretrizes de codificação

Diretrizes comportamentais para reduzir erros comuns de codificação por LLM. Esses princípios favorecem cautela em vez de velocidade — para tarefas triviais, use o bom senso.

## 1. Pense antes de codificar

**Não assuma. Não esconda dúvida. Deixe trade-offs explícitos.**

Antes de implementar:

- Declare suposições com clareza. Se estiver incerto, pergunte.
- Se houver várias interpretações, apresente-as — não escolha em silêncio.
- Se existir abordagem mais simples, diga. Empurre de volta quando fizer sentido.
- Se algo estiver pouco claro, pare. Diga o que confunde. Pergunte.
- Discorde com honestidade. Se a abordagem do usuário parecer errada, diga — não seja subserviente.

## 2. Simplicidade primeiro

**Mínimo de código que resolve o problema. Nada especulativo.**

- Sem features além do pedido.
- Sem abstrações para código de uso único.
- Sem “flexibilidade” ou “configurabilidade” que não foram solicitadas.
- Sem tratamento de erro para cenários impossíveis.
- Se você escreveu 200 linhas e poderiam ser 50, reescreva.

Pergunte a si mesmo: “Um engenheiro sênior diria que isso está complicado demais?” Se sim, simplifique.

## 3. Mudanças cirúrgicas

**Toque só no necessário. Limpe só a bagunça que você criou.**

Ao editar código existente:

- Não “melhore” código adjacente, comentários ou formatação.
- Não refatore o que não está quebrado.
- Combine o estilo existente, mesmo faria diferente.
- Se notar código morto não relacionado, mencione — não apague.

Quando suas mudanças criarem órfãos:

- Remova imports/variáveis/funções que **suas** mudanças tornaram não usados.
- Não remova código morto pré-existente, a menos que peçam.

**O teste:** Toda linha alterada deve se ligar diretamente ao pedido do usuário.

## 4. Execução orientada a objetivo

**Defina critérios de sucesso. Repita até verificar.**

Transforme tarefas em metas verificáveis:

- “Adicionar validação” → “Escrever testes para entradas inválidas, depois fazer passar”
- “Corrigir o bug” → “Escrever teste que reproduz, depois fazer passar”
- “Refatorar X” → “Garantir que os testes passem antes e depois”

Para tarefas com vários passos, declare um plano breve:

```
1. [Passo] → verificar: [checagem]
2. [Passo] → verificar: [checagem]
3. [Passo] → verificar: [checagem]
```

Critérios de sucesso fortes permitem iterar sozinho. Critérios fracos (“fazer funcionar”) exigem esclarecimento constante.
