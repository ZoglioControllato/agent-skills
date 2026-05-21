# React Best Practices

Repositório estruturado para criar e manter boas práticas em React voltadas para agentes e LLMs — localização em português brasileiro pelo ecossistema **Controllato Club**.

## Estrutura

- `rules/` — Arquivo individual por regra
  - `_sections.md` — Metadados das seções (títulos, impactos, descrições)
  - `_template.md` — Modelo para novas regras
  - `area-description.md` — Arquivos de regra
- `src/` — Scripts de build e utilitários
- `metadata.json` — Metadados do documento (versão, organização, resumo)
- __`AGENTS.md`__ — Saída compilada (gerada)
- __`test-cases.json`__ — Casos de teste para avaliação por LLM (gerado)

## Primeiros passos

1. Instalar dependências:
   ```bash
   pnpm install
   ```

2. Gerar `AGENTS.md` a partir das regras:
   ```bash
   pnpm build
   ```

3. Validar os arquivos de regra:
   ```bash
   pnpm validate
   ```

4. Extrair casos de teste:
   ```bash
   pnpm extract-tests
   ```

## Criar uma nova regra

1. Copiar `rules/_template.md` para `rules/area-description.md`.
2. Escolher o prefixo de área:
   - `async-` — Eliminar cascatas (seção 1)
   - `bundle-` — Otimização de bundle (seção 2)
   - `server-` — Performance no servidor (seção 3)
   - `client-` — Busca de dados no cliente (seção 4)
   - `rerender-` — Otimização de re-render (seção 5)
   - `rendering-` — Performance de renderização (seção 6)
   - `js-` — Performance em JavaScript (seção 7)
   - `advanced-` — Padrões avançados (seção 8)
3. Preencher o frontmatter e o corpo da regra.
4. Incluir exemplos claros (ruim vs. bom) com breve justificativa.
5. Executar `pnpm build` para regenerar `AGENTS.md` e `test-cases.json`.

## Modelo do arquivo de regra

Use sempre `rules/_template.md` como ponto de partida: há frontmatter YAML (`title`, `impact`, `impactDescription`, `tags`), título `##` alinhado ao `title`, parágrafo introdutório, blocos **Incorreto** / **Correto** com cercas de código, e `Referência:` ao final quando fizer sentido.

## Convenção de nomes

- Arquivos com `_` são especiais (excluídos do build quando aplicável).
- Regras: `area-description.md` (por exemplo `async-parallel.md`).
- A seção é inferida pelo prefixo do nome do arquivo.
- As regras são ordenadas por título dentro de cada seção.
- IDs como 1.1, 1.2 são atribuídos no build quando houver compilador configurado.

## Níveis de impacto (`impact`)

Valores canônicos (inglês) usados nos arquivos de regra:

- `CRITICAL` — maior prioridade, ganhos muito grandes
- `HIGH` — ganhos significativos
- `MEDIUM-HIGH` — ganhos entre moderado e alto
- `MEDIUM` — ganhos moderados
- `LOW-MEDIUM` — ganhos entre baixo e moderado
- `LOW` — melhorias incrementais

## Scripts

- `pnpm build` — Compila regras em `AGENTS.md` (quando o pacote/build estiver disponível neste subtree).
- `pnpm validate` — Valida todos os arquivos de regra.
- `pnpm extract-tests` — Extrai casos de teste para avaliação por LLM.
- `pnpm dev` — Build e validação.

## Contribuir

1. Prefixo correto conforme a seção.
2. Seguir `_template.md` e metadados de `_sections.md`.
3. Exemplos “ruim / bom” com explicações curtas.
4. Tags coerentes.
5. Rodar build/validate onde existir no projeto.
6. A ordenação alfabética por título costuma dispensar gestão manual de numeração.

## Créditos

Original criado por [@shuding](https://x.com/shuding) na [Vercel](https://vercel.com). Localização mantida pela comunidade **Controllato Club**.
