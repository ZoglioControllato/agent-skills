# Dicas de gerenciamento de bots

## Erros Comuns

### "Pontuação do bot = 0"

**Causa:** O gerenciamento de bots não foi executado (solicitação interna da Cloudflare, roteamento do trabalhador para a zona (laranja para laranja) ou solicitação tratada antes do BM (regras de redirecionamento etc.))
**Solução:** verifique o fluxo de solicitação e garanta que o Bot Management seja executado no ciclo de vida da solicitação

### "Detecções de JavaScript não funcionam"

**Causa:** `js_detection.passed` sempre falso ou indefinido devido a: cabeçalhos CSP não permitem `/cdn-cgi/challenge-platform/`, uso na primeira visita à página (precisa da página HTML primeiro), bloqueadores de anúncios ou JS desativado, JSD não habilitado no painel ou uso da ação Bloquear (deve usar Desafio Gerenciado)
**Solução:** Adicione o cabeçalho CSP `Content-Security-Policy: script-src 'self' /cdn-cgi/challenge-platform/;` e garanta que o JSD esteja habilitado com a ação de Desafio Gerenciado

### "Falsos positivos (usuários legítimos bloqueados)"

**Causa:** Detecção de bot sinalizando incorretamente usuários legítimos
**Solução:** Verifique o Bot Analytics para IPs/caminhos afetados, identifique a fonte de detecção (ML, Heurística, etc.), crie uma regra de exceção como `(cf.bot_management.score lt 30 e http.request.uri.path eq "/problematic-path")` com Ação: Ignorar (Gerenciamento de bot) ou lista de permissões por IP/ASN/país

### "Falsos negativos (bots não capturados)"

**Causa:** Bots ignorando a detecção
**Solução:** limite de pontuação mais baixo (30 → 50), habilite detecções de JavaScript, adicione regras de impressão digital JA3/JA4 ou use limitação de taxa como substituto

### "Bot verificado bloqueado"

**Causa:** bot do mecanismo de pesquisa bloqueado pelas regras gerenciadas do WAF (não apenas pelo gerenciamento de bots)
**Solução:** crie uma exceção WAF para um ID de regra específico e verifique o bot por meio de DNS reverso

### "Bot Yandex bloqueado durante atualização de IP"

**Causa:** Yandex atualiza IPs de bot; novos IPs não reconhecidos por 48h durante a propagação
**Solução:**

1. Verifique os eventos de segurança para ID de regra WAF específico que bloqueia Yandex
2. Crie uma exceção WAF:

```txt
(http.user_agent contém "YandexBot" e ip.src em {<yandex-ip-range>})
Ação: Ignorar (conjunto de regras gerenciadas pelo WAF)
```

3. Monitore o Bot Analytics por 48h
4. Remova a exceção após a conclusão da propagação

O problema é resolvido automaticamente após 48h. Entre em contato com o suporte da Cloudflare se persistir.

### "JA3/JA4 ausente"

**Causa:** Tráfego não HTTPS, tráfego de roteamento de Worker, tráfego de laranja para laranja via Worker ou gerenciamento de bot ignorado
**Solução:** JA3/JA4 disponível apenas para tráfego HTTPS/TLS; verifique o roteamento de solicitação

**JA3/JA4 não exclusivo do usuário:** Mesma versão do navegador/biblioteca = mesma impressão digital

- Não use para identificação do usuário
- Use apenas para perfil de cliente
- As impressões digitais mudam com as atualizações do navegador

## Métodos de verificação de bot

Cloudflare verifica bots por meio de:

1. **DNS reverso (validação de IP):** Método tradicional – o IP do bot resolve para o domínio esperado
2. **Web Bot Auth:** Verificação criptográfica moderna – propagação mais rápida

Quando `verifiedBot=true`, o bot passou pelo menos um método.

**Bots verificados inativos:** IPs removidos após 24h sem tráfego.

## Comportamento do mecanismo de detecção

| Motor                   | Pontuação          | Tempo                | Plano   | Notas                                         |
| ----------------------- | ------------------ | -------------------- | ------- | --------------------------------------------- |
| Heurísticas             | Sempre 1           | Imediato             | Todos   | Impressões digitais conhecidas – substitui ML |
| AM                      | 1-99               | Imediato             | Todos   | Maioria das detecções                         |
| Detecção de anomalias   | Influências        | Após a linha de base | Empresa | Opcional, análise de base                     |
| Detecções de JavaScript | Aprovado/reprovado | Depois de JS         | Pró+    | Detecção de navegador sem cabeça              |
| Serviço Cloudflare      | N/A                | N/A                  | Empresa | Fonte interna Zero Trust                      |

**Prioridade:** Heurística > ML — se a heurística corresponder, pontuação=1, independentemente do ML.

## Limites

| Limite                                    | Valor                                        | Notas                                                                 |
| ----------------------------------------- | -------------------------------------------- | --------------------------------------------------------------------- |
| Pontuação do bot = 0                      | Significa não computado                      | Sem pontuação = 100                                                   |
| Primeira solicitação de dados JSD         | Pode não estar disponível                    | Os dados JSD aparecem em solicitações subsequentes                    |
| Precisão da pontuação                     | Não é 100% garantido                         | São possíveis falsos positivos/negativos                              |
| JSD na primeira visita à página HTML      | Não suportado                                | Requer carregamento de página subsequente                             |
| Requisitos JSD                            | Navegador habilitado para JavaScript         | Não funcionará com JS desativado ou bloqueadores de anúncios          |
| Remoção de JSD ETag                       | Remove ETags de respostas HTML               | Pode afetar o comportamento do cache                                  |
| Compatibilidade JSD CSP                   | Requer CSP específico                        | Não compatível com algumas configurações CSP                          |
| Meta tags CSP JSD                         | Não suportado                                | Deve usar cabeçalhos HTTP                                             |
| Suporte JSD WebSocket                     | Não suportado                                | Endpoints WebSocket não funcionarão com JSD                           |
| Suporte a aplicativos móveis JSD          | Aplicativos nativos não serão aprovados      | Funciona apenas em navegadores                                        |
| Tipo de tráfego JA3/JA4                   | Somente HTTPS/TLS                            | Não disponível para tráfego não HTTPS                                 |
| Roteamento de trabalhador JA3/JA4         | Ausente no tráfego roteado pelo trabalhador  | Verifique o roteamento de solicitações                                |
| Exclusividade JA3/JA4                     | Não exclusivo por usuário                    | Compartilhado por clientes com o mesmo navegador/biblioteca           |
| Estabilidade JA3/JA4                      | Pode mudar com atualizações                  | As atualizações do navegador/biblioteca afetam as impressões digitais |
| Regras personalizadas do WAF (grátis)     | 5                                            | Varia de acordo com o plano                                           |
| Regras personalizadas do WAF (Pro)        | 20                                           | Varia de acordo com o plano                                           |
| Regras personalizadas do WAF (Negócios)   | 100                                          | Varia de acordo com o plano                                           |
| Regras personalizadas do WAF (Enterprise) | Mais de 1.000                                | Varia de acordo com o plano                                           |
| Tempo de CPU dos trabalhadores            | Varia de acordo com o plano                  | Aplica-se à lógica do bot                                             |
| Amostragem do Bot Analytics               | 1-10% adaptativo                             | Zonas de alto volume amostradas de forma mais agressiva               |
| História do Bot Analytics                 | 30 dias no máximo                            | Limite de retenção de dados históricos                                |
| Requisitos CSP para JSD                   | Deve permitir `/cdn-cgi/challenge-platform/` | Necessário para JSD funcionar                                         |

### Restrições do plano

| Recurso                       | Grátis   | Pró/Negócios | Empresa       |
| ----------------------------- | -------- | ------------ | ------------- |
| Pontuações granulares (1-99)  | Não      | Não          | Sim           |
| JA3/JA4                       | Não      | Não          | Sim           |
| Detecção de anomalias         | Não      | Não          | Sim           |
| Detecção de proxy corporativo | Não      | Não          | Sim           |
| Categorias de bot verificadas | Limitado | Limitado     | Completo      |
| Regras WAF personalizadas     | 5        | 20/100       | Mais de 1.000 |
