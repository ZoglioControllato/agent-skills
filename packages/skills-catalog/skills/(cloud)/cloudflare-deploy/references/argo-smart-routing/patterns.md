# Padrões de Integração

## Habilitar Argo + cache em camadas

```typescript
async function enableOptimalPerformance(client: Cloudflare, zoneId: string) {
  await Promise.all([
    client.argo.smartRouting.edit({ zone_id: zoneId, value: 'on' }),
    client.argo.tieredCaching.edit({ zone_id: zoneId, value: 'on' }),
  ])
}
```

**Fluxo:** Visitante → Edge (Nível Inferior) → [Perda de Cache] → Camada Superior → [Perda de Cache + Argo] → Origem

**Impacto:** Argo ~30% de redução de latência + Tiered Cache 50-80% de descarregamento de origem

## Análise de uso (GraphQL)

```graphql
query ArgoAnalytics($zoneTag: string!) {
  viewer {
    zones(filter: { zoneTag: $zoneTag }) {
      httpRequestsAdaptiveGroups(limit: 1000) {
        sum {
          argoBytes
          bytes
        }
      }
    }
  }
}
```

**Faturamento:** ~$0,10/GB. Tráfego mitigado por DDoS e bloqueado por WAF NÃO é cobrado.

## Integração TCP do espectro

Habilite o Argo para tráfego não HTTP (bancos de dados, servidores de jogos, IoT):

```typescript
// Update existing app
await client.spectrum.apps.update(appId, { zone_id: zoneId, argo_smart_routing: true })

// Create new app with Argo
await client.spectrum.apps.create({
  zone_id: zoneId,
  dns: { type: 'CNAME', name: 'tcp.example.com' },
  origin_direct: ['tcp://origin.example.com:3306'],
  protocol: 'tcp/3306',
  argo_smart_routing: true,
})
```

**Casos de uso:** MySQL/PostgreSQL (3306/5432), servidores de jogos, MQTT (1883), SSH (22)

## Validação pré-voo

```typescript
async function validateArgoEligibility(client: Cloudflare, zoneId: string) {
  const status = await client.argo.smartRouting.get({ zone_id: zoneId })
  const zone = await client.zones.get({ zone_id: zoneId })

  const issues: string[] = []
  if (!status.editable) issues.push('Zone not editable')
  if (['free', 'pro'].includes(zone.plan.legacy_id)) issues.push('Requires Business+ plan')
  if (zone.status !== 'active') issues.push('Zone not active')

  return { canEnable: issues.length === 0, issues }
}
```

##Verificação pós-ativação

```typescript
async function verifyArgoEnabled(client: Cloudflare, zoneId: string): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 2000)) // Wait for propagation
  const status = await client.argo.smartRouting.get({ zone_id: zoneId })
  return status.value === 'on'
}
```

##Padrão de configuração completa

```typescript
async function setupArgo(client: Cloudflare, zoneId: string) {
  // 1. Validate
  const { canEnable, issues } = await validateArgoEligibility(client, zoneId)
  if (!canEnable) throw new Error(issues.join(', '))

  // 2. Enable both features
  await Promise.all([
    client.argo.smartRouting.edit({ zone_id: zoneId, value: 'on' }),
    client.argo.tieredCaching.edit({ zone_id: zoneId, value: 'on' }),
  ])

  // 3. Verify
  const [argo, cache] = await Promise.all([
    client.argo.smartRouting.get({ zone_id: zoneId }),
    client.argo.tieredCaching.get({ zone_id: zoneId }),
  ])

  return { argo: argo.value === 'on', tieredCache: cache.value === 'on' }
}
```

**Quando combinar:** Sites de alto tráfego (>1 TB/mês), usuários globais, conteúdo armazenável em cache.
