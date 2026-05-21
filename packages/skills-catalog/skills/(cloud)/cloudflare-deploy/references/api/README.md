# Integração de API Cloudflare

Guia para trabalhar com a API REST da Cloudflare: autenticação, uso de SDK, padrões comuns e solução de problemas.

## Árvore de decisão rápida```

Como você está chamando a API Cloudflare?
├─ Do tempo de execução dos trabalhadores → Use ligações, não API REST (consulte ../bindings/)
├─ Lado do servidor (Node/Python/Go) → SDK oficial (consulte api.md)
├─ CLI/scripts → Wrangler ou curl (veja configuração.md)
├─ Infraestrutura como código → Consulte ../pulumi/ ou ../terraform/
└─ Solicitações únicas → exemplos de curl (consulte api.md)

```
## Seleção de SDK

| Idioma | Pacote | Melhor para | Novas tentativas padrão |
| ---------- | ------------------ | ------------------------------ | --------------- |
| Datilografado | `cloudflare` | Node.js, Bun, Next.js, Trabalhadores | 2 |
| Pitão | `cloudflare` | FastAPI, Django, scripts | 2 |
| Vá | `cloudflare-go/v4` | Ferramentas CLI, microsserviços | 10 |

Todos os SDKs são gerados pelo Stainless a partir de especificações OpenAPI (APIs consistentes).

## Métodos de autenticação

| Método | Segurança | Caso de uso | Escopo |
| ---------------- | ------------------- | -------------------- | ------------------- |
| **Token de API** ✓ | Escopo, giratório | Produção | Por zona ou conta |
| Chave API + E-mail | Acesso total à conta | Somente legado | Tudo |
| Chave de serviço do usuário | Limitado | Apenas certificados CA de origem | Origem CA |

**Sempre use tokens de API** para novos projetos.

## Limites de taxa

| Limite | Valor |
| -------------- | ---------------------------- |
| Por usuário/token | 1200 solicitações/5 minutos |
| Por IP | 200 solicitações/segundo |
| GráficoQL | 320/5 minutos (com base no custo) |

## Ordem de leitura

| Tarefa | Arquivos para ler |
| ---------------------------- | --------------------------------- |
| Inicializar cliente SDK | API.md |
| Configurar autenticação/tempo limite/nova tentativa | configuração.md |
| Encontre padrões de uso | padrões.md |
| Erros de depuração/limites de taxa | pegadinhas.md |
| APIs específicas do produto | ../trabalhadores/, ../r2/, ../kv/, etc. |

## Nesta referência

- **[api.md](api.md)** - Inicialização do cliente SDK, paginação, tratamento de erros, exemplos
- **[configuration.md](configuration.md)** - Variáveis de ambiente, configuração do SDK, configuração do Wrangler
- **[patterns.md](patterns.md)** - Padrões do mundo real, operações em lote, fluxos de trabalho
- **[gotchas.md](gotchas.md)** - Limites de taxa, problemas específicos do SDK, solução de problemas

## Veja também

- [Documentos da API Cloudflare](https://developers.cloudflare.com/api/)
- [Referência de vinculações](../bindings/) - Vinculações de tempo de execução de trabalhadores (preferenciais à API REST)
- [Referência do Wrangler](../wrangler/) - Ferramenta CLI para desenvolvimento Cloudflare
```
