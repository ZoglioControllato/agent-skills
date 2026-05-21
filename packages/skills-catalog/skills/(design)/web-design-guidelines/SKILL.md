---
name: web-design-guidelines
description: Revisa código de UI conforme Web Interface Guidelines. Use quando pedirem para "revisar minha UI", "checar acessibilidade", "auditar design", "revisar UX" ou "verificar meu site frente às melhores práticas". Foca em visual e padrões de interação. NÃO use para auditorias de performance (use core-web-vitals), SEO (use seo) ou auditorias amplas do site (use web-quality-audit).
metadata:
  author: vercel
  version: '1.0.0'
  argument-hint: <file-or-pattern>
---

# Web Interface Guidelines

Revise arquivos quanto ao cumprimento das Web Interface Guidelines.

## Como funciona

1. Leia as diretrizes em `#[[file:references/guideline.md]]`
2. Leia os arquivos indicados (ou peça ao usuário arquivos/padrão)
3. Verifique todas as regras das diretrizes
4. Emita achados no formato compacto `arquivo:linha`

## Referência das diretrizes

Todas as regras e instruções de formato de saída estão em:

```
#[[file:references/guideline.md]]
```

As diretrizes cobrem:

- Acessibilidade (ARIA, HTML semântico, navegação por teclado)
- Estados de foco e interação por teclado
- Formulários (autocomplete, validação, labels)
- Animação (reduced motion, performance)
- Tipografia (caracteres adequados, formatação de números)
- Conteúdo (overflow, estados vazios)
- Imagens (dimensões, lazy loading)
- Performance (virtualização, leituras no DOM)
- Navegação e estado (sincronização com URL, deep linking)
- Toque e interação (tap delays, safe areas)
- Modo escuro e temas
- Locale e i18n
- Segurança na hidratação
- Antipadrões comuns a sinalizar

## Uso

Quando o usuário informar arquivo ou padrão:

1. Leia `references/guideline.md`
2. Leia os arquivos especificados
3. Aplique todas as regras das diretrizes
4. Emita achados usando o formato definido nas diretrizes

Se nenhum arquivo for especificado, pergunte quais revisar.

## Formato de saída

Siga o formato das diretrizes:

- Agrupe achados por arquivo
- Use formato `arquivo:linha` (clicável no VS Code)
- Conciso e alto sinal/ruído
- Informe problema + local
- Omita explicação salvo quando o fix não for óbvio
