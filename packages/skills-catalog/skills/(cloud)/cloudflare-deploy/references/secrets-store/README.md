# Loja de segredos Cloudflare

Gerenciamento de segredos criptografados em nível de conta para Workers e AI Gateway.

## Visão geral

**Repositório de segredos**: segredos centralizados em nível de conta, reutilizáveis entre trabalhadores
**Segredos do trabalhador**: segredos por trabalhador (`wrangler secret put`)

### Arquitetura

- **Loja**: Container (1/conta em beta)
- **Segredo**: String ≤1024 bytes
- **Escopos**: limites de permissão que controlam o acesso
- `workers`: Para acesso ao tempo de execução dos Workers
- `ai-gateway`: Para acesso ao AI Gateway
- Os segredos devem ter escopo correto para vinculação ao trabalho
- **Bindings**: Conecte segredos por meio do objeto `env`

**Disponibilidade Regional**: Global, exceto Rede da China (indisponível)

### Controle de acesso

- **Super Admin**: acesso total
- **Administrador**: criar/editar/excluir segredos, visualizar metadados
- **Implantador**: visualizar metadados + vinculações
- **Repórter**: visualizar apenas metadados

Permissões de token de API: `Edição/leitura do armazenamento de segredos da conta`

### Limites (Beta)

- 100 segredos/conta
- 1 loja/conta
- 1024 bytes máximo/secreto
- Segredos de produção contam até o limite

## Quando usar

**Use o Secrets Store quando:**

- Vários trabalhadores compartilham a mesma credencial
- Gerenciamento centralizado necessário
- Conformidade requer trilha de auditoria
- Colaboração em equipe em segredos

**Use segredos de trabalho quando:**

- Segredo exclusivo para um Worker
- Projeto simples de trabalhador único
- Não é necessário compartilhamento entre trabalhadores

## Nesta referência

### Ordem de leitura por tarefa

| Tarefa                       | Comece aqui                 | Então leia      |
| ---------------------------- | --------------------------- | --------------- |
| Visão geral rápida           | README.md                   | -               |
| Configuração inicial         | README.md → configuração.md | API.md          |
| Adicionar segredo ao Worker  | configuração.md             | API.md          |
| Implementar padrão de acesso | API.md                      | padrões.md      |
| Erros de depuração           | pegadinhas.md               | API.md          |
| Rotação secreta              | padrões.md                  | configuração.md |
| Melhores práticas            | pegadinhas.md               | padrões.md      |

### Arquivos

- [configuration.md](./configuration.md) - Comandos do Wrangler, configuração de ligação
- [api.md](./api.md) - API de vinculação, operações de obtenção/colocação/exclusão
- [patterns.md](./patterns.md) - Rotação, criptografia, controle de acesso
- [gotchas.md](./gotchas.md) - Problemas de segurança, limites, práticas recomendadas

## Veja também

- [workers](../workers/) - Integração de vinculações de trabalhadores
- [wrangler](../wrangler/) - Comandos de gerenciamento de segredos CLI
