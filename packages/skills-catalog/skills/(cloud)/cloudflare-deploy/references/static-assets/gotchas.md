## Best Practices

### 1. Use Selective Worker-First Routing

Instead of `run_worker_first = true`, use array patterns:

```jsonc
{
  "assets": {
    "run_worker_first": [
      "/api/*", // API routes
      "/admin/*", // Admin area
      "!/admin/assets/*", // Except admin assets
    ],
  },
}
```

**Benefits:**

- Reduces Worker invocations
- Lowers costs
- Improves asset delivery performance

### 2. Leverage Navigation Request Optimization

For SPAs, use `compatibility_date = "2025-04-01"` or later:

```jsonc
{
  "compatibility_date": "2025-04-01",
  "assets": {
    "not_found_handling": "single-page-application",
  },
}
```

Navigation requests skip Worker invocation, reducing costs.

### 3. Type Safety with Bindings

Always type your environment:

```typescript
interface Env {
  ASSETS: Fetcher
}
```

## Erros Comuns

### "Ativo não encontrado"

**Causa:** O recurso não está no diretório de recursos, caminho errado ou recursos não implantados
**Solução:** verifique se o ativo existe, verifique a distinção entre maiúsculas e minúsculas do caminho e reimplante se necessário

### "Worker não invocado para ativo"

**Causa:** Ativo veiculado diretamente, `run_worker_first` não configurado
**Solução:** Configure padrões `run_worker_first` para incluir rotas de ativos (consulte configuration.md:66-106)

### "429 Muitas solicitações no nível gratuito"

**Causa:** os padrões `run_worker_first` invocam o Worker para muitas solicitações, atingindo os limites do nível gratuito (100 mil solicitações/dia)
**Solução:** use padrões mais seletivos com exclusões negativas ou faça upgrade para um plano pago

### "O posicionamento inteligente aumenta a latência"

**Causa:** `run_worker_first=true` + O posicionamento inteligente roteia todas as solicitações por meio de um único local de posicionamento inteligente
**Solução:** use padrões seletivos (sintaxe de matriz) ou desative o posicionamento inteligente para aplicativos com muitos recursos

### "Cabeçalho CF-Cache-Status não confiável"

**Causa:** O cabeçalho foi adicionado probabilisticamente por motivos de privacidade
**Solução:** Não confie no `CF-Cache-Status` para lógica de roteamento crítica. Use outros sinais (ETag, idade).

### "JWT expirou durante a implantação"

**Causa:** Grandes implantações de ativos excedem a vida útil do token JWT
**Solução:** Atualize para o Wrangler 4.34.0+ (atualização automática de token) ou reduza a contagem de ativos

### "Não é possível usar 'ativos' com 'site'"

**Causa:** A configuração herdada do `site` entra em conflito com a nova configuração do `assets`
**Solução:** Migre de `site` para `assets` (veja configuration.md). Remova a chave `site` de wrangler.jsonc.

### "Ativos não são atualizados após a implantação"

**Causa:** cache do navegador ou CDN que atende ativos antigos
**Solução:**

- Navegador de atualização total (Cmd+Shift+R / Ctrl+F5)
- Use bloqueio de cache (nomes de arquivos com hash)
- Verifique a implantação concluída: `wrangler tail`

## Limites

| Recurso/Limite              | Grátis    | Pago           | Notas                                      |
| --------------------------- | --------- | -------------- | ------------------------------------------ |
| Tamanho máximo do ativo     | 25 MiB    | 25 MiB         | Por arquivo                                |
| Ativos totais               | 20.000    | **100.000**    | Requer Wrangler 4.34.0+ (setembro de 2025) |
| Invocações de trabalhadores | 100k/dia  | 10 milhões/mês | Otimize com padrões `run_worker_first`     |
| Armazenamento de ativos     | Ilimitado | Ilimitado      | Incluído                                   |

### Requisitos de versão

| Recurso                           | Versão mínima do Wrangler                  |
| --------------------------------- | ------------------------------------------ |
| Limite de 100 mil arquivos (pago) | 4.34.0                                     |
| Plug-in Vite                      | 4.0.0 + @cloudflare/vite-plugin 1.0.0      |
| Otimização de navegação           | 4.0.0 + data_compatibilidade: "01/04/2025" |

## Dicas de desempenho

### 1. Use nomes de arquivos com hash

Habilite o cache de longo prazo com nomes de arquivos com hash de conteúdo:```
app.a3b2c1d4.js
styles.e5f6g7h8.css

````

Most bundlers (Vite, Webpack, Parcel) do this automatically.

### 2. Minimize Worker Invocations

Serve assets directly when possible:

```jsonc
{
  "assets": {
    // Only invoke Worker for dynamic routes
    "run_worker_first": ["/api/*", "/auth/*"],
  },
}
````

### 3. Leverage Browser Cache

Set appropriate `Cache-Control` headers:

```typescript
// Versioned assets
'Cache-Control': 'public, max-age=31536000, immutable'

// HTML (revalidate often)
'Cache-Control': 'public, max-age=0, must-revalidate'
```

See patterns.md:169-189 for implementation.

### 4. Use .assetsignore

Reduce upload time by excluding unnecessary files:

```
*.map
*.md
.DS_Store
node_modules/
```

See configuration.md:107-126 for details.
