# Dicas e solução de problemas

## Erros Comuns

### "Validação de esquema 2.0 não funciona após a migração"

**Causa:** Regras clássicas ainda ativas, em conflito com o novo sistema
**Solução:**

1. Exclua TODAS as regras de validação de esquema clássico
2. Limpe o cache do Cloudflare (espere 5 minutos)
3. Reenvie o esquema por meio da nova interface Schema Validation 2.0
4. Verifique em Segurança > Eventos
5. Verifique se a ação está definida (Log/Bloqueio)

### "Validação de esquema bloqueando solicitações válidas"

**Causa:** Esquema muito restritivo, campos ausentes ou tipos incorretos
**Solução:**

1. Verifique os eventos de firewall para obter detalhes de violação
2. Revise o esquema em Configurações
3. Teste o esquema no Swagger Editor
4. Use o modo Log para validar antes de bloquear
5. Atualize o esquema com especificações corretas
6. Garanta a validação do esquema 2.0 (não clássico)

### "Falha na validação do JWT"

**Causa:** incompatibilidade de JWKS com IdP, token expirado, nome de cabeçalho/cookie incorreto ou distorção de relógio
**Solução:**

1. Verifique se o JWKS corresponde à configuração do IdP
2. Verifique se a reivindicação `exp` do token é válida
3. Confirme se o nome do cabeçalho/cookie corresponde à configuração
4. Token de teste em jwt.io
5. Considere a distorção do relógio (tolerância de ± 5 min)
6. Use sintaxe moderna: `is_jwt_valid(http.request.jwt.payload["{config_id}"][0])`

### "Falsos positivos de detecção BOLA"

**Causa:** padrões de acesso sequencial legítimos, operações em massa ou sensibilidade muito alta
**Solução:**

1. Revise os eventos BOLA em Segurança > Eventos
2. Limite de sensibilidade inferior (Alto → Médio → Baixo)
3. Excluir operações em massa legítimas da detecção
4. Garanta que os identificadores de sessão identifiquem os usuários de maneira exclusiva
5. Verifique os requisitos mínimos de tráfego atendidos (mais de 1.000 solicitações/dia)

### "Rótulos de risco não aparecem nas regras de firewall"

**Causa:** Recurso não ativado, tráfego insuficiente ou identificadores de sessão ausentes
**Solução:**

1. Verifique a validação de esquema 2.0 habilitada
2. Habilite a detecção BOLA nas configurações do esquema
3. Configure identificadores de sessão (obrigatórios para BOLA)
4. Aguarde 24 a 48 horas pelo treinamento do modelo de ML
5. Verifique os limites mínimos de tráfego atendidos

### "Descoberta de endpoint não encontra APIs"

**Causa:** Tráfego insuficiente (<500 reqs/10d), respostas diferentes de 2xx, solicitações diretas do trabalhador ou configuração de ID de sessão incorreta
**Solução:** Garanta mais de 500 solicitações em 10 dias, 2xx respostas da borda (não diretas dos trabalhadores), configure IDs de sessão corretamente. O ML é atualizado diariamente.

### "Falsos positivos de detecção de sequência"

**Causa:** problemas na janela de lookback, IDs de sessão não exclusivos ou sensibilidade do modelo
**Solução:**

1. Revise as configurações de lookback (10 solicitações para endpoints gerenciados, janela de 10 minutos)
2. Garanta a exclusividade do ID da sessão por usuário (não tokens compartilhados)
3. Ajuste o equilíbrio do modelo positivo/negativo
4. Excluir fluxos de trabalho legítimos da detecção

### "Proteção GraphQL bloqueando consultas válidas"

**Causa:** Limites de profundidade/tamanho da consulta são muito restritivos, complexos, mas legítimos
**Solução:**

1. Revise os padrões de consulta bloqueados em Segurança > Eventos
2. Aumente max_profundidade (padrão: 10) se necessário
3. Aumente max_size (padrão: 100 KB) para consultas complexas
4. Lista de permissões de assinaturas de consulta específicas
5. Use o modo Log para ajustar antes de bloquear

### "Token inválido"

**Causa:** Erro de configuração, incompatibilidade de JWKS ou token expirado
**Solução:** verifique se a configuração corresponde ao IdP, atualize o JWKS, verifique a expiração do token

### "Violação de esquema"

**Causa:** Campos obrigatórios ausentes, tipos de dados incorretos ou incompatibilidade de especificações
**Solução:** revise o esquema em relação às solicitações reais, verifique se todos os campos obrigatórios estão presentes e valide os tipos que correspondem às especificações

### "Desastre"

**Causa:** Endpoint desconhecido ou incompatibilidade de padrão
**Solução:** atualize o esquema com todos os endpoints, verifique a correspondência do padrão de caminho

### "mTLS falhou"

**Causa:** Certificado não confiável/expirado ou CA errado
**Solução:** verifique a cadeia de certificados, verifique a expiração, confirme o upload da CA correta

## Limites (2026)

| Recurso/Limite                         | Valor                                   | Notas                                       |
| -------------------------------------- | --------------------------------------- | ------------------------------------------- |
| Versão OpenAPI                         | somente v3.0.x                          | Nenhuma referência externa, deve ser válida |
| Operações de esquema                   | 10K (Empresa)                           | Contato para limites maiores                |
| Fontes de validação JWT                | Somente cabeçalhos/cookies              | Sem parâmetros/corpo de consulta            |
| Descoberta de endpoint                 | Mais de 500 solicitações/10d            | Mínimo para modelo ML                       |
| Normalização de caminho                | Automático                              | `/perfil/238` → `/perfil/{var1}`            |
| Parâmetros do esquema                  | Nenhum campo `content`                  | Nenhuma validação de parâmetro de objeto    |
| Detecção BOLA                          | Mais de 1.000 solicitações/dia/endpoint | Mínimo por ponto de extremidade             |
| Exclusividade do ID de sessão          | Obrigatório                             | BOLA/Sequência precisa de IDs exclusivos    |
| Profundidade máxima do GraphQL         | 1-50                                    | Padrão: 10                                  |
| Tamanho máximo do GraphQL              | 1 KB-1 MB                               | Padrão: 100 KB                              |
| Aninhamento de declaração JWT          | 10 níveis no máximo                     | Use notação de ponto                        |
| Certificados CA mTLS                   | 5 máximo personalizado                  | Gerenciado por CF ilimitado                 |
| Tamanho de upload do esquema           | Máximo de 5 MB                          | Especificação OpenAPI compactada            |
| Linha de base do abuso volumétrico     | 7 dias de treinamento                   | Período inicial de ML                       |
| Atualização de postura de autenticação | Diariamente                             | Atualizado todas as noites                  |

## Veja também

- [configuration.md](configuration.md) - Guias de configuração para evitar problemas comuns
- [patterns.md](patterns.md) – Melhores práticas e implementação progressiva
- [Documentos do API Shield](https://developers.cloudflare.com/api-shield/)
