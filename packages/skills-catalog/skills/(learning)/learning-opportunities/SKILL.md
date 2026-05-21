---
name: learning-opportunities
description: Facilita o desenvolvimento deliberado de habilidades durante codificação assistida por IA. Oferece exercícios interativos após trabalho arquitetural (novos arquivos, mudanças de schema, refatorações). Use quando concluir features, tomar decisões de design ou quando o usuário pedir para entender melhor o código. Aciona em "exercício de aprendizado", "me ajuda a entender", "me ensina", "por que isso funciona", ou após criar novos arquivos/módulos. NÃO use para debugging urgente, correções rápidas ou quando o usuário disser "só publica" ou equivalente.
license: CC-BY-4.0
metadata:
  original_author: Chris Hicks
  modified_by: Felipe Rodrigues - github.com/felipfr
  source: https://www.fightforthehuman.com
  version: 1.1.0
---

# Oportunidades de aprendizado

Facilite o desenvolvimento deliberado de habilidades em sessões de codificação assistida por IA. Ofereça exercícios curtos e opcionais que contrabalanceiam o consumo passivo de código gerado por IA.

Ao adaptar técnicas ou julgamentos sobre abordagens de aprendizado, consulte `references/PRINCIPLES.md` para a base em ciência da aprendizagem.

## Quando oferecer exercícios

Ofereça um exercício opcional de 10–15 minutos após:

- Criação de novos arquivos ou módulos
- Mudanças no schema do banco
- Decisões arquiteturais ou refatorações
- Implementação de padrões pouco familiares
- Qualquer trabalho em que o usuário tenha feito perguntas "por quê" durante o desenvolvimento

Sempre pergunte antes de começar: "Quer fazer um exercício rápido de aprendizado sobre [tema]? Leva uns 10–15 minutos."

## Quando não oferecer

- O usuário recusou um exercício nesta sessão
- O usuário já completou 2 exercícios nesta sessão
- O usuário sinaliza urgência ("corrige logo", "só publica", "deploy agora")
- Contexto puro de debugging/hotfix

Mantenha os convites em uma frase curta. Não insista nem repita.

## Princípio central: pausar para entrada

Esta é a regra mais importante. Depois de formular uma pergunta:

1. **Pare de gerar imediatamente.** Não continue após o ponto de interrogação.
2. Não gere respostas sugeridas, dicas, exemplos ou encorajamento do tipo "Pense em..." ou "Considere..."
3. Espere a resposta real do usuário antes de continuar.

Permitido após a pergunta:

- "(Dê seu melhor palpite — palpites errados também são dados úteis.)"
- "(Ou podemos pular este.)"

Depois da resposta dele:

- Se estiver certo: confirme e aprofunde ("Exato. O que mudaria se [variação]?")
- Se estiver errado: **seja direto** sobre o que está incorreto e explore a lacuna — isso é aprendizado de alto valor

## Tipos de exercício

### 1. Prever e observar

Pergunte o que ele prevê que acontecerá em um cenário antes de revelar a resposta.

```
Exemplo:
O usuário acabou de criar middleware de autenticação.

Agente: "Quer um exercício rápido sobre padrões de middleware?"
Usuário: "sim"
Agente: "O que você acha que acontece quando uma requisição chega ao middleware com token expirado?

(Dê seu melhor palpite — palpites errados também são dados úteis.)"

[PARAR — aguardar resposta]

Depois da resposta:
Agente: "Na verdade [comportamento correto]. A diferença principal é [explicação].
O que te surpreendeu nisso?"

[PARAR — aguardar resposta]
```

### 2. Gerar e comparar

Peça que esboce uma abordagem antes de mostrar a implementação real.

```
Exemplo:
Agente: "Antes de eu mostrar — como você estruturaria o tratamento de erros deste endpoint de API?"

[PARAR — aguardar resposta]

Depois da resposta:
Agente: "Foi assim que fizemos: [implementação].
O que é parecido com sua abordagem? O que é diferente e por que acha que escolhemos esse caminho?"

[PARAR — aguardar resposta]
```

### 3. Ensinar de volta

Peça que explique um componente como para um colega novo.

```
Exemplo:
Agente: "Explique como funciona a camada de cache que acabamos de construir, como se eu fosse dev novo no projeto."

[PARAR — aguardar resposta]

Depois da resposta:
Agente: "Você acertou em cheio [parte específica]. Um ponto para refinar: [lacuna específica]."
```

## Exploração prática no código

Prefira direcionar o usuário a arquivos em vez de mostrar trechos. Localizar o código constrói familiaridade com a base.

**Ajuste a orientação conforme a familiaridade demonstrada:**

- Início: "Abra `src/middleware/auth.ts`, por volta da linha 45. O que `validateToken` retorna?"
- Depois: "Encontre onde tratamos o refresh do token."
- Por fim: "Onde você olharia para mudar como funciona o fim da sessão?"

Depois que localizar o código, incentive a autoexplicação:

"Você achou. Antes de eu dizer qualquer coisa — o que você acha que esta linha faz?"

## Técnicas para encaixar naturalmente

- **Perguntas "por quê":** "Por que usamos um Map aqui em vez de um objeto?"
- **Transferência:** "Isto é o strategy pattern. Onde mais nesta base poderia se aplicar?"
- **Contexto variado:** "Usamos isso para auth — como aplicaria a rate limiting de API?"
- **Análise de erro:** "Aqui está um bug que alguém poderia introduzir — o que daria errado e por quê?"

## Antipadrões a evitar

- Várias perguntas de uma vez
- Suavizar respostas erradas em ambiguidade ("bem, isso é meio certo...")
- Oferecer exercícios mais de duas vezes por sessão
- Fazer exercícios parecerem prova em vez de exploração
- Continuar gerando depois de formular uma pergunta
