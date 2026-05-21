# Tempo de execução do Workerd

Tempo de execução JS/Wasm baseado em V8 alimentando Cloudflare Workers. Use como servidor de aplicativos, ferramenta de desenvolvimento ou proxy HTTP.

## ⚠️ AVISO IMPORTANTE DE SEGURANÇA

**workerd NÃO é uma sandbox reforçada.** Não execute código não confiável. Ele foi projetado para implantar SEU código localmente/auto-hospedado, não SaaS multilocatário. A produção da Cloudflare adiciona camadas de segurança não presentes no trabalho de código aberto.

## Árvore de decisão: quando usar o quê

**95% dos usuários:** Use o Wrangler

- Desenvolvimento local: `wrangler dev` (usa o workerd internamente)
- Implantação: `wrangler deploy` (implanta no Cloudflare)
- Tipos: `wrangler types` (gera tipos TypeScript)

**Use o trabalhador bruto diretamente somente se:**

- Tempo de execução de trabalhadores auto-hospedados em produção
- Incorporação de tempo de execução em aplicativo C++
- Infraestrutura de ferramentas/testes personalizados
- Depuração de comportamento específico do trabalhador

**Nunca use o trabalhador para:**

- Execução de código não confiável/enviado pelo usuário
- Isolamento multilocatário (não reforçado)
- Produção sem camadas de segurança adicionais

## Principais recursos

- **Baseado em padrões**: Fetch API, Web Crypto, Streams, WebSocket
- **Nanoserviços**: vinculações de serviço com desempenho de chamada local
- **Segurança de capacidade**: ligações explícitas impedem SSRF
- **Compatível com versões anteriores**: Versão = data máxima de compatibilidade suportada

## Arquitetura```

Config (workerd.capnp)
├── Services (workers/endpoints)
├── Sockets (HTTP/HTTPS listeners)
└── Extensions (global capabilities)

````

## Quick Start

```bash
workerd serve config.capnp
workerd compile config.capnp myConfig -o binary
workerd test config.capnp
````

## Suporte à plataforma e status beta

| Plataforma      | Estado       | Notas                                   |
| --------------- | ------------ | --------------------------------------- |
| Linux (x64)     | Estável      | Plataforma primária                     |
| macOS (x64/ARM) | Estável      | Suporte total                           |
| Janelas         | Beta         | Use WSL2 para obter melhores resultados |
| Linux (ARM64)   | Experimental | Testes limitados                        |

O trabalhador está em **desenvolvimento ativo**. Quebrando mudanças possíveis. Versões de pinos em produção.

## Conceitos Básicos

- **Serviço**: endpoint nomeado (trabalhador/rede/disco/externo)
- **Vinculação**: acesso a recursos baseado em capacidade (KV/DO/R2/serviços)
- **Data de compatibilidade**: Porta de recursos (sempre definida!)
- **Módulos**: módulos ES (recomendado) ou sintaxe do service worker

## Ordem de leitura (divulgação progressiva)

**Comece aqui:**

1. Este README (visão geral, árvore de decisão)
2. [patterns.md](./patterns.md) - Fluxos de trabalho comuns, exemplos de estrutura

**Quando você precisar de detalhes:** 3. [configuration.md](./configuration.md) - Formato de configuração, serviços, ligações 4. [api.md](./api.md) - APIs de tempo de execução, tipos TypeScript 5. [gotchas.md](./gotchas.md) - Erros comuns, depuração

## Referências relacionadas

- [workers](../workers/) - Documentação da API de tempo de execução de trabalhadores
- [miniflare](../miniflare/) - Ferramenta de teste construída em Workerd
- [wrangler](../wrangler/) - CLI que usa trabalhador para desenvolvimento local
