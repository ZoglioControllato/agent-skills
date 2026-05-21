# Análise de base de código (implantação)

Use esta referência para detecção específica da estrutura e seleção de comandos de construção/inicialização ao preparar uma implantação de Renderização.

## Projetos Node.js

- Leia `package.json` para detectar framework (Express, Next.js, Nest.js, Fastify, etc.)
- Verifique a seção `scripts` para comandos de construção/inicialização
- Procure o campo `engines` para a versão do Node ou procure em `.node-versions` ou `.nvmrc`
- Detectar gerenciador de pacotes:
  - `bun.lockb` (Bun) -> `bun install --frozen-lockfile` / `bun run start`
  - `pnpm-lock.yaml` (pnpm) -> `pnpm install --frozen-lockfile` / `pnpm start`
  - `yarn.lock` (Yarn) -> `yarn install --frozen-

lockfile`/`início do fio`

- `package-lock.json` (npm) -> `npm ci` / `npm start`
- somente `package.json` (npm fallback) -> `npm install` / `npm start`

## Projetos Python

- Verifique se há arquivos de dependência e detecte o gerenciador de pacotes:
  - `uv.lock` (uv) -> `uv sync` / `uv run gunicorn app:app`
  - `poetry.lock` (Poesia) -> `poetry install --no-dev` / `poetry run gunicorn app:app`
  - `Pipfile.lock` (pipenv) -> `pipenv install --deploy` / `pipenv executar gunicorn app:app`
  - `requirements.txt` (pip) -> `pip install -r requisitos.txt` / `gunicorn app:app`
  - apenas `pyproject.toml` -> verifique `[tool.uv]`, `[tool.poetry]`,

ou use pip

- Detectar framework: Django, Flask, FastAPI, Celery, outros
- Verifique a versão do Python:
  - `.python-versão` (uv/pyenv)
  - `runtime.txt` (específico da renderização)
  - `pyproject.toml` (requer campo python)

## Projetos Go

- Leia `go.mod` para dependências
- Identificar framework web (Gin, Echo, Chi, Fiber, net/http)
- Nota Go versão de `go.mod`

## Sites estáticos

- Procure os diretórios de saída do build (`build/`, `dist/`, `site/`, `public/`)
- Estrutura de detecção: React, Vue, Gatsby, Next.js (exportação estática)
- Verifique os scripts de construção em `package.json`

## Projetos Docker

- Procure por `Dockerfile`
- Observe as portas expostas e os estágios de construção
- Verifique os padrões `docker-compose.yml`

## Informações importantes para extrair

- Comando de construção (por exemplo, `npm ci`, `pip install -r requisitos.txt`, `go build`)
- Comando de inicialização (por exemplo, `npm start`, `gunicorn app:app`, `./bin/app`)
- Variáveis de ambiente usadas no código (chaves de API, URLs de banco de dados, segredos)
- Requisitos de banco de dados (PostgreSQL, Redis, MongoDB)
- Vinculação de porta (verifique se o aplicativo usa uma variável de ambiente para a porta ser executada)
