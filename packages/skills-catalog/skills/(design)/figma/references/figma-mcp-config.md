# Referência de configuração do Figma MCP

Use este snippet para registrar o servidor Figma MCP na configuração do seu agente como um servidor HTTP streamable com autenticação de portador extraída de seu ambiente.

## Exemplo de configuração```toml

[mcp_servers.figma]
url = "https://mcp.figma.com/mcp"
bearer_token_env_var = "FIGMA_OAUTH_TOKEN"
http_headers = { "X-Figma-Region" = "us-east-1" }

```
## Notas e opções

- O token ao portador deve estar disponível como `FIGMA_OAUTH_TOKEN` no ambiente que inicia seu agente.
- Mantenha o cabeçalho da região alinhado com sua região Figma. Se sua organização usa outra região, atualize `X-Figma-Region` consistentemente.
- OAuth em HTTP streamable requer que o recurso do cliente RMCP esteja habilitado na configuração do seu agente.
- Tempos limites opcionais por servidor: `startup_timeout_sec` (padrão 10) e `tool_timeout_sec` (padrão 60) podem ser definidos

t se necessário.

## Configuração de env var (se estiver faltando)

- Conjunto único para shell atual: `export FIGMA_OAUTH_TOKEN="<token>"`
- Persista para sessões futuras: adicione a linha de exportação ao seu perfil de shell (por exemplo, `~/.zshrc` ou `~/.bashrc`) e reinicie o shell ou seu IDE.
- Verifique antes de iniciar seu agente: `echo $FIGMA_OAUTH_TOKEN` deve imprimir um token não vazio.

## Configuração + lista de verificação de verificação

- Adicione a configuração do servidor MCP ao arquivo de configuração do seu agente.
- Habilite o recurso do cliente RMCP, se exigido pelo seu agente.
- Reinicie seu agente (CLI/IDE) após atualizar as variáveis ​​de configuração e ambiente.
- Peça ao seu agente para listar as ferramentas Figma ou faça uma chamada simples para confirmar se o servidor está acessível.

## Solução de problemas

- Token não coletado: Exporte `FIGMA_OAUTH_TOKEN` no mesmo shell que inicia seu agente ou adicione-o ao seu perfil de shell e reinicie.
- Erros OAuth: verifique se o cliente RMCP está ativado e se o token do portador é válido. Os tokens copiados do Figma não devem incluir aspas.
- Rede/cabeçalhos: Mantenha o cabeçalho `X-Figma-Region`; se sua organização usar outra região, atualize o cabeçalho de forma consistente nas configurações e nas solicitações.

## Lembretes de uso

- O servidor é baseado em link: copie o link do quadro ou camada Figma e peça ao cliente MCP para implementar esse URL. O cliente extrairá o ID do nó do link (ele não navega na página).
- Se a saída parecer genérica, reafirme as regras específicas do projeto da habilidade principal e certifique-se de seguir o fluxo necessário (get_design_context → get_metadata se necessário → get_screenshot).
```
