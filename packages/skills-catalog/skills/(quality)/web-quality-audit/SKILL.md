---
name: web-quality-audit
description: Auditoria abrangente de qualidade web cobrindo performance, acessibilidade, SEO e boas práticas numa única revisão. Use quando pedirem "auditar meu site", "revisar qualidade web", "rodar lighthouse", "checar qualidade da página" ou "otimizar meu site" em várias frentes de uma vez. Orquestra skills especializadas para aprofundar. NÃO use para auditoria só em uma área — prefira core-web-vitals, web-accessibility, seo ou web-best-practices para trabalho focado.
license: MIT
metadata:
  author: web-quality-skills
  version: '1.0'
---

# Auditoria de qualidade web

Revisão de qualidade abrangente baseada em auditorias Google Lighthouse. Cobre Performance, Acessibilidade, SEO e Boas práticas em mais de 150 verificações.

## Como funciona

1. Analise o código/projeto fornecido em busca de problemas de qualidade
2. Classifique achados por severidade (Crítico, Alto, Médio, Baixo)
3. Forneça recomendações acionáveis e específicas
4. Inclua exemplos de código para correções

## Categorias da auditoria

### Performance (~40% dos achados típicos)

**Core Web Vitals** — devem passar para boa experiência de página:

- **LCP (Largest Contentful Paint) < 2,5s.** O maior elemento visível deve renderizar rápido. Otimize imagens, fontes e tempo de resposta do servidor.
- **INP (Interaction to Next Paint) < 200ms.** Interações devem parecer instantâneas. Reduza execução de JavaScript e quebre tarefas longas.
- **CLS (Cumulative Layout Shift) < 0,1.** O conteúdo não deve “pular”. Defina dimensões explícitas em imagens, embeds e anúncios.

**Otimização de recursos:**

- **Comprimir imagens.** WebP/AVIF com fallback. Tamanhos corretos via `srcset`.
- **Minimizar JavaScript.** Remova código morto. Code splitting. Adie scripts não críticos.
- **Otimizar CSS.** Extraia CSS crítico. Remova estilos não usados. Evite `@import`.
- **Fontes eficientes.** `font-display: swap`. Preload de fontes críticas. Subconjunto de caracteres.

**Estratégia de carregamento:**

- **Preconnect** a origens. `<link rel="preconnect">` para domínios terceiros.
- **Preload** de ativos críticos. Imagens LCP, fontes, CSS above-the-fold.
- **Lazy load** abaixo da dobra. Imagens, iframes, componentes pesados.
- **Cache** eficiente. TTL longo para estáticos. Imutável para arquivos com hash.

### Acessibilidade (~30% dos achados típicos)

**Perceptível:**

- **Texto alternativo.** Toda `<img>` com `alt` significativo. Decorativas com `alt=""`.
- **Contraste de cor.** Mínimo 4,5:1 texto normal, 3:1 texto grande (WCAG AA).
- **Não depender só de cor.** Ícones, padrões ou texto junto com indicadores de cor.
- **Legendas e transcrições.** Vídeo com legendas. Áudio com transcrição.

**Operável:**

- **Teclado.** Toda funcionalidade via teclado. Sem armadilhas de foco.
- **Foco visível.** Indicadores claros em elementos interativos.
- **Links de pular.** “Pular para o conteúdo principal” para usuários de teclado.
- **Tempo suficiente.** Usuário pode estender limites. Sem avanço automático sem controle.

**Compreensível:**

- **Idioma da página.** Atributo `lang` em `<html>`.
- **Navegação consistente.** Mesma estrutura entre páginas.
- **Identificação de erros.** Erros de formulário claros e associados aos campos.
- **Rótulos e instruções.** Todo input com rótulo associado.

**Robusto:**

- **HTML válido.** Sem IDs duplicados. Aninhamento correto.
- **ARIA correta.** Prefira elementos nativos. Papéis coerentes com o comportamento.
- **Nome, papel, valor.** Elementos interativos com nomes acessíveis e papéis corretos.

### SEO (~15% dos achados típicos)

**Rastreabilidade:**

- **robots.txt válido.** Não bloqueie recursos importantes.
- **Sitemap XML.** Lista páginas importantes. Enviado ao Search Console.
- **URLs canônicas.** Evita duplicação.
- **Sem noindex** em páginas importantes. Verifique meta robots e headers.

**SEO on-page:**

- **Títulos únicos.** 50–60 caracteres. Palavra-chave principal.
- **Meta descriptions.** 150–160 caracteres. Convicentes e únicas.
- **Hierarquia de headings.** Um `<h1>`. Estrutura lógica.
- **Texto de link descritivo.** Evite só “clique aqui” ou “leia mais”.

**SEO técnico:**

- **Mobile-friendly.** Design responsivo. Alvos de toque ≥ 48px.
- **HTTPS.** Conexão segura.
- **Carregamento rápido.** Performance impacta ranqueamento.
- **Dados estruturados.** JSON-LD para rich results (Article, Product, FAQ, etc.).

### Boas práticas (~15% dos achados típicos)

**Segurança:**

- **HTTPS em tudo.** Sem mixed content. HSTS quando apropriado.
- **Sem bibliotecas vulneráveis.** Dependências atualizadas.
- **Headers CSP.** Content Security Policy contra XSS.
- **Sem source maps expostos** em builds de produção.

**Padrões modernos:**

- **Sem APIs obsoletas.** Substitua `document.write`, XHR síncrono, etc.
- **Doctype válido.** `<!DOCTYPE html>`.
- **Charset declarado.** `<meta charset="UTF-8">` como primeiro elemento em `<head>`.
- **Sem erros de console.** Console limpo. Sem problemas CORS óbvios.

**Padrões de UX:**

- **Sem intersticiais intrusivos.** Especialmente no mobile.
- **Pedidos de permissão claros.** Só quando necessário, com contexto.
- **Botões honestos.** O rótulo corresponde à ação.

## Níveis de severidade

| Nível       | Descrição                                    | Ação                      |
| ----------- | -------------------------------------------- | ------------------------- |
| **Crítico** | Vulnerabilidades de segurança, falhas totais | Corrigir já               |
| **Alto**    | Falhas de Core Web Vitals, barreiras a11y    | Corrigir antes do go-live |
| **Médio**   | Oportunidades de performance, melhorias SEO  | Corrigir na sprint        |
| **Baixo**   | Otimizações menores, qualidade de código     | Quando conveniente        |

## Formato de saída da auditoria

Ao auditar, estruture assim:

```markdown
## Resultados da auditoria

### Issues críticas (X encontradas)

- **[Categoria]** Descrição. Arquivo: `path/to/file.js:123`
  - **Impacto:** Por que importa
  - **Correção:** Mudança de código ou recomendação específica

### Alta prioridade (X encontradas)

...

### Resumo

- Performance: X issues (Y críticas)
- Acessibilidade: X issues (Y críticas)
- SEO: X issues
- Boas práticas: X issues

### Priorização sugerida

1. Primeiro corrigir isto porque...
2. Depois tratar...
3. Por fim otimizar...
```

## Checklist rápido

### Antes de cada deploy

- [ ] Core Web Vitals ok
- [ ] Sem erros de acessibilidade (axe/Lighthouse)
- [ ] Sem erros de console
- [ ] HTTPS ok
- [ ] Meta tags presentes

### Revisão semanal

- [ ] Search Console por issues
- [ ] Tendências de Core Web Vitals
- [ ] Atualizar dependências
- [ ] Testar com leitor de tela

### Aprofundamento mensal

- [ ] Auditoria Lighthouse completa
- [ ] Profiling de performance
- [ ] Auditoria a11y com usuários reais
- [ ] Revisão de palavras-chave SEO

## Referências

Para diretrizes detalhadas por área:

- [Otimização de performance](../performance/SKILL.md)
- [Core Web Vitals](../core-web-vitals/SKILL.md)
- [Acessibilidade](../accessibility/SKILL.md)
- [SEO](../seo/SKILL.md)
- [Boas práticas](../best-practices/SKILL.md)
