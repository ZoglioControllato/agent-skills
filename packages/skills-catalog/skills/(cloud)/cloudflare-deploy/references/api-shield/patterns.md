# Padrões e casos de uso

## Proteger API com esquema + JWT

```bash
# 1. Upload OpenAPI schema
POST /zones/{zone_id}/api_gateway/user_schemas

# 2. Configure JWT validation
POST /zones/{zone_id}/api_gateway/token_validation
{
  "name": "Auth0",
  "location": {"header": "Authorization"},
  "jwks": "{...}"
}

# 3. Create JWT rule
POST /zones/{zone_id}/api_gateway/jwt_validation_rules

# 4. Set schema validation action
PUT /zones/{zone_id}/api_gateway/settings/schema_validation
{"validation_default_mitigation_action": "block"}
```

##Lançamento progressivo

```
1. Log mode: Observe false positives
   - Schema: Action = Log
   - JWT: Action = Log

2. Block subset: Protect critical endpoints
   - Change specific endpoint actions to Block
   - Monitor firewall events

3. Full enforcement: Block all violations
   - Change default action to Block
   - Handle fallthrough with custom rule
```

##Detecção BOLA

### Detecção de enumeração

Detecta acesso sequencial a recursos (por exemplo, `/users/1`, `/users/2`, `/users/3`).

```javascript
// Block BOLA enumeration attempts
(cf.api_gateway.cf-risk-bola-enumeration and http.host eq "api.example.com")
// Action: Block or Challenge
```

### Poluição de Parâmetros

Detecta parâmetros duplicados/excessivos em solicitações.

```javascript
// Block parameter pollution
(cf.api_gateway.cf-risk-bola-pollution and http.host eq "api.example.com")
// Action: Block
```

### Proteção BOLA Combinada

```javascript
// Comprehensive BOLA rule
(cf.api_gateway.cf-risk-bola-enumeration or cf.api_gateway.cf-risk-bola-pollution)
and http.host eq "api.example.com"
// Action: Block
```

##Postura de autenticação

### Detectar autenticação ausente

```javascript
// Log endpoints lacking authentication
(cf.api_gateway.cf-risk-missing-auth and http.host eq "api.example.com")
// Action: Log (for audit)
```

### Detectar autenticação mista

```javascript
// Alert on inconsistent auth patterns
(cf.api_gateway.cf-risk-mixed-auth and http.host eq "api.example.com")
// Action: Log (review required)
```

##Detecção de Fallthrough (APIs Shadow)

```javascript
// WAF Custom Rule
(cf.api_gateway.fallthrough_triggered and http.host eq "api.example.com")
// Action: Log (discover unknown) or Block (strict)
```

##Limitação de taxa por usuário

```javascript
// Rate Limiting Rule (modern syntax)
(http.host eq "api.example.com" and
 is_jwt_valid(http.request.jwt.payload["{config_id}"][0]))

// Rate: 100 req/60s
// Counting expression: lookup_json_string(http.request.jwt.payload["{config_id}"][0], "sub")
```

##Resposta ao abuso volumétrico

```javascript
// Detect abnormal traffic spikes
(cf.api_gateway.volumetric_abuse_detected and http.host eq "api.example.com")
// Action: Challenge or Rate Limit

// Combined with rate limiting
(cf.api_gateway.volumetric_abuse_detected or
 cf.threat_score gt 50) and http.host eq "api.example.com"
// Action: JS Challenge
```

##Proteção GraphQL

```javascript
// Block oversized queries
(http.request.uri.path eq "/graphql" and
 cf.api_gateway.graphql_query_size gt 100000)
// Action: Block

// Block deep nested queries
(http.request.uri.path eq "/graphql" and
 cf.api_gateway.graphql_query_depth gt 10)
// Action: Block
```

##Padrões de Arquitetura

**API pública:** Descoberta + Validação de esquema 2.0 + JWT + Limitação de taxa + Gerenciamento de bot  
**API do parceiro:** mTLS + validação de esquema + mitigação de sequência  
**API interna:** Descoberta + Aprendizado de esquema + Postura de autenticação

## Mapeamento dos 10 principais seguranças da API OWASP (2026)

| Problema OWASP                                           | Soluções de escudo API                                                                             |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| API1:2023 Autorização em nível de objeto quebrado        | **Detecção BOLA** (enumeração + poluição), mitigação de sequência, esquema, JWT, limitação de taxa |
| API2:2023 Autenticação quebrada                          | **Postura de autenticação**, mTLS, validação JWT, gerenciamento de bots                            |
| API3:2023 Autenticação de propriedade de objeto quebrado | Validação de esquema, validação JWT                                                                |
| API4:2023 Acesso irrestrito a recursos                   | Limitação de taxa, **Detecção volumétrica de abuso**, **Proteção GraphQL**, Gerenciamento de bots  |
| API5:2023 Autenticação de nível de função quebrada       | Validação de esquema, validação JWT, postura de autenticação                                       |
| API6:2023 Fluxos de negócios irrestritos                 | Mitigação de sequência, gerenciamento de bots                                                      |
| API7:2023 SSRF                                           | Validação de esquema, regras gerenciadas pelo WAF                                                  |
| API8:2023 Configuração incorreta de segurança            | **Validação de esquema 2.0**, postura de autenticação, regras WAF                                  |
| API9:2023 Gerenciamento inadequado de estoque            | **Descoberta de API**, aprendizado de esquema, postura de autenticação                             |
| API10:2023 Consumo inseguro de API                       | Validação JWT, validação de esquema, gerenciamento de WAF                                          |

## Monitoramento

**Eventos de segurança:** `Segurança > Eventos` → Filtro: Ação = bloco, Serviço = API Shield  
**Firewall Analytics:** `Analytics > Segurança` → Filtrar por campos `cf.api_gateway.*`  
**Campos Logpush:** APIGatewayAuthIDPresent, APIGatewayRequestViolatesSchema, APIGatewayFallthroughDetected, JWTValidationResult

## Disponibilidade (2026)

| Recurso                       | Disponibilidade         | Notas                    |
| ----------------------------- | ----------------------- | ------------------------ |
| mTLS (CA gerenciada por CF)   | Todos os planos         | Autoatendimento          |
| Gerenciamento de terminais    | Todos os planos         | Operações limitadas      |
| Validação de Esquema 2.0      | Todos os planos         | Operações limitadas      |
| Descoberta de API             | Empresa                 | Mais de 10 mil operações |
| Validação JWT                 | Complemento empresarial | Validação completa       |
| Detecção BOLA                 | Complemento empresarial | Requer IDs de sessão     |
| Postura de autenticação       | Complemento empresarial | Auditoria de segurança   |
| Detecção volumétrica de abuso | Complemento empresarial | Análise de tráfego       |
| Proteção GraphQL              | Complemento empresarial | Limites de consulta      |
| Mitigação de sequência        | Empresa (beta)          | Equipe de contato        |
| Suíte Completa                | Complemento empresarial | Todos os recursos        |

**Limites empresariais:** 10 mil operações (entre em contato para maiores). Acesso de visualização disponível para avaliação fora do contrato.

## Veja também

- [configuration.md](configuration.md) - Configure todos os recursos antes de criar regras
- [api.md](api.md) - Referência de campo de firewall e endpoints de API
- [gotchas.md](gotchas.md) - Problemas comuns e limites
