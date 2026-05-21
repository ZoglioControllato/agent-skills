# Bot Management Configuration

## Product Tiers

**Note:** Dashboard paths differ between old and new UI:

- **New:** Security > Settings > Filter "Bot traffic"
- **Old:** Security > Bots

Both UIs access same settings.

### Bot Score Groupings (Pro/Business)

Pro/Business users see bot score groupings instead of granular 1-99 scores:

| Score | Grouping         | Meaning                        |
| ----- | ---------------- | ------------------------------ |
| 0     | Not computed     | Bot Management didn't run      |
| 1     | Automated        | Definite bot (heuristic match) |
| 2-29  | Likely automated | Probably bot (ML detection)    |
| 30-99 | Likely human     | Probably human                 |
| N/A   | Verified bot     | Allowlisted good bot           |

Enterprise plans get granular 1-99 scores for custom thresholds.

### Bot Fight Mode (Free)

- Auto-blocks definite bots (score=1), excludes verified bots by default
- JavaScript Detections always enabled, no configuration options

### Super Bot Fight Mode (Pro/Business)

```txt
Dashboard: Security > Bots > Configure
- Definitely automated: Block/Challenge
- Likely automated: Challenge/Allow
- Verified bots: Allow (recommended)
- Static resource protection: ON (may block mail clients)
- JavaScript Detections: Optional
```

### Bot Management for Enterprise

```txt
Painel: Segurança > Bots > Configurar > Atualizações automáticas: ATIVADO (recomendado)

# Modelo 1: Bloquear bots definidos
(cf.bot_management.score eq 1 e não cf.bot_management.verified_bot e não cf.bot_management.static_resource)
Ação: Bloquear

# Modelo 2: Desafie prováveis bots
(cf.bot_management.score ge 2 e cf.bot_management.score le 29 e não cf.bot_management.verified_bot e não cf.bot_management.static_resource)
Ação: Desafio Gerenciado
```

## JavaScript Detections Setup

### Enable via Dashboard

```txt
Security > Bots > Configure Bot Management > JS Detections: ON

Update CSP: script-src 'self' /cdn-cgi/challenge-platform/;
```

### Manual JS Injection (API)

```html
<script>
  function jsdOnload() {
    window.cloudflare.jsd.executeOnce({
      callback: function (result) {
        console.log('JSD:', result)
      },
    })
  }
</script>
<script src="/cdn-cgi/challenge-platform/scripts/jsd/api.js?onload=jsdOnload" async></script>
```

**Use API para**: implantação seletiva em páginas específicas
**Não combine**: alternância em toda a zona + injeção manual

### Regras WAF para JSD```txt

# NUNCA use na primeira visita à página (precisa primeiro da página HTML)

(não cf.bot_management.js_detection.passed e http.request.uri.path eq "/api/user/create" e http.request.method eq "POST" e não cf.bot_management.verified_bot)
Ação: Desafio Gerenciado (sempre use Desafio Gerenciado, não Bloquear)

````
### Limitações

- A primeira solicitação não terá dados JSD (precisa primeiro da página HTML)
- Remove ETags de respostas HTML
- Não compatível com CSP por meio de tags `<meta>`
- Endpoints Websocket não suportados
- Aplicativos móveis nativos não serão aprovados
- cookie cf_clearance: vida útil de 15 minutos, máximo de 4.096 bytes

## \_\_cf_bm Cookie

Cloudflare define o cookie `__cf_bm` para suavizar as pontuações do bot nas sessões do usuário:

- **Objetivo:** Reduz falsos positivos da volatilidade da pontuação
- **Escopo:** Por domínio, somente HTTP
- **Vida útil:** Duração da sessão
- **Privacidade:** Sem PII – apenas classificação de sessão
- **Automático:** Nenhuma configuração necessária

As pontuações do bot para visitantes repetidos consideram o histórico da sessão por meio deste cookie.

## Proteção de recursos estáticos

**Extensões de arquivo**: ico, jpg, png, jpeg, gif, css, js, tif, tiff, bmp, pict, webp, svg, svgz, class, jar, txt, csv, doc, docx, xls, xlsx, pdf, ps, pls, ppt, pptx, ttf, otf, woff, woff2, eot, eps, ejs, swf, torrent, midi, mid, m3u8, m4a, mp3, ogg, ts
**Mais**: caminho `/.well-known/` (todos os arquivos)```txt
# Exclude static resources from bot rules
(cf.bot_management.score lt 30 and not cf.bot_management.static_resource)
````

**WARNING**: May block mail clients fetching static images

## JA3/JA4 Fingerprinting (Enterprise)

```txt
# Block specific attack fingerprint
(cf.bot_management.ja3_hash eq "8b8e3d5e3e8b3d5e")

# Allow mobile app by fingerprint
(cf.bot_management.ja4 eq "your_mobile_app_fingerprint")
```

Only available for HTTPS/TLS traffic. Missing for Worker-routed traffic or HTTP requests.

## Verified Bot Categories

```txt
# Allow search engines only
(cf.verified_bot_category eq "Search Engine Crawler")

# Block AI crawlers
(cf.verified_bot_category eq "AI Crawler")
Action: Block

# Or use dashboard: Security > Settings > Bot Management > Block AI Bots
```

| Categoria                   | Valor da sequência                  | Exemplo                                |
| --------------------------- | ----------------------------------- | -------------------------------------- |
| Rastreador de IA            | `Rastreador de IA`                  | GPTBot, Claude-Web                     |
| Assistente de IA            | `Assistente de IA`                  | Usuário de perplexidade, DuckAssistBot |
| Pesquisa de IA              | `Pesquisa de IA`                    | OAI-SearchBot                          |
| Acessibilidade              | `Acessibilidade`                    | Bot Web Acessível                      |
| Pesquisa Acadêmica          | `Pesquisa Acadêmica`                | Biblioteca do Congresso                |
| Publicidade e Marketing     | `Publicidade e Marketing`           | Google Adsbot                          |
| Agregador                   | `Agregador`                         | Pinterest, de fato                     |
| Arquivador                  | `Arquivador`                        | Arquivo da Internet, CommonCrawl       |
| Coletor de feeds            | `Feed Coletor`                      | Atualizadores RSS/Podcast              |
| Monitoramento e Análise     | `Monitoramento e Análise`           | Monitores de tempo de atividade        |
| Visualização da página      | `Visualização da página`            | Visualização do link do Facebook/Slack |
| SEO                         | `Otimização de Mecanismos de Busca` | Farol do Google                        |
| Segurança                   | `Segurança`                         | Verificadores de vulnerabilidade       |
| Marketing em mídias sociais | `Marketing em mídias sociais`       | Relógio de marca                       |
| Webhooks                    | `Webhooks`                          | Processadores de pagamentos            |
| Outros                      | `Outro`                             | Bots sem categoria                     |

## Melhores práticas

- **Atualizações automáticas de ML**: habilite no Enterprise para os modelos mais recentes
- **Comece com Desafio Gerenciado**: teste antes de bloquear
- **Sempre excluir bots verificados**: Use `not cf.bot_management.verified_bot`
- **Proxies corporativos isentos**: Para tráfego B2B via `cf.bot_management.corporate_proxy`
- **Usar exceção de recurso estático**: melhora o desempenho e reduz a sobrecarga
