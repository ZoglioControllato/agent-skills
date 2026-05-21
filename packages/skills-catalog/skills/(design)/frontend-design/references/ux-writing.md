# Escrita UX

## O problema do rótulo do botão

**Nunca use "OK", "Enviar" ou "Sim/Não".** Estes são preguiçosos e ambíguos. Use padrões específicos de verbo + objeto:

| Ruim        | Bom               | Por que                              |
| ----------- | ----------------- | ------------------------------------ |
| OK          | Salvar alterações | Diz o que vai acontecer              |
| Enviar      | Criar conta       | Focado em resultados                 |
| Sim         | Excluir mensagem  | Confirma a ação                      |
| Cancelar    | Continue editando | Esclarece o que significa “cancelar” |
| Clique aqui | Baixar PDF        | Descreve o destino                   |

**Para ações destrutivas**, nomeie a destruição:

- "Excluir" e não "Remover" (a exclusão é permanente, a remoção implica recuperável)
- "Excluir 5 itens" e não "Excluir selecionados" (mostra a contagem)

## Mensagens de erro: a fórmula

Toda mensagem de erro deve responder: (1) O que aconteceu? (2) Por quê? (3) Como consertar isso? Exemplo: "O endereço de e-mail não é válido. Inclua um símbolo @." não "Entrada inválida".

### Modelos de mensagens de erro

| Situação              | Modelo                                                                     |
| --------------------- | -------------------------------------------------------------------------- |
| **Erro de formato**   | "[Campo] precisa ser [formato]. Exemplo: [exemplo]"                        |
| **Não é obrigatório** | "Por favor, insira [o que está faltando]"                                  |
| **Permissão negada**  | "Você não tem acesso a [coisa]. [O que fazer em vez disso]"                |
| **Erro de rede**      | "Não foi possível alcançar [coisa]. Verifique sua conexão e [ação]."       |
| **Erro de servidor**  | "Algo deu errado do nosso lado. Estamos investigando isso. [Alternativa ac |

ção]" |

### Não culpe o usuário

Erros de reformulação: "Insira uma data no formato MM/DD/AAAA" e não "Você inseriu uma data inválida".

## Estados vazios são oportunidades

Os estados vazios são momentos de integração: (1) Reconheça brevemente, (2) Explique o valor de preenchê-los, (3) Forneça uma ação clara. "Nenhum projeto ainda. Crie o seu primeiro para começar." não apenas "Sem itens".

## Voz vs Tom

**Voz** é a personalidade da sua marca, consistente em todos os lugares.
**Tom** se adapta ao momento.

| Momento                | Mudança de tom                                                        |
| ---------------------- | --------------------------------------------------------------------- |
| Sucesso                | Comemorativo, breve: "Concluído! Suas alterações estão ativas."       |
| Erro                   | Empático, prestativo: "Isso não funcionou. Aqui está o que tentar..." |
| Carregando             | Tranquilizador: "Salvando seu trabalho..."                            |
| Confirmação destrutiva | Sério, claro: "Excluir este projeto? Isso não pode ser desfeito."     |

**Nunca use humor para erros.** Os usuários já estão frustrados. Seja útil, não fofo.

## Escrevendo para acessibilidade

**O texto do link** deve ter um significado independente: "Ver planos de preços" e não "Clique aqui". **Texto alternativo** descreve informações, não a imagem: "A receita aumentou 40% no quarto trimestre" e não "Gráfico". Use `alt=""` para imagens decorativas. **Botões de ícone** precisam de `aria-label` para contexto de leitor de tela.

## Escrevendo para Tradução

### Plano de Expansão

O texto em alemão é cerca de 30% mais longo que o inglês. Alocar espaço:

| Idioma    | Expansão                                   |
| --------- | ------------------------------------------ |
| Alemão    | +30%                                       |
| Francês   | +20%                                       |
| Finlandês | +30-40%                                    |
| Chinês    | -30% (menos caracteres, mas mesma largura) |

### Padrões de fácil tradução

Mantenha os números separados (“Novas mensagens: 3” e não “Você tem 3 novas mensagens”). Use frases completas como sequências únicas (a ordem das palavras varia de acordo com o idioma). Evite abreviações (“5 minutos atrás” e não “5 minutos atrás”). Dê aos tradutores contexto sobre onde as strings aparecem.

## Consistência: o problema da terminologia

Escolha um termo e fique com ele:

| Inconsistente                     | Consistente   |
| --------------------------------- | ------------- |
| Excluir/Remover/Lixeira           | Excluir       |
| Configurações/Preferências/Opções | Configurações |
| Entrar / Entrar / Entrar          | Entrar        |
| Criar/Adicionar/Novo              | Criar         |

Crie um glossário terminológico e aplique-o. A variedade cria confusão.

## Evite cópias redundantes

Se o título explica isso, a introdução é redundante. Se o botão estiver claro, não explique novamente. Diga uma vez, diga bem.

## Carregando Estados

Seja específico: "Salvando seu rascunho..." e não "Carregando...". Para esperas longas, defina expectativas (“Isso geralmente leva 30 segundos”) ou mostre o progresso.

## Diálogos de confirmação: use com moderação

A maioria das caixas de diálogo de confirmação são falhas de design; em vez disso, considere desfazer. Quando você deve confirmar: nomeie a ação, explique as consequências, use rótulos de botões específicos ("Excluir projeto"/"Manter projeto", não "Sim"/"Não").

## Instruções do formulário

Mostre o formato com espaços reservados, não com instruções. Para campos não óbvios, explique por que você está perguntando.

---

**Evitar**: Jargão sem explicação. Culpar os usuários ("Você cometeu um erro" → "Este campo é obrigatório"). Erros vagos (“Algo deu errado”). Terminologia variável para variedade. Humor para erros.
