# Referência do Cloudflare API Shield

Orientação especializada para API Shield – conjunto abrangente de segurança de API para descoberta, proteção e monitoramento.

## Ordem de leitura

| Tarefa                         | Arquivos para ler            |
| ------------------------------ | ---------------------------- |
| Configuração inicial           | LEIA-ME → configuração.md    |
| Implementar validação JWT      | configuração.md → api.md     |
| Adicionar validação de esquema | configuração.md → padrões.md |
| Detectar ataques de API        | padrões.md → api.md          |
| Problemas de depuração         | pegadinhas.md                |

## Seleção de recursos

Que proteção você precisa?```
├─ Validate request/response structure → Schema Validation 2.0 (configuration.md)
├─ Verify auth tokens → JWT Validation (configuration.md)
├─ Client certificates → mTLS (configuration.md)
├─ Detect BOLA attacks → BOLA Detection (patterns.md)
├─ Track auth coverage → Auth Posture (patterns.md)
├─ Stop volumetric abuse → Abuse Detection (patterns.md)
└─ Discover shadow APIs → API Discovery (api.md)

```

## In This Reference

- **[configuration.md](configuration.md)** - Setup, session identifiers, rules, token/mTLS configs
- **[api.md](api.md)** - Endpoint management, discovery, validation APIs, GraphQL operations
- **[patterns.md](patterns.md)** - Common patterns, progressive rollout, OWASP mappings, workflows
- **[gotchas.md](gotchas.md)** - Troubleshooting, false positives, performance, best practices

## Quick Start

API Shield: Enterprise-grade API security (Discovery, Schema Validation 2.0, JWT, mTLS, BOLA Detection, Auth Posture). Available as Enterprise add-on with preview access.

## See Also

- [API Shield Docs](https://developers.cloudflare.com/api-shield/)
- [API Reference](https://developers.cloudflare.com/api/resources/api_gateway/)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
```
