# Dicas e solução de problemas da CNI

## Erros Comuns

### "Status: Pendente"

**Causa:** Conexão cruzada não instalada, fibras RX/TX invertidas, tipo de fibra incorreto ou níveis de luz baixos
**Solução:**

1. Verifique a conexão cruzada instalada
2. Verifique a fibra no patch panel
3. Trocar fibras RX/TX
4. Verifique a luz com medidor de potência óptica (alvo> -20 dBm)
5. Entre em contato com a equipe da conta

### "Status: Insalubre"

**Causa:** Problema físico, pouca luz (<-20 dBm), incompatibilidade óptica ou conectores sujos
**Solução:**

1. Verifique as conexões físicas
2. Limpe os conectores de fibra
3. Verifique os tipos ópticos (10GBASE-LR/100GBASE-LR4)
4. Teste com óptica em boas condições
5. Verifique o painel de patch
6. Entre em contato com a equipe da conta

### "Sessão BGP inativa"

**Causa:** Endereçamento IP incorreto, ASN incorreto, incompatibilidade de senha ou firewall bloqueando TCP/179
**Solução:**

1. Verifique se os IPs correspondem ao objeto CNI
2. Confirme o ASN correto
3. Verifique a senha do BGP
4. Verifique se não há firewall no TCP/179
5. Verifique os registros do BGP
6. Revise os temporizadores BGP

### "Baixo rendimento"

**Causa:** incompatibilidade de MTU, fragmentação, túnel GRE único (v1) ou ineficiência de roteamento
**Solução:**

1. Verifique MTU (1500↓/1476↑ para v1, 1500 ambos para v2)
2. Teste vários tamanhos de pacotes
3. Adicione mais túneis GRE (v1)
4. Considere atualizar para v2
5. Revise as tabelas de roteamento
6. Use LACP para agrupamento (v1)

## Erros de API

### 400 Solicitação incorreta: "slot_id já ocupado"

**Causa:** Outra interconexão já usa esse slot
**Solução:** Use o filtro `occupied=false` ao listar slots:```typescript
await client.networkInterconnects.slots.list({
account_id: id,
occupied: false,
facility: 'EWR1',
})

```
### 400 Solicitação incorreta: "código de instalação inválido"

**Causa:** Erro de digitação ou recurso não suportado
**Solution:** Check [locations PDF](https://developers.cloudflare.com/network-interconnect/static/cni-locations-2026-01.pdf) for valid codes

 ### 403 Proibido: "Plano empresarial necessário"

**Causa:** a conta não é de nível empresarial
**Solução:** entre em contato com a equipe da conta para fazer upgrade

### 422 Unprocessable: "validate_only request failed"

 **Cause:** Dry-run validation found issues (wrong slot, invalid config)
 **Solution:** Review error message details, fix config before real creation

 ### Limitação de taxa

**Limite:** 1.200 solicitações/5min por token
**Solution:** Implement exponential backoff, cache slot listings

 ## Problemas específicos da nuvem

### AWS Direct Connect: "VLAN não correspondente"

**Cause:** VLAN ID from AWS LOA doesn't match CNI config
 **Solução:**

1. Obtenha VLAN do Console AWS após fazer o pedido
2. Envie a VLAN exata para a equipe da conta CF
3. Verifique a correspondência na configuração do objeto CNI

### AWS: “Conexão travada em pendente”

**Cause:** LOA not provided to CF or AWS connection not accepted
 **Solução:**

1. Verifique se o status da conexão AWS é “Disponível”
2. Confirme a LOA enviada à equipe de conta CF
3. Aguarde a aceitação da equipe CF (pode levar dias)

### GCP: "Rotas BGP não propagadas"

**Causa:** rotas BGP do GCP Cloud Router **ignoradas por design**
**Solução:** use [rotas estáticas](https://developers.cloudflare.com/magic-wan/configuration/manually/how-to/configure-routes/#configure-static-routes) no Magic WAN

### GCP: "Não é possível consultar o status do anexo da VLAN via API"

**Causa:** Somente painel do GCP Cloud Interconnect (ainda sem API)
**Solução:** verifique o status no painel CF ou no console GCP

## Problemas de interconexão com parceiros

### Equinix: “Circuito virtual não aparece”

**Causa:** CF não aceitou a solicitação de conexão da Equinix
**Solução:**

1. Verifique o VC criado no Equinix Fabric Portal
2. Entre em contato com a equipe da conta CF para aceitar
3. Aguarde de 2 a 3 dias úteis

### Console Connect/Megaport: "Falha na criação da API"

**Causa:** As interconexões de parceiros exigem portal do parceiro + aprovação do CF
**Solução:** Não é possível automatizar totalmente. Faça o pedido no portal do parceiro e notifique a equipe da conta CF.

## Antipadrões

| Antipadrão | Por que é ruim | Solução |
| -------------------------------------- | ------------------------------------ | ------------------------------------ |
| Interconexão única para produção | Sem SLA, ponto único de falha | Use ≥2 com diversidade de dispositivos |
| Sem backup da Internet | CNI falha = interrupção total | Sempre mantenha caminho alternativo |
| Status da votação a cada segundo | Limites de taxa, desperdício de chamadas de API | Pesquisa a cada 30-60 anos no máximo |
| Usando v1 para cargas de trabalho Magic WAN v2 | Sobrecarga GRE, complexidade | Use v2 para roteamento simplificado |
| Assumindo sessão BGP = fluxo de tráfego | BGP ativo ≠ rotas instaladas | Verifique as tabelas de roteamento + teste o tráfego |
| Não habilitando alertas de manutenção | Tempo de inatividade surpresa durante a manutenção | Habilite notificações imediatamente |
| VLAN codificada em automação | VLAN atribuída por CF (v1) | Obtenha VLAN da resposta do objeto CNI |
| Usando Direct sem colocation | Não é possível acessar a conexão cruzada | Use interconexão de parceiro ou nuvem |

## O que não pode ser consultado via API

**Não é possível recuperar:**

- Estado da sessão BGP (use dashboard ou logs BGP)
- Níveis leves (entre em contato com a equipe da conta)
- Métricas históricas (tempo de atividade, tráfego)
- Utilização de largura de banda por interconexão
- Programações de janelas de manutenção (apenas notificações)
- Detalhes do caminho da fibra
- Status de instalação de conexão cruzada

**Soluções alternativas:**

- Monitoramento externo para estado BGP
- Agregação de log para dados históricos
- Notificações para janelas de manutenção

## Limites

| Recurso/Limite | Valor | Notas |
| --------------------- | ------------- | ----------------------------------- |
| Distância óptica máxima | 10km | Limite físico |
| MTU (v1) | 1500↓/1476↑ | Assimétrico |
| MTU (v2) | 1500 ambos | Simétrico |
| Taxa de transferência do túnel GRE | 1Gb/s | Por túnel (v1) |
| Tempo de recuperação | Dias | Nenhum SLA formal |
| Nível de luz mínimo | -20dBm | Limite-alvo |
| Limite de taxa API | 1200 req/5min | Por token |
| Atraso no exame de saúde | 6 horas | Novas assinaturas de alerta de manutenção |
```
