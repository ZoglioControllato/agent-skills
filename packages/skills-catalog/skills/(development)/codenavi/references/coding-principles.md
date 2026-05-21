# Princípios de codificação

Leia este arquivo durante a fase Executar ao implementar alterações.
Esses princípios reduzem erros comuns de codificação de IA e garantem
saída consistente e de alta qualidade.

## 1. Pense antes de codificar

Antes de escrever qualquer código:

- Indique explicitamente as suas suposições. Se não tiver certeza, pergunte.
- Se existirem múltiplas abordagens, apresente-lhes compensações.
- Se existir uma abordagem mais simples, diga-o. Empurre para trás quando necessário.
- Se algo não estiver claro, pare. Nomeie o que é confuso. Perguntar.
- Se a abordagem do desenvolvedor parecer errada, diga-o de forma construtiva.
  Não seja bajulador – a honestidade evita erros.

## 2. Simplicidade em primeiro lugar

Escreva o código mínimo que resolva o problema.

- Não há recursos além do que foi solicitado.
- Sem abstrações para código de uso único.
- Nenhuma “flexibilidade” ou “configurabilidade” que não foi solicitada.
- Sem tratamento de erros para cenários impossíveis.
- Sem otimização especulativa.
- Se você escreveu 200 linhas e podem ser 50, reescreva.

O teste: "Um engenheiro sênior diria que isso é complicado demais?"
Se sim, simplifique.

## 3. Alterações Cirúrgicas

Ao editar o código existente:

- Não "melhore" código, comentários ou formatação adjacentes.
- Não refatore coisas que não estão quebradas.
- Combine o estilo existente, mesmo que você faça de forma diferente.
- Se você notar problemas não relacionados, mencione-os – não os corrija.

Quando suas alterações criam órfãos:

- Remova importações, variáveis e funções que SUAS alterações tornaram não utilizadas.
- Não remova código morto pré-existente, a menos que seja solicitado.

O teste: cada linha alterada remete diretamente ao objetivo da missão.

## 4. Execução Orientada a Metas

Transforme tarefas vagas em metas verificáveis:

- "Adicionar validação" → "Escreva testes para entradas inválidas e faça-os passar"
- "Corrigir o bug" → "Escreva um teste que o reproduza e depois faça-o passar"
- "Refator X" → "Garantir que os testes sejam aprovados antes e depois"

Para tarefas de várias etapas, estabeleça um plano resumido com pontos de verificação.
Critérios de sucesso fortes permitem a execução autônoma. Critérios fracos
("fazer funcionar") exigem esclarecimentos constantes - peça melhores
critérios em vez de adivinhações.

## 5. Respeite a base de código

Você é um convidado nesta base de código. Aja como tal.

- Use as mesmas convenções de nomenclatura já existentes no projeto.
- Use os mesmos padrões de organização de arquivos.
- Use a mesma abordagem de tratamento de erros.
- Use o mesmo estilo de importação (nomeado versus padrão, relativo versus absoluto).
- Se o projeto usar ponto e vírgula, use ponto e vírgula. Se não, não faça isso.

Se as convenções existentes entrarem em conflito com as melhores práticas linguísticas, sinalize-as
para o desenvolvedor. Não introduza silenciosamente uma convenção diferente.

## 6. Melhores práticas de linguagem

Sempre siga as melhores práticas oficiais para o idioma e
estruturas em uso. Isso significa:

- Use padrões idiomáticos para o idioma (por exemplo, compreensões de lista
  em Python, encadeamento opcional em TypeScript).
- Siga o guia de estilo oficial quando o projeto não tiver o seu próprio.
- Use APIs e métodos atuais e não obsoletos.
- Tratar erros de acordo com as convenções da linguagem (try/catch,
  Tipos de resultados, retornos de erros — o que o ecossistema preferir).

Crítico: Nunca confie na memória de treinamento para assinaturas de API, métodos
parâmetros ou comportamento da estrutura. Sempre verifique em relação à corrente
documentação usando a cadeia de verificação de conhecimento:```
.notebook/ → project docs → MCP Context7 → web search → flag as uncertain

```
## 7. Dependências e importações

Ao adicionar novas dependências ou importações:

- Verifique se o projeto já possui uma dependência que resolva o
  problema antes de adicionar um novo.
- Verifique o gerenciador de pacotes e o arquivo de bloqueio do projeto para ver se há
  versões.
- Se adicionar uma nova dependência, mencione-a ao desenvolvedor com
  justificativa - nunca adicione pacotes silenciosamente.
- Combine o estilo de importação e as convenções de pedido do projeto.

## 8. Tratamento de erros

- Lidar com erros que podem ocorrer de forma realista.
- Não adicione blocos catch para cenários teoricamente impossíveis.
- Use os padrões de tratamento de erros existentes no projeto.
- As mensagens de erro devem ser acionáveis — contar o que aconteceu e
  o que fazer a respeito, não apenas "Algo deu errado".
- Nunca engula erros silenciosamente (esvazie blocos de captura), a menos que
  há um motivo explícito documentado em um comentário.

## 9. Teste

Quando os testes fazem parte da missão:

- Escreva testes que verifiquem o comportamento, não detalhes de implementação.
- Teste o contrato (entrada → saída), não o estado interno.
- Nomeie os testes de forma descritiva: "deve rejeitar cupom expirado"
  não "test1" ou "teste de cupom".
- Se estiver modificando o código existente, execute primeiro os testes existentes para
  estabelecer uma linha de base.
- Se adicionar uma correção de bug, escreva um teste que reproduza o bug
  primeiro, depois conserte.

Quando os testes NÃO fazem parte da missão:

- Não adicione testes a menos que seja solicitado.
- Mas mencione se a mudança é arriscada e não testada:
  “Essa mudança afeta o fluxo de pagamentos, mas não há testes
  percorrendo esse caminho. Considere adicionar testes para [casos específicos]."

## 10. Comentários

- Não adicione comentários que reformulem o código.
- Não remova comentários existentes, a menos que estejam comprovadamente errados.
- Adicione comentários apenas para lógica de negócios ou soluções alternativas não óbvias.
- Se você adicionar uma solução alternativa, explique POR QUE ela é necessária e vincule
  ao problema/ticket relevante, se disponível.
- Combine o estilo e a linguagem de comentários do projeto (linguagem humana).
```
