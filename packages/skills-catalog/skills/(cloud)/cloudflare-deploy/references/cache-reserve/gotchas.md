# Dicas de reserva de cache

## Erros Comuns

### "Ativos não armazenados em cache na reserva de cache"

**Causa:** O ativo não pode ser armazenado em cache, TTL < 10 horas, cabeçalho Content-Length ausente ou cabeçalhos de bloqueio presentes (Set-Cookie, Vary: _)
**Solução:** Garanta um TTL mínimo de mais de 10 horas (`Cache-Control: public, max-age=36000`), adicione o cabeçalho Content-Length, remova o cabeçalho Set-Cookie e defina `Vary: Accept-Encoding` (não _)

### "Solicitações de intervalo não funcionam" (falha na busca de vídeo)

**Causa:** A Reserva de Cache **NÃO** oferece suporte a solicitações de intervalo (conteúdo parcial HTTP 206)
**Solução:** As solicitações de intervalo ignoram totalmente a Reserva de Cache. Para streaming de vídeo com busca:

- Use apenas cache de borda (TTLs mais curtos)
- Considere R2 com acesso direto para cargas de trabalho de grande alcance
- Aceite que o conteúdo pesquisável não se beneficiará da persistência da Reserva de Cache

### "Largura de banda de origem maior que o esperado"

**Causa:** a Reserva de Cache busca conteúdo **não compactado** da origem, mesmo que seja veiculado compactado aos visitantes
**Solução:**

- Se a origem cobrar por largura de banda, considere os custos de transferência não compactados
- A reserva de cache é compactada para visitantes automaticamente (economiza largura de banda do visitante)
- Compare: economia de saída de origem versus custos mais elevados de busca não compactada

### "Imagens Cloudflare não armazenadas em cache com reserva de cache"

**Causa:** Imagens Cloudflare com cabeçalho `Vary: Accept` (negociação de formato) são incompatíveis com Reserva de Cache
**Solução:**

- Cache Reserve ignora imagens silenciosamente com Vary para negociação de formato
- Imagens originais (não transformadas) ainda podem ser elegíveis
- Use variantes de imagens Cloudflare ou cache de borda para imagens transformadas

### "Custos operacionais de alta classe A"

**Causa:** Faltas frequentes de cache, TTLs curtos ou revalidações frequentes
**Solução:** Aumente o TTL para conteúdo estável (mais de 24 horas), ative o Tiered Cache para reduzir perdas diretas de reserva de cache ou use obsoleto enquanto revalida

### "A purga não funciona como esperado"

**Causa:** A limpeza por tag apenas aciona a revalidação, mas não remove do armazenamento da Reserva de Cache
**Solução:** use a limpeza por URL para remoção imediata ou desative a Reserva de Cache e limpe todos os dados para remoção completa

### "Ativos O2O (laranja para laranja) sem armazenamento em cache"

**Causa:** Laranja para Laranja (zona com proxy solicitando outra zona com proxy na Cloudflare) ignora a Reserva de Cache
**Solução:**

- **O que é O2O**: Zona A (proxy) → Zona B (proxy), ambas na Cloudflare
- **Detecção**: Verifique `cf-cache-status` para `BYPASS` e revise o caminho da solicitação
- **Solução alternativa**: use R2 ou acesso direto à origem em vez de cadeias de proxy O2O

### "A reserva de cache deve estar desativada antes de limpar os dados"

**Causa:** Tentativa de limpar dados de reserva de cache enquanto ainda está ativado
**Solução:** desative primeiro a Reserva de Cache, aguarde brevemente pela propagação (5s) e depois limpe os dados (pode levar até 24 horas)

## Limites

| Limite                               | Valor                                 | Notas                                              |
| ------------------------------------ | ------------------------------------- | -------------------------------------------------- |
| TTL mínimo                           | 10 horas (36.000 segundos)            | Ativos com TTL mais curto não elegíveis            |
| Retenção padrão                      | 30 dias (2592.000 segundos)           | Configurável                                       |
| Tamanho máximo do arquivo            | Igual aos limites R2                  | Sem limite prático                                 |
| Tempo de purga/limpeza               | Até 24 horas                          | Tempo de propagação completo                       |
| Requisito do plano                   | Reserva de cache paga ou Smart Shield | Não disponível em planos gratuitos                 |
| Cabeçalho de comprimento de conteúdo | Obrigatório                           | Deve estar presente para elegibilidade             |
| Cabeçalho Set-Cookie                 | Bloqueia cache                        | Não deve estar presente (ou usar diretiva privada) |
| Variar cabeçalho                     | Não pode ser \*                       | Pode usar Vary: Accept-Encoding                    |
| Transformações de imagem             | Variantes não elegíveis               | Somente imagens originais                          |
| Solicitações de intervalo            | NÃO suportado                         | HTTP 206 ignora reserva de cache                   |
| Compressão                           | Busca descompactado                   | Serve comprimido aos visitantes                    |
| Controle do trabalhador              | Somente em nível de zona              | Não é possível controlar por solicitação           |
| Solicitações O2O                     | Ignorado                              | Laranja com Laranja não elegível                   |

## Recursos Adicionais

- **Documentos oficiais**: https://developers.cloudflare.com/cache/advanced-configuration/cache-reserve/
- **Referência de API**: https://developers.cloudflare.com/api/resources/cache/subresources/cache_reserve/
- **Regras de cache**: https://developers.cloudflare.com/cache/how-to/cache-rules/
- **API de cache de trabalho**: https://developers.cloudflare.com/workers/runtime-apis/cache/
- **Documentação R2**: https://developers.cloudflare.com/r2/
- **Escudo Inteligente**: https://developers.cloudflare.com/smart-shield/
- **Cache em camadas**: https://developers.cloudflare.com/cache/how-to/tiered-cache/

## Fluxograma de solução de problemas

O ativo não está armazenado em cache na Reserva de Cache?```

1. A Reserva de Cache está habilitada para zona?
   → Não: Habilitar via Dashboard ou API
   → Sim: continue na etapa 2

2. O cache em camadas está habilitado?
   → Não: Habilite o cache em camadas (obrigatório!)
   → Sim: continue na etapa 3

3. O ativo tem TTL ≥ 10 horas?
   → Não: Aumento por meio de regras de cache (substituição de edge_ttl)
   → Sim: continue na etapa 4

4. O cabeçalho Content-Length está presente?
   → Não: corrija a origem para incluir o comprimento do conteúdo
   → Sim: continue na etapa 5

5. O cabeçalho Set-Cookie está presente?
   → Sim: Remova Set-Cookie ou escopo adequadamente
   → Não: continue na etapa 6

6. O cabeçalho Vary está definido como \*?
   → Sim: Mude para um valor específico (por exemplo, Accept-Encoding)
   → Não: continue na etapa 7

7. Esta é uma solicitação de intervalo?
   → Sim: solicitações de intervalo ignoram a reserva de cache (não compatível)
   → Não: continue na etapa 8

8. Esta é uma solicitação O2O (Orange-to-Orange)?
   → Sim: O2O ignora a reserva de cache
   → Não: continue na etapa 9

9. Verifique o campo Logpush CacheReserveUsed
   → Filtre os logs para ver se os ativos atingiram a Reserva de Cache
   → Verifique o cabeçalho cf-cache-status (deve ser HIT após a primeira solicitação)

```
## Veja também

- [README](./README.md) - Visão geral e conceitos básicos
- [Configuração](./configuration.md) - Regras de configuração e cache
- [Referência da API](./api.md) - Limpeza e monitoramento
- [Padrões](./patterns.md) - Melhores práticas e otimização
```
