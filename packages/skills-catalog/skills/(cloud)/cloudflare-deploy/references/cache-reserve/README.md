# Reserva de Cache Cloudflare

**Armazenamento em cache persistente baseado em R2 para retenção de conteúdo de longo prazo**

## Integração com escudo inteligente

A Reserva de Cache faz parte do **Smart Shield**, o pacote abrangente de segurança e desempenho da Cloudflare:

- **Nível Smart Shield Advanced**: inclui armazenamento de reserva de cache de 2 TB
- **Compra independente**: Disponível separadamente se não estiver usando o Smart Shield
- **Migração**: clientes autônomos existentes podem migrar para pacotes Smart Shield

**Decisão**: Já usa o Smart Shield Advanced? A Reserva de Cache está incluída. Caso contrário, avalie a compra independente versus a atualização do Smart Shield.

## Visão geral

Cache Reserve é a camada de armazenamento de cache persistente e em grande escala da Cloudflare construída em R2. Ele atua como o cache de nível superior definitivo, armazenando conteúdo armazenável em cache por longos períodos (mais de 30 dias) para maximizar os acessos ao cache, reduzir taxas de saída de origem e proteger as origens de solicitações repetidas de conteúdo de cauda longa.

## Conceitos Básicos

### O que é Reserva de Cache?

- **Camada de armazenamento persistente**: construída em R2, fica acima da hierarquia de cache em camadas
- **Retenção de longo prazo**: retenção padrão de 30 dias, estendida em cada acesso
- **Operação automática**: Funciona perfeitamente com CDN existente, sem necessidade de alterações de código
- **Blindagem de origem**: reduz drasticamente a saída de origem ao veicular conteúdo em cache por mais tempo
- **Preços baseados no uso**: pague apenas pelo armazenamento + operações de leitura/gravação

### Hierarquia de cache```

Visitor Request
↓
Lower-Tier Cache (closest to visitor)
↓ (on miss)
Upper-Tier Cache (closest to origin)
↓ (on miss)
Cache Reserve (R2 persistent storage)
↓ (on miss)
Origin Server

````
### Como funciona

1. **On cache miss**: conteúdo obtido da origem �� gravado na reserva de cache + caches de borda simultaneamente
2. **Remoção na borda**: o conteúdo pode ser removido do cache de borda, mas permanece na Reserva de Cache
3. **Na solicitação subsequente**: Se o cache de borda falhar, mas a reserva de cache for atingida → conteúdo restaurado para caches de borda
4. **Retenção**: Os ativos permanecem na Reserva de Cache por 30 dias desde o último acesso (configurável via TTL)

## Quando usar a reserva de cache```
Precisa de cache persistente?
├─ Altos custos de saída de origem → Reserva de Cache ✓
├─ Conteúdo de cauda longa (arquivos, bibliotecas de mídia) → Reserva de cache ✓
├─ Já usando Smart Shield Advanced → Incluído! ✓
├─ Streaming de vídeo com busca (solicitações de intervalo) → ✗ Não suportado
├─ Conteúdo dinâmico/personalizado → ✗ Use apenas cache de borda
├─ Precisa de controle de cache por solicitação dos Trabalhadores → ✗ Use R2 diretamente
└─ Conteúdo atualizado com frequência (<10 horas de vida) → ✗ Não elegível
````

## Elegibilidade de ativos

A Reserva de Cache armazena apenas ativos que atendem a **TODOS** critérios:

- Armazenável em cache de acordo com as regras padrão da Cloudflare
- TTL mínimo de 10 horas (36.000 segundos)
- Cabeçalho `Content-Length` presente
- Somente arquivos originais (não imagens transformadas)

### Lista de verificação de elegibilidade

Use esta lista de verificação para verificar se um ativo é elegível:

- [ ] Zona tem Reserva de Cache habilitada
- [] A zona tem cache em camadas ativado (obrigatório)
- [] TTL do ativo ≥ 10 horas (36.000 segundos)
- [] Cabeçalho `Content-Length` presente na resposta de origem
- [] Sem cabeçalho `Set-Cookie` (ou usa diretiva privada)
- [] O cabeçalho `Vary` NÃO é `*` (pode ser `Accept-Encoding`)
- [] Não é uma variante de transformação de imagem (imagens originais OK)
- [] Não é uma solicitação de intervalo (sem suporte HTTP 206)
- [] Não é solicitação com proxy O2O (laranja para laranja)

**Todas as caixas devem ser marcadas para elegibilidade da Reserva de Cache.**

### Não elegível

- Ativos com TTL < 10 horas
- Respostas sem cabeçalho `Content-Length`
- Variantes de transformação de imagem (imagens originais são elegíveis)
- Respostas com cabeçalhos `Set-Cookie`
- Respostas com cabeçalho `Vary: *`
- Ativos de buckets públicos R2 na mesma zona
- Solicitações de configuração O2O (laranja para laranja)
- **Solicitações de intervalo** (busca de vídeo, downloads parciais de conteúdo)

## Início rápido```bash

# Enable via Dashboard

https://dash.cloudflare.com/caching/cache-reserve

# Click "Enable Storage Sync" or "Purchase" button

````

**Prerequisites:**

- Paid Cache Reserve plan or Smart Shield Advanced required
- Tiered Cache required for optimal performance

## Essential Commands

```bash
# Check Cache Reserve status
curl -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/cache/cache_reserve" \
  -H "Authorization: Bearer $API_TOKEN"

# Enable Cache Reserve
curl -X PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/cache/cache_reserve" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"value": "on"}'

# Check asset cache status
curl -I https://example.com/asset.jpg | grep -i cache
````

## Nesta referência

| Tarefa                                                       | Arquivos                                                  |
| ------------------------------------------------------------ | --------------------------------------------------------- |
| Avalie se a Reserva de Cache se adapta ao seu caso de uso    | README.md (este arquivo)                                  |
| Habilite a reserva de cache para sua zona                    | README.md + [configuration.md](./configuration.md)        |
| Use com trabalhadores (entenda as limitações)                | [api.md](./api.md)                                        |
| Configuração via SDKs ou IaC (TypeScript, Python, Terraform) | [configuração.md](./configuration.md)                     |
| Otimize custos e depure problemas                            | [padrões.md](./patterns.md) + [gotchas.md](./gotchas.md)  |
| Entenda a elegibilidade e solucione problemas                | [gotchas.md](./gotchas.md) → [patterns.md](./patterns.md) |

**Arquivos:**

- [configuration.md](./configuration.md) - Configuração, API, SDKs e regras de cache
- [api.md](./api.md) - Limpeza, monitoramento, integração de trabalhadores
- [patterns.md](./patterns.md) - Melhores práticas, otimização de custos, depuração
- [gotchas.md](./gotchas.md) - Problemas comuns, limitações, solução de problemas

## Veja também

- [r2](../r2/) - Reserva de cache construída no armazenamento R2
- [workers](../workers/) - Integração de trabalhadores com API Cache
