---
name: perf-lighthouse
description: 'Rode auditorias Lighthouse localmente via CLI ou API Node, interprete relatórios e defina budgets de performance. Use quando medir performance do site, entender scores Lighthouse, configurar budgets ou integrar auditorias em CI. Aciona em lighthouse, rodar lighthouse, score lighthouse, auditoria de performance, budget de performance. NÃO use para corrigir problemas pontuais de performance (use perf-web-optimization ou core-web-vitals) ou otimização específica de Astro (use perf-astro).'
---

# Auditorias Lighthouse

## Início rápido com CLI

```bash
# Instalar
npm install -g lighthouse

# Auditoria básica
lighthouse https://example.com

# Só performance mobile (mais rápido)
lighthouse https://example.com --preset=perf --form-factor=mobile

# Saída JSON para parse
lighthouse https://example.com --output=json --output-path=./report.json

# Relatório HTML
lighthouse https://example.com --output=html --output-path=./report.html
```

## Flags comuns

```bash
--preset=perf           # Só performance (pula acessibilidade, SEO, etc.)
--form-factor=mobile    # Emulação mobile (padrão)
--form-factor=desktop   # Desktop
--throttling-method=devtools  # Throttling mais fiel
--only-categories=performance,accessibility  # Categorias específicas
--chrome-flags="--headless"   # Chrome headless
```

## Budgets de performance

Crie `budget.json`:

```json
[
  {
    "resourceSizes": [
      { "resourceType": "script", "budget": 200 },
      { "resourceType": "image", "budget": 300 },
      { "resourceType": "stylesheet", "budget": 50 },
      { "resourceType": "total", "budget": 500 }
    ],
    "resourceCounts": [{ "resourceType": "third-party", "budget": 5 }],
    "timings": [
      { "metric": "interactive", "budget": 3000 },
      { "metric": "first-contentful-paint", "budget": 1500 },
      { "metric": "largest-contentful-paint", "budget": 2500 }
    ]
  }
]
```

Rodar com budget:

```bash
lighthouse https://example.com --budget-path=./budget.json
```

## API Node

```javascript
import lighthouse from 'lighthouse'
import * as chromeLauncher from 'chrome-launcher'

async function runAudit(url) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] })

  const result = await lighthouse(url, {
    port: chrome.port,
    onlyCategories: ['performance'],
    formFactor: 'mobile',
    throttling: {
      cpuSlowdownMultiplier: 4,
    },
  })

  await chrome.kill()

  const { performance } = result.lhr.categories
  const { 'largest-contentful-paint': lcp } = result.lhr.audits

  return {
    score: Math.round(performance.score * 100),
    lcp: lcp.numericValue,
  }
}
```

## GitHub Actions

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse

on:
  pull_request:
  push:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build site
        run: npm ci && npm run build

      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v11
        with:
          urls: |
            http://localhost:3000
            http://localhost:3000/about
          budgetPath: ./budget.json
          uploadArtifacts: true
          temporaryPublicStorage: true
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

## Lighthouse CI (LHCI)

Para CI completo com histórico:

```bash
# Instalar
npm install -g @lhci/cli

# Inicializar config
lhci wizard
```

Cria `lighthouserc.js`:

```javascript
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/', 'http://localhost:3000/about'],
      startServerCommand: 'npm run start',
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1500 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
      },
    },
    upload: {
      target: 'temporary-public-storage', // ou 'lhci' self-hosted
    },
  },
}
```

Executar:

```bash
lhci autorun
```

## Parsear relatório JSON

```javascript
import fs from 'fs'

const report = JSON.parse(fs.readFileSync('./report.json'))

// Scores gerais (0-1, multiplique por 100 para %)
const scores = {
  performance: report.categories.performance.score,
  accessibility: report.categories.accessibility.score,
  seo: report.categories.seo.score,
}

// Core Web Vitals
const vitals = {
  lcp: report.audits['largest-contentful-paint'].numericValue,
  cls: report.audits['cumulative-layout-shift'].numericValue,
  fcp: report.audits['first-contentful-paint'].numericValue,
  tbt: report.audits['total-blocking-time'].numericValue,
}

// Auditorias que falharam
const failed = Object.values(report.audits)
  .filter((a) => a.score !== null && a.score < 0.9)
  .map((a) => ({ id: a.id, score: a.score, title: a.title }))
```

## Comparar builds

```bash
# Salvar baseline
lighthouse https://prod.example.com --output=json --output-path=baseline.json

# Rodar no PR
lighthouse https://preview.example.com --output=json --output-path=pr.json

# Comparar (script customizado)
node compare-reports.js baseline.json pr.json
```

Script simples de comparação:

```javascript
const baseline = JSON.parse(fs.readFileSync(process.argv[2]))
const pr = JSON.parse(fs.readFileSync(process.argv[3]))

const metrics = ['largest-contentful-paint', 'cumulative-layout-shift', 'total-blocking-time']

metrics.forEach((metric) => {
  const base = baseline.audits[metric].numericValue
  const current = pr.audits[metric].numericValue
  const diff = (((current - base) / base) * 100).toFixed(1)
  const emoji = current <= base ? '✅' : '❌'
  console.log(`${emoji} ${metric}: ${diff}% (${base.toFixed(0)} → ${current.toFixed(0)})`)
})
```

## Solução de problemas

| Problema              | Solução                                              |
| --------------------- | ---------------------------------------------------- |
| Scores inconsistentes | Várias execuções (`--number-of-runs=3`), use mediana |
| Chrome não encontrado | Defina env `CHROME_PATH`                             |
| Timeouts              | Aumente com `--max-wait-for-load=60000`              |
| Autenticação          | Use `--extra-headers` ou script Puppeteer            |
