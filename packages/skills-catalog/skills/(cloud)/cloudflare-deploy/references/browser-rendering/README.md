# Referência de habilidade de renderização do navegador Cloudflare

**Descrição**: Conhecimento especializado em renderização de navegador Cloudflare: controle o Chrome headless na rede global da Cloudflare para automação de navegador, capturas de tela, PDFs, web scraping, testes e geração de conteúdo.

**Quando usar**: Qualquer tarefa que envolva o Cloudflare Browser Rendering, incluindo: captura de tela, geração de PDFs, web scraping, automação de navegador, teste de aplicativos web, extração de dados estruturados, captura de métricas de página ou automatização de interações do navegador.

## Árvore de decisão

### API REST versus vinculações de trabalhadores

**Use a API REST quando:**

- Tarefas únicas e sem estado (captura de tela, PDF, busca de conteúdo)
- Nenhuma infraestrutura de trabalhadores ainda
- Integrações simples de serviços externos
- Precisa de prototipagem rápida sem implantação

**Use vinculações de trabalhadores quando:**

- Fluxos de trabalho complexos de automação de navegador
- Precisa de reutilização de sessão para desempenho
- Múltiplas interações de página por solicitação
- Scripting e lógica personalizados necessários
- Construindo aplicações de produção

### Marionetista vs Dramaturgo

| Recurso               | Marionetista                  | Dramaturgo                      |
| --------------------- | ----------------------------- | ------------------------------- |
| Estilo API            | Protocolo Chrome DevTools     | Abstrações de alto nível        |
| Seletores             | CSS, XPath                    | CSS, texto, função, ID de teste |
| Melhor para           | Controle avançado, acesso CDP | Automação rápida, testes        |
| Curva de aprendizagem | Mais íngreme                  | Mais suave                      |

**Usar o Puppeteer:** Precisa de acesso ao protocolo CDP, recursos específicos do Chrome, migração do código existente do Puppeteer
**Use o Playwright:** APIs de seletores modernos, padrões entre navegadores, desenvolvimento mais rápido

## Resumo dos limites de nível

| Limite                    | Nível gratuito | Nível pago  |
| ------------------------- | -------------- | ----------- |
| Tempo diário de navegação | 10 minutos     | Ilimitado\* |
| Sessões simultâneas       | 3              | 30          |
| Solicitações por minuto   | 6              | 180         |

\*Sujeito à política de uso justo. Consulte [gotchas.md](gotchas.md) para obter detalhes.

## Ordem de leitura

**Novidade na renderização do navegador:**

1. [configuration.md](configuration.md) - Configuração e implantação
2. [patterns.md](patterns.md) – Casos de uso comuns com exemplos
3. [api.md](api.md) - referência da API
4. [gotchas.md](gotchas.md) - Evite armadilhas comuns

**Tarefa específica:**

- **Configuração/implantação** → [configuration.md](configuration.md)
- **Referência/endpoints de API** → [api.md](api.md)
- **Exemplo de código/padrões** → [patterns.md](patterns.md)
- **Depuração/solução de problemas** → [gotchas.md](gotchas.md)

**Usuários da API REST:**

- Comece com a seção [api.md](api.md) REST API
- Verifique [gotchas.md](gotchas.md) para limites de taxa

**Usuários trabalhadores:**

- Comece com [configuration.md](configuration.md)
- Revise [patterns.md](patterns.md) para gerenciamento de sessão
- Referência [api.md](api.md) para vinculações de trabalhadores

## Nesta referência

- **[configuration.md](configuration.md)** - Configuração, implantação, configuração do wrangler, compatibilidade
- **[api.md](api.md)** - Endpoints da API REST + Vinculações de trabalhadores (Puppeteer/Playwright)
- **[patterns.md](patterns.md)** - Padrões comuns, casos de uso, exemplos reais
- **[gotchas.md](gotchas.md)** - Solução de problemas, práticas recomendadas, limites de nível, erros comuns

## Veja também

- [Documentos Cloudflare](https://developers.cloudflare.com/browser-rendering/)
