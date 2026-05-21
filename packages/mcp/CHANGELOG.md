## 0.1.3 (2026-04-01)

### 🩹 Correções

- corrigir estrutura de owner em marketplace.json e adicionar mcp.json ([8e39105bf](https://github.com/tech-leads-club/agent-skills/commit/8e39105bf))

### ❤️ Agradecimentos

- felipfr

## 0.1.2 (2026-03-12)

Apenas bump de versão de @tech-leads-club/agent-skills-mcp para alinhar com outros projetos; sem alterações de código.

## 0.1.1 (2026-02-28)

### 🩹 Correções

- tornar campo deprecated opcional no RegistrySchema e garantir padrão de array vazio em getRegistry ([b8ad1cba5](https://github.com/tech-leads-club/agent-skills/commit/b8ad1cba5))

### 💅 Refatorações

- atualizar URLs do CDN para usar o pacote npm com consistência entre MCP e CLI ([308c1a444](https://github.com/tech-leads-club/agent-skills/commit/308c1a444))

### ❤️ Agradecimentos

- Felipe Rodrigues @felipfr

## 0.1.0 (2026-02-26)

### 🚀 Funcionalidades

- implementar new catalog and usage prompts with enhanced descriptions and functionality ([8e97e55c1](https://github.com/tech-leads-club/agent-skills/commit/8e97e55c1))
- adicionar Jest configuration for MCP to enable unit testing with TypeScript ([172817889](https://github.com/tech-leads-club/agent-skills/commit/172817889))
- adicionar package.json for agent-skills-mcp including metadata, dependencies, and scripts ([b3597835a](https://github.com/tech-leads-club/agent-skills/commit/b3597835a))
- adicionar project.json for MCP configuration including build, serve, lint, and test targets ([a29e7c09d](https://github.com/tech-leads-club/agent-skills/commit/a29e7c09d))
- adicionar README.md for agent-skills-mcp detailing usage, workflow, and available tools ([315b5f90c](https://github.com/tech-leads-club/agent-skills/commit/315b5f90c))
- adicionar tsconfig.app.json for MCP to configure TypeScript compilation settings ([1c67da2da](https://github.com/tech-leads-club/agent-skills/commit/1c67da2da))
- adicionar TypeScript configuration file for MCP with module settings and references ([5729ada1d](https://github.com/tech-leads-club/agent-skills/commit/5729ada1d))
- adicionar TypeScript configuration for unit testing with Jest in MCP ([15cd59418](https://github.com/tech-leads-club/agent-skills/commit/15cd59418))
- criar plugin.json for agent-skills MCP with essential metadata and author information ([466535c12](https://github.com/tech-leads-club/agent-skills/commit/466535c12))
- adicionar plugin.json for agent-skills MCP with metadata and configuration details ([149cdb2dc](https://github.com/tech-leads-club/agent-skills/commit/149cdb2dc))
- adicionar constants for caching, CDN URLs, and skill file management in mcp ([582f757e0](https://github.com/tech-leads-club/agent-skills/commit/582f757e0))
- implementar main entry point for agent-skills-mcp server with tool registration and background index refresh ([abb59c019](https://github.com/tech-leads-club/agent-skills/commit/abb59c019))
- implementar prompt registration for skill discovery and context-based skill usage ([4b1f7e405](https://github.com/tech-leads-club/agent-skills/commit/4b1f7e405))
- implementar caching and fetching logic for skill registry with validation ([2e47ea309](https://github.com/tech-leads-club/agent-skills/commit/2e47ea309))
- implementar resource registration for skills catalog in FastMCP ([22c918abe](https://github.com/tech-leads-club/agent-skills/commit/22c918abe))
- definir TypeScript interfaces for skill registry and search functionality ([95b96e9f5](https://github.com/tech-leads-club/agent-skills/commit/95b96e9f5))
- adicionar utility functions for handling skill descriptions and CDN URL construction ([fcd4b5a8d](https://github.com/tech-leads-club/agent-skills/commit/fcd4b5a8d))
- adicionar fetcher tool for retrieving reference files based on skill instructions ([bda12054b](https://github.com/tech-leads-club/agent-skills/commit/bda12054b))
- adicionar list tool for browsing available skills by category with explicit request handling ([cb026a5ba](https://github.com/tech-leads-club/agent-skills/commit/cb026a5ba))
- adicionar search tool for discovering skills by intent with query handling ([214b62307](https://github.com/tech-leads-club/agent-skills/commit/214b62307))
- adicionar read_skill tool for retrieving skill instructions and reference files ([cbb464a8c](https://github.com/tech-leads-club/agent-skills/commit/cbb464a8c))
- adicionar helper functions to create skill entries and registries for testing ([9578d5f5a](https://github.com/tech-leads-club/agent-skills/commit/9578d5f5a))
- implementar fetcher functions for validating and retrieving skill reference file contents ([1bf8601aa](https://github.com/tech-leads-club/agent-skills/commit/1bf8601aa))
- adicionar skill listing functionality with response formatting ([95d7b2f9a](https://github.com/tech-leads-club/agent-skills/commit/95d7b2f9a))
- implementar search functionality for skills with response formatting ([694f77fd1](https://github.com/tech-leads-club/agent-skills/commit/694f77fd1))
- implementar skill management functions for retrieving and formatting skill files ([64597ebb2](https://github.com/tech-leads-club/agent-skills/commit/64597ebb2))
- adicionar logo SVG asset for MCP package ([3f8ded400](https://github.com/tech-leads-club/agent-skills/commit/3f8ded400))

### 🩹 Correções

- tratar optional arguments in prompt functions to prevent runtime errors ([aa471452c](https://github.com/tech-leads-club/agent-skills/commit/aa471452c))

### 💅 Refatorações

- remover unused prompt utility functions and related constants from utils.ts ([e314221c6](https://github.com/tech-leads-club/agent-skills/commit/e314221c6))
- remover "skill-" prefix from buildPromptName function and related comments ([b6ba6bb1b](https://github.com/tech-leads-club/agent-skills/commit/b6ba6bb1b))

### 📖 Documentação

- atualizar README.md to clarify skill command usage and provide examples for `/skills` and `/use` commands ([b43a838a9](https://github.com/tech-leads-club/agent-skills/commit/b43a838a9))
- atualizar README.md to reflect changes in direct skill access naming conventions ([f8798c016](https://github.com/tech-leads-club/agent-skills/commit/f8798c016))
- atualizar README.md to reflect new package naming for build, lint, and test commands ([fe379a67b](https://github.com/tech-leads-club/agent-skills/commit/fe379a67b))

### ❤️ Agradecimentos

- Felipe Rodrigues @felipfr
