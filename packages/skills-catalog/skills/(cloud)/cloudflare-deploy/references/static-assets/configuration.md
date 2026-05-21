## Configuration

### Basic Setup

Minimal configuration requires only `assets.directory`:

```jsonc
{
  "name": "my-worker",
  "compatibility_date": "2025-01-01", // Use current date for new projects
  "assets": {
    "directory": "./dist",
  },
}
```

### Full Configuration Options

```jsonc
{
  "name": "my-worker",
  "main": "src/index.ts",
  "compatibility_date": "2025-01-01",
  "assets": {
    "directory": "./dist",
    "binding": "ASSETS",
    "not_found_handling": "single-page-application",
    "html_handling": "auto-trailing-slash",
    "run_worker_first": ["/api/*", "!/api/docs/*"],
  },
}
```

**Chaves de configuração:**

- `directory` (string, obrigatório): Caminho para a pasta de ativos (por exemplo, `./dist`, `./public`, `./build`)
- `binding` (string, opcional): Nome para acessar ativos no código Worker (por exemplo, `env.ASSETS`). Padrão: `"ATIVOS"`
- `not_found_handling` (string, opcional): Comportamento quando o ativo não é encontrado
- `"single-page-application"`: veicula `/index.html` para caminhos que não sejam de ativos (padrão para SPAs)
- `"404-page"`: veicula `/404.html` se presente, caso contrário 404
- `"none"`: Retorna 404 para ativos perdidos
- `html_handling` (string, opcional): comportamento da barra final do URL
- `run_worker_first` (boolean | string[], opcional): Rotas que invocam o Worker antes de verificar os ativos

### Modos not_found_handling

| Modo                           | Comportamento                                                  | Caso de uso                                      |
| ------------------------------ | -------------------------------------------------------------- | ------------------------------------------------ |
| `"aplicativo de página única"` | Servir `/index.html` para solicitações que não sejam de ativos | React, Vue, SPAs Angulares                       |
| `"404 páginas"`                | Servir `/404.html` se existir, caso contrário 404              | Sites estáticos com página de erro personalizada |
| `"nenhum"`                     | Retornar 404 para ativos perdidos                              | Roteamento API-first ou personalizado            |

### html_handling Modos

Controla o comportamento da barra final para arquivos HTML:

| Modo                    | `/página`                                                | `/página/`                  | Caso de uso                        |
| ----------------------- | -------------------------------------------------------- | --------------------------- | ---------------------------------- |
| `"barra automática"`    | Redirecionar para `/page/` se `/page/index.html` existir | Servir `/page/index.html`   | Padrão, compatível com SEO         |
| `"forçar barra final"`  | Sempre redirecione para `/page/`                         | Servir se existir           | Barras finais consistentes         |
| `"drop-trailing-slash"` | Servir se existir                                        | Redirecionar para `/página` | URLs mais limpos                   |
| `"nenhum"`              | Sem modificação                                          | Sem modificação             | Lógica de roteamento personalizada |

**Padrão:** `"barra final automática"`

### configuração run_worker_first

Controla quais solicitações invocam o Worker antes de verificar os ativos.

**Sintaxe booleana:**

```jsonc
{
  "assets": {
    "run_worker_first": true, // ALL requests invoke Worker
  },
}
```

**Array syntax (recommended):**

```jsonc
{
  "assets": {
    "run_worker_first": [
      "/api/*", // Positive pattern: match API routes
      "/admin/*", // Match admin routes
      "!/admin/assets/*", // Negative pattern: exclude admin assets
    ],
  },
}
```

**Regras de padrão:**

- Padrões Glob: `*` (qualquer caractere), `**` (qualquer segmento de caminho)
- Padrões negativos: prefixo com `!` para excluir
- Precedência: padrões negativos substituem padrões positivos
- Padrão: `false` (ativos veiculados diretamente)

**Orientação para decisão:**

- Use `true` para aplicativos API-first (poucos ativos estáticos)
- Use padrões de array para aplicativos híbridos (APIs + ativos estáticos)
- Use `false` para sites estáticos (rotas dinâmicas mínimas)

Arquivo ### .assetsignore

Exclua arquivos do upload usando `.assetsignore` (mesma sintaxe de `.gitignore`):```

# .assetsignore

\_worker.js
_.map
_.md
node_modules/
.git/

````
**Padrões comuns:**

- `_worker.js` - Excluir código do trabalhador dos ativos
- `*.map` - Excluir mapas de origem
- `*.md` - Excluir arquivos markdown
- Artefatos de desenvolvimento

### Integração do plug-in Vite

Para projetos baseados em Vite, use `@cloudflare/vite-plugin`:```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { cloudflare } from '@cloudflare/vite-plugin'

export default defineConfig({
  plugins: [
    cloudflare({
      assets: {
        directory: './dist',
        binding: 'ASSETS',
      },
    }),
  ],
})
````

**Recursos:**

- Detecção automática de ativos durante o desenvolvimento
- Substituição de módulo a quente para ativos
- Integração de construção de produção
- Requer: Wrangler 4.0.0+, `@cloudflare/vite-plugin` 1.0.0+

### Principais datas de compatibilidade

| Data         | Recurso                                | Impacto                                                     |
| ------------ | -------------------------------------- | ----------------------------------------------------------- |
| `2025-04-01` | Otimização de solicitação de navegação | SPAs dispensam trabalhador para navegação, reduzindo custos |

Use a data atual para novos projetos. Consulte [Datas de compatibilidade](https://developers.cloudflare.com/workers/configuration/compatibility-dates/) para ver a lista completa.

### Configuração específica do ambiente

Use ambientes `wrangler.jsonc` para diferentes configurações:```jsonc
{
"name": "my-worker",
"assets": { "directory": "./dist" },
"env": {
"staging": {
"assets": {
"not_found_handling": "404-page",
},
},
"production": {
"assets": {
"not_found_handling": "single-page-application",
},
},
},
}

```

Deploy with: `wrangler deploy --env staging`
```
