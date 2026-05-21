# Conectividade VPC de trabalhadores

Conecte os trabalhadores da Cloudflare a redes privadas e infraestrutura interna usando soquetes TCP.

## Visão geral

A conectividade Workers VPC permite conexões TCP de saída de Workers para recursos privados na AWS, Azure, GCP, datacenters locais ou qualquer rede privada. Isso é conseguido por meio da **API TCP Sockets** (`cloudflare:sockets`), que fornece acesso de rede de baixo nível para protocolos e serviços personalizados.

**Principais capacidades:**

- Conexões TCP diretas para IPs privados e nomes de host
- Suporte TLS/StartTLS para conexões criptografadas
- Integração com Cloudflare Tunnel para acesso seguro à rede privada
- Controle total sobre protocolos de conexão (protocolos de banco de dados, SSH, MQTT, TCP personalizado)

**Observação:** Esta referência documenta a API TCP Sockets. Para o produto Workers VPC Services mais recente (vinculações de serviço somente HTTP com proteção SSRF integrada), consulte a documentação separada, quando disponível. Os serviços VPC estão atualmente em versão beta (2025+).

## Decisão Rápida: Qual Tecnologia?

Precisa de conectividade de rede privada dos Trabalhadores?

| Requisito                                                | Usar                                                             | Por que                                      |
| -------------------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------- |
| APIs HTTP/HTTPS em rede privada                          | Serviços VPC (beta, documentos separados)                        | Vinculações declarativas e seguras para SSRF |
| Bancos de dados PostgreSQL/MySQL                         | [Hiperdrive](../hiperdrive/)                                     | Pool de conexões, cache, otimizado           |
| Protocolos TCP personalizados (SSH, MQTT, proprietários) | **Soquetes TCP (este documento)**                                | Controle total de protocolo                  |
| HTTP simples com menor latência                          | Soquetes TCP + [Posicionamento Inteligente](../smart-placement/) | Otimização manual                            |
| Expor no local à Internet (entrada)                      | [Túnel Cloudflare](../tunnel/)                                   | Não específico do trabalhador                |

## Quando usar soquetes TCP

**Use soquetes TCP quando precisar:**

- ✅ Controle direto sobre protocolos de transmissão (por exemplo, protocolo de transmissão Postgres, SSH, Redis RESP)
- ✅ Protocolos não HTTP (MQTT, SMTP, protocolos binários personalizados)
- ✅ StartTLS ou negociação TLS personalizada
- ✅ Streaming de dados binários por TCP

**Não use soquetes TCP quando:**

- ❌ Você só precisa de HTTP/HTTPS (use `fetch()` ou serviços VPC)
- ❌ Você precisa de PostgreSQL/MySQL (use Hyperdrive para pooling)
- ❌ Você precisa do WebSocket (use Workers WebSocket nativos)

## Início rápido```typescript

import { connect } from 'cloudflare:sockets'

export default {
async fetch(req: Request): Promise<Response> {
// Connect to private service
const socket = connect({ hostname: 'db.internal.company.net', port: 5432 }, { secureTransport: 'on' })

    try {
      await socket.opened // Wait for connection

      const writer = socket.writable.getWriter()
      await writer.write(new TextEncoder().encode('QUERY\r\n'))
      await writer.close()

      const reader = socket.readable.getReader()
      const { value } = await reader.read()

      return new Response(value)
    } finally {
      await socket.close()
    }

},
}

```

## Architecture Pattern: Workers + Tunnel

Most private network connectivity combines TCP Sockets with Cloudflare Tunnel:

```

┌─────────┐ ┌─────────────┐ ┌──────────────┐ ┌─────────────┐
│ Worker │────▶│ TCP Socket │────▶│ Tunnel │────▶│ Private │
│ │ │ (this API) │ │ (cloudflared)│ │ Network │
└─────────┘ └─────────────┘ └──────────────┘ └─────────────┘

```
1. Worker abre soquete TCP para nome de host do Tunnel
2. Rotas de endpoint do túnel para IP privado
3. A resposta flui de volta através do túnel para o trabalhador

Consulte [configuration.md](./configuration.md) para obter detalhes de configuração do túnel.

## Ordem de leitura

1. **Comece aqui (README.md)** - Visão geral e guia de decisão
2. **[api.md](./api.md)** - Interface de soquete, tipos, métodos
3. **[configuration.md](./configuration.md)** - Configuração do Wrangler, integração do túnel
4. **[patterns.md](./patterns.md)** - Exemplos do mundo real (bancos de dados, protocolos, tratamento de erros)
5. **[gotchas.md](./gotchas.md)** - Limites, portas bloqueadas, erros comuns

## Limites principais

| Limite | Valor |
| ---------------------------------- | ----------------------------------- |
| Máximo de soquetes simultâneos por solicitação | 6 |
| Destinos bloqueados | IPs Cloudflare, localhost, porta 25 |
| Requisito de escopo | Deve criar no manipulador (não global) |

Consulte [gotchas.md](./gotchas.md) para limites completos e solução de problemas.

## Melhores práticas

1. **Sempre feche os soquetes** - Use os blocos try/finally
2. **Validar destinos** - Prevenir SSRF colocando hosts na lista de permissões
3. **Use Hyperdrive para bancos de dados** - Melhor desempenho que TCP bruto
4. **Prefira fetch() para HTTP** - Use TCP somente quando necessário
5. **Combine com Smart Placement** – Reduza a latência para redes privadas

## Tecnologias Relacionadas

- **[Hyperdrive](../hyperdrive/)** - PostgreSQL/MySQL com pool de conexões
- **[Túnel Cloudflare](../tunnel/)** - Acesso seguro à rede privada
- **[Smart Placement](../smart-placement/)** - Localize automaticamente trabalhadores próximos aos back-ends
- **Serviços VPC (beta)** - Vinculações de serviço somente HTTP com proteção SSRF (documentos separados)

## Referência

- [Documentação da API de soquetes TCP](https://developers.cloudflare.com/workers/runtime-apis/tcp-sockets/)
- [Guia de conexão com bancos de dados](https://developers.cloudflare.com/workers/tutorials/connect-to-postgres/)
- [Configuração do túnel Cloudflare](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)
```
