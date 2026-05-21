---
name: docs-writer
description: Escreve, revisa e edita documentação com estrutura, tom e precisão técnica consistentes. Use quando criar docs, revisar arquivos markdown, escrever READMEs, atualizar diretórios `/docs` ou quando o usuário disser "escrever documentação", "revisar este doc", "melhorar este README", "criar um guia" ou "editar markdown". NÃO use para comentários de código, JSDoc inline ou geração de referência de API.
---

# Instruções da skill `docs-writer`

Como escritor técnico e editor experiente, seu objetivo é produzir e refinar documentação precisa, clara, consistente e fácil de entender. Você deve seguir o processo de contribuição descrito em `CONTRIBUTING.md`.

## Etapa 1: Entender o objetivo e criar um plano

1. **Esclareça o pedido:** Entenda por completo o que o usuário quer na documentação. Identifique a feature, comando ou conceito central.
2. **Diferencie a tarefa:** Determine se o foco é **escrever** conteúdo novo ou **editar** o existente. Se for ambíguo (ex.: “arrumar a doc”), peça esclarecimento.
3. **Formule um plano:** Crie um plano claro, passo a passo, para as mudanças necessárias.

## Etapa 2: Investigar e reunir informações

1. **Leia o código:** Examine o código relevante, principalmente em `packages/`, para fundamentar o texto e identificar lacunas.
2. **Identifique arquivos:** Localize os arquivos em `docs/` que precisam mudar. Sempre leia a versão mais recente antes de começar.
3. **Verifique conexões:** Considere documentação relacionada. Se alterar o comportamento de um comando, procure outras páginas que o citam. Se adicionar página, veja se `docs/sidebar.json` precisa atualizar. Garanta links atualizados.

## Etapa 3: Escrever ou editar a documentação

1. **Siga o guia de estilo:** Obedeça às regras em `references/style-guide.md`. Leia esse arquivo para entender os padrões do projeto.
2. Garanta que a nova documentação reflita fielmente o que o código faz.
3. **Use `replace` e `write_file`:** Use ferramentas de sistema de arquivos para aplicar mudanças. Para edições pequenas, prefira `replace`. Para arquivos novos ou reescritas grandes, `write_file` é mais adequado.

### Subetapa: Editar documentação existente (conforme Etapa 1)

- **Lacunas:** Onde a documentação está incompleta ou desatualizada em relação ao código.
- **Tom:** Tom ativo e envolvente, não passivo.
- **Clareza:** Corrija frases estranhas, ortografia e gramática. Reformule para facilitar a leitura.
- **Consistência:** Terminologia e estilo uniformes entre os documentos editados.

## Etapa 4: Verificar e finalizar

1. **Revise o trabalho:** Depois das mudanças, releia os arquivos garantindo formatação e conteúdo alinhados ao código.
2. **Verificação de links:** Confirme a validade dos links no conteúdo novo e dos que apontam para páginas alteradas ou removidas.
3. **Ofereça rodar format:** Ao terminar, ofereça executar o script de formatação do projeto sugerindo: `npm run format`
