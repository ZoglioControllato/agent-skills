# Padrões de erro (compacto)

Use isso para mapear rapidamente assinaturas de log para causas e soluções prováveis.

| Padrão de registro                             | Causa provável               | Correção rápida                                         |
| ---------------------------------------------- | ---------------------------- | ------------------------------------------------------- |
| `KeyError`, `não definido`, `ambiente ausente` | Variável de ambiente ausente | Adicione env var em render.yaml ou via MCP e reimplante |
| `EADDRINUSE`, `ouvir EADDRINUSE`               | P                            |

conflito vinculativo ort | Vincular a `0.0.0.0:$PORT` |
| `Não é possível encontrar o módulo`, `ModuleNotFoundError` | Dependência ausente | Adicionar dependência para manifestar e reconstruir |
| `ECONNREFUSED`, `conexão recusada` | Banco de dados não acessível | Verifique o status de DATABASE_URL e do banco de dados |
| `Tempo limite da verificação de integridade` | Nenhuma resposta saudável | Adicionar/verificar endpoint de integridade e

porto |
| `exit 137`, `sem memória` | OOM | Reduza o uso de memória ou atualize o plano |
| `Comando falhou`, `falha na compilação` | Comando de construção incorreto | Corrigir comando de construção ou dependências |
