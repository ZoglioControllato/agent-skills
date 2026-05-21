# Solução de problemas – Erros e correções comuns

Carregue este arquivo quando a validação falhar ou os diagramas não forem renderizados corretamente.

## Erros de sintaxe

### 1. Token inesperado/erro de análise

**Sintoma:** `Erro de análise na linha N: ...`

**Causas comuns e soluções:**

| Causa                           | Ruim                  | Bom                     |
| ------------------------------- | --------------------- | ----------------------- |
| Caracteres especiais em rótulos | `A[Dados do usuário]` | `A["Dados do usuário"]` |
| Colchetes incomparáveis ​​      | `A[Rótulo aberto`     | `A[Rótulo aberto]`      |
| Flecha faltando                 | `A B`                 | `A --> B`               |
| Direção errada da seta          | `A >>- B`             | `A ->> B`               |

| Palavra-chave como

ID do nó | `fim --> início` | `endNode --> startNode` |
| Chaves no comentário | `%% {config}` | `%% configure aqui` |

### 2. Palavras reservadas como IDs de nó

Estas palavras NÃO PODEM ser usadas como IDs de nó simples:

`end`, `graph`, `subgraph`, `flowchart`, `classDiagram`, `sequenceDiagram`, `stateDiagram`, `erDiagram`, `gantt`, `pie`, `click`, `style`, `class`, `linkStyle`, `default`, `direction`

**Correção:** Anexe um sufixo ou use nomes diferentes:```
%% Bad
end --> start

%% Good
endState --> startState

````
### 3. Citações e Escape```
%% Bad — unescaped quotes
A["She said "hello""]

%% Good — use single quotes inside double, or HTML entities
A["She said 'hello'"]
A["She said &quot;hello&quot;"]

%% Bad — backslash in labels
A[C:\Users\path]

%% Good — use forward slash or quote the label
A["C:\Users\path"]
````

### 4. Etiquetas vazias ou conteúdo ausente```

%% Bad — empty node
A[] --> B

%% Good
A[Start] --> B[End]

%% Bad — empty subgraph
subgraph Group
end

%% Good
subgraph Group
A[Content]
end

```
## Problemas de renderização

### 5. O diagrama é renderizado, mas o layout está errado

**Sintoma:** Nós se sobrepõem, setas se cruzam desnecessariamente

**Correções:**

- Mudar direção: `TD` ↔ `LR`
- Adicione links invisíveis para espaçamento: `A ~~~ B`
- Use subgráficos para agrupar nós relacionados
- Reduzir a contagem de nós (dividir em vários diagramas)
- Experimente `layout: elk` no frontmatter (se suportado)

### 6. Etiquetas cortadas ou truncadas

**Sintoma:** Texto longo fica cortado

**Correções:**

```

%% Use line breaks
A["Order Processing<br/>Service"]

%% Shorten labels
A["Order Svc"]

%% For sequence diagrams, use aliases
participant OrderSvc as Order Processing Service

```
### 7. O subgráfico não será renderizado

**Sintoma:** O subgráfico aparece como plano, sem limite

**Correções:**

```

%% Bad — subgraph must have content
subgraph Empty
end

%% Good — needs at least one node
subgraph Group["Service Layer"]
A[Service A]
end

%% Bad — nested subgraph direction before content
subgraph Parent
direction LR
end

%% Good — direction followed by nodes
subgraph Parent
direction LR
A --> B
end

````
### 8. Tema não aplicado

**Sintoma:** O diagrama é renderizado com cores padrão

**Causas:**

- temas de linda sereia só funcionam com esse mecanismo
- Frontmatter deve estar no início do arquivo
- A diretiva `%%{init}` deve estar na linha 1
- Alguns renderizadores ignoram a configuração do tema

**Correção:** Verifique qual mecanismo está sendo usado. Para mmdc, use o sinalizador `--theme`. Para linda sereia, use o parâmetro `--theme`.

### 9. A saída SVG está em branco ou minúscula

**Sintoma:** O arquivo é gerado, mas está vazio ou tem 0x0 pixels

**Causas:**

- Puppeteer/Chrome não instalado (mmdc)
- Problema de codificação de arquivo (marcador BOM)
- Erro de sintaxe que falha silenciosamente

**Correções:**

```bash
# Re-run setup
bash $SKILL_DIR/scripts/setup.sh

# Check file encoding
file diagram.mmd
# Should say: UTF-8 Unicode text

# Validate first
node $SKILL_DIR/scripts/validate.mjs diagram.mmd
````

### 10. Comando mmdc não encontrado```bash

# Check if installed

npx mmdc --version

# If not, install

npm install -g @mermaid-js/mermaid-cli

# Or use npx (no global install)

npx -y @mermaid-js/mermaid-cli -i input.mmd -o output.svg

`````
### 11. Problemas do titereiro/Chrome

**Sintoma:** `Erro: não foi possível encontrar o Chrome````bash
# Install Chromium for puppeteer
npx puppeteer browsers install chrome

# Or set custom path
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Or use puppeteer config
echo '{"args": ["--no-sandbox"]}' > puppeteer-config.json
npx mmdc -i input.mmd -o output.svg -p puppeteer-config.json
`````

## Problemas específicos do diagrama

### 12. Diagrama de sequência - Incompatibilidade de ativação

**Sintoma:** `Erro de ativação` ou caixas desalinhadas```
%% Bad — activate without deactivate
A->>+B: Request
B->>C: Forward

%% Good — always pair +/-
A->>+B: Request
B-->>-A: Response

````
### 13. ERD – Erro de sintaxe de relacionamento```
%% Bad — wrong cardinality syntax
USER --o{ ORDER

%% Good — must include both sides
USER ||--o{ ORDER : "places"

%% Bad — missing label
USER ||--o{ ORDER

%% Good — relationship label is required
USER ||--o{ ORDER : "places"
````

### 14. C4 - Elemento não renderizado```

%% Bad — missing quotes around parameters
Container(api, API, NestJS, Backend service)

%% Good — all text parameters in quotes
Container(api, "API", "NestJS", "Backend service")

%% Bad — wrong boundary nesting
Container_Boundary(app, "App") {
System(sys, "External") %% System inside Container boundary
}

%% Good — use appropriate element types for context
Container_Boundary(app, "App") {
Component(cmp, "Internal Component", "Tech", "Desc")
}

````
### 15. Gantt – Datas não analisadas```
%% Bad — wrong format
dateFormat DD-MM-YYYY

%% Good — supported formats
dateFormat YYYY-MM-DD
%% or
dateFormat DD/MM/YYYY
%% or
dateFormat X  (Unix timestamp)
````

### 16. Fluxograma - Aviso de referência circular

**Sintoma:** Loop infinito na renderização```
%% Problematic — direct circular
A --> B --> A

%% Still valid but may cause layout issues. Fix by adding direction:
flowchart LR
A --> B
B --> A %% Renders as two arrows between A and B

````
### 17. Diagrama de Estado – Erros de Estado Composto```
%% Bad — missing initial state in composite
state Active {
    Running --> Paused
}

%% Good — composite states need initial transition
state Active {
    [*] --> Running
    Running --> Paused
}
````

### 18. Arquitetura beta – não renderizada

**Sintoma:** Texto bruto exibido em vez de diagrama

**Causa:** `architecture-beta` requer Mermaid v11+

**Correções:**

- Verifique a versão do Mermaid: `npx mmdc --version` (precisa de 11+)
- Use C4 ou fluxograma como substituto (consulte aws-architecture.md)
- Atualize sereia-cli: `npm install -g @mermaid-js/mermaid-cli@latest`

### 19. Arquitetura-beta – Ícones não exibidos

**Sintoma:** Os ícones aparecem como caixas genéricas ou estão ausentes

**Causa:** ícones `logos:aws-*` exigem registro do pacote de ícones no momento da renderização

**Correções:**

```bash
# Use the --icons flag to register icon packs
node $SKILL_DIR/scripts/render.mjs --input diagram.mmd --output diagram.svg --icons logos

# Or use built-in icons as fallback (no registration needed)
# Replace: service api(logos:aws-api-gateway)[API Gateway]
# With:    service api(server)[API Gateway]
```

Ícones integrados que funcionam em qualquer lugar: `nuvem`, `banco de dados`, `disco`, `servidor`, `internet`

### 20. Arquitetura-beta — Grandes distâncias entre setas/nós

**Sintoma:** Os nós estão extremamente espaçados, tornando as setas incrivelmente longas e cruzando outros nós de maneira confusa.

**Causa:** O renderizador da arquitetura beta não possui algoritmos de roteamento de borda e coloca os nós em grades rígidas e escalonadas. Isso quebra diagramas com > 8 nós.

**Correção:** NÃO use `architecture-beta` para sistemas complexos. Converta o diagrama em um diagrama `C4Container` com estilo adequado imediatamente. O mecanismo de layout do C4 espaça os elementos perfeitamente.

### 20. C4 — Linhas muito escuras/elementos sobrepostos

**Sintoma:** linhas pretas criam confusão visual, rótulos se sobrepõem a elementos

**Causa:** Diretivas `UpdateRelStyle` e `UpdateLayoutConfig` ausentes

**Correções:**

```
%% Add to the END of every C4 diagram, after all Rel() definitions
%% Apply to EACH Rel() with soft colors
UpdateRelStyle(from, to, $textColor="#475569", $lineColor="#94a3b8")

%% Add offsets when labels overlap elements
UpdateRelStyle(from, to, $textColor="#475569", $lineColor="#94a3b8", $offsetY="-10")

%% Spread out elements
UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

### 21. Geral - Linhas do diagrama muito escuras/ásperas

**Sintoma:** o diagrama parece confuso mesmo com poucos nós

**Causa:** O tema Sereia padrão usa linhas pretas (#000000)

**Correção:** Adicionada diretiva init com cor de linha suave:```
%%{init: {'theme': 'base', 'themeVariables': {
'lineColor': '#94a3b8'
}}}%%

````
### 22. Geral — Diretiva Init não aplicável

**Sintoma:** As cores não mudam apesar da adição da diretiva `%%{init}`

**Causa:** A diretiva deve estar na primeira linha (sem linhas em branco antes dela)

**Correção:** Certifique-se de que `%%{init}` seja a primeira linha sem comentários:```
%%{init: {'theme': 'base', 'themeVariables': {...}}}%%
flowchart LR
    A --> B
````

NÃO:```
flowchart LR
%%{init: {'theme': 'base', 'themeVariables': {...}}}%% %% THIS WILL NOT WORK
A --> B

````
## Erros de script de validação

### 23. validar.mjs relata falsos positivos

Se o validador rejeitar a sintaxe válida, ele poderá estar usando uma versão mais antiga do analisador Mermaid. Tentar:```bash
# Update the validation script's dependency
cd $SKILL_DIR && npm update mermaid

# Or skip validation and render directly (rendering validates implicitly)
node $SKILL_DIR/scripts/render.mjs --input diagram.mmd --output test.svg
````

### 24. O script em lote trava

**Sintoma:** batch.mjs processa alguns arquivos e depois para

**Causas:**

- Muitos trabalhadores para memória disponível
- Um diagrama possui sintaxe de loop infinito
- Tempo limite do titereiro em diagramas complexos

**Correções:**

```bash
# Reduce workers
node $SKILL_DIR/scripts/batch.mjs --workers 1

# Increase timeout (ms)
node $SKILL_DIR/scripts/batch.mjs --timeout 60000

# Process problematic files individually to isolate the issue
```

## Dicas de desempenho

1. **Diagramas simples primeiro** — comece com menos nós, adicione de forma incremental
2. **Dividir diagramas grandes** — mais de 15 nós prejudicam a legibilidade e a renderização
3. **Use SVG em vez de PNG** — SVG é renderizado mais rápido e dimensionado infinitamente
4. **ASCII para CI/CD** — não é necessário Puppeteer, rápido e portátil
5. **Lote em paralelo** — use `--workers 4` para vários arquivos
6. **Renderizações em cache** — renderizar novamente somente quando a origem do .mmd for alterada

## Problemas de qualidade de renderização

### 25. Fontes renderizadas como Times New Roman / Serif

**Sintoma:** O texto no PNG/SVG renderizado aparece em uma fonte com serifa feia em vez da fonte sem serifa esperada.

**Causa:** A diretiva `%%{init}%%` usa `fontFamily: 'system-ui'` ou `fontFamily: 'Segoe UI'` ou outras fontes somente para desktop. Essas fontes NÃO estão disponíveis no Chromium headless (que `mmdc` usa internamente), então o navegador volta para uma fonte serifada.

**Correção:** NÃO defina `fontFamily` (o padrão `trebuchet ms, verdana, arial, sans-serif` do Mermaid funciona perfeitamente) ou use apenas fontes universalmente disponíveis:```
%% BAD — these fonts don't exist in headless Chromium
%%{init: {'theme': 'base', 'themeVariables': {
'fontFamily': 'system-ui, -apple-system, sans-serif'
}}}%%

%% GOOD — use Mermaid defaults (don't set fontFamily at all)
%%{init: {'theme': 'base', 'themeVariables': {
'primaryColor': '#4f46e5', 'lineColor': '#94a3b8'
}}}%%

%% GOOD — if you must set a font, use web-safe ones
%%{init: {'theme': 'base', 'themeVariables': {
'fontFamily': 'trebuchet ms, verdana, arial, sans-serif'
}}}%%

```
### 26. Tema/Diretiva Init ignorada durante a renderização

**Sintoma:** Você definiu `%%{init: {'theme': 'dark', ...}}%%` em seu arquivo `.mmd`, mas o diagrama é renderizado com o tema claro padrão.

**Causa:** O script de renderização passa um arquivo de configuração com `{"theme": "default"}` via `mmdc -c`, que estava substituindo a diretiva init no diagrama.

**Correção:** Este bug foi corrigido no script de renderização — ele agora detecta `%%{init` no arquivo de entrada e NÃO passa um tema no arquivo de configuração, permitindo que a diretiva init tenha precedência total. Se você ainda tiver esse problema, verifique:

1. A diretiva `%%{init}%%` está na primeira linha do arquivo `.mmd` (sem linhas em branco antes dela)
2. Você NÃO está passando `--theme` para o script de renderização ao usar diretivas init
3. A versão do script de renderização inclui a correção de detecção `hasInitDirective`

### 27. O script de renderização falha silenciosamente com `mmdc=no`

**Sintoma:** O script de renderização reporta `Engines: mmdc=no` mesmo que `mmdc` esteja instalado em `.deps/node_modules/.bin/`.

**Causa:** O caminho do diretório da habilidade contém caracteres especiais (como parênteses em `(tooling)`) que interrompem a execução do shell em `execSync()`. O shell interpreta `(` como sintaxe de subshell e falha.

**Correção:** Este bug foi corrigido no script de renderização — todos os caminhos agora são agrupados com `shellQuote()` que usa aspas simples para proteção contra caracteres especiais. Se você ainda tiver esse problema, verifique se a função `shellQuote()` existe em `render.mjs` e é usada para todos os argumentos de caminho em chamadas `execSync()`.
```
