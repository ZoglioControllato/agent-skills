# Integração CI/CD

Configurações completas de CI/CD para espaços de trabalho Nx.

## Ações do GitHub

### Fluxo de trabalho básico de CI```yaml

name: CI
on:
push:
branches: [main]
pull_request:
branches: [main]

env:
NX_CLOUD_ACCESS_TOKEN: ${{ secrets.NX_CLOUD_ACCESS_TOKEN }}

jobs:
main:
runs-on: ubuntu-latest
steps: - uses: actions/checkout@v4
with:
fetch-depth: 0

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Derive SHAs for affected commands
        uses: nrwl/nx-set-shas@v4

      - name: Run affected lint
        run: npx nx affected -t lint --parallel=3

      - name: Run affected test
        run: npx nx affected -t test --parallel=3 --configuration=ci

      - name: Run affected build
        run: npx nx affected -t build --parallel=3

      - name: Run affected e2e
        run: npx nx affected -t e2e --parallel=1

````
### Estratégia Matricial```yaml
name: CI Matrix
on: [push, pull_request]

jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node: [18, 20]
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          cache: "npm"

      - run: npm ci
      - uses: nrwl/nx-set-shas@v4
      - run: npx nx affected -t test --parallel=3
````

### Implantar fluxo de trabalho```yaml

name: Deploy
on:
push:
branches: [main]

jobs:
deploy:
runs-on: ubuntu-latest
steps: - uses: actions/checkout@v4
with:
fetch-depth: 0

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"

      - run: npm ci
      - uses: nrwl/nx-set-shas@v4

      # Build affected apps
      - name: Build affected
        run: npx nx affected -t build --configuration=production

      # Deploy to production
      - name: Deploy
        run: |
          for app in $(npx nx show projects --affected --type app); do
            echo "Deploying $app..."
            # Add your deployment logic here
          done

````
## CI do GitLab

### Pipeline Básico```yaml
image: node:20

cache:
  key:
    files:
      - package-lock.json
  paths:
    - node_modules/
    - .nx/cache

stages:
  - setup
  - test
  - build
  - deploy

variables:
  NX_CLOUD_ACCESS_TOKEN: $NX_CLOUD_ACCESS_TOKEN

install:
  stage: setup
  script:
    - npm ci
  artifacts:
    paths:
      - node_modules/
    expire_in: 1 day

lint:
  stage: test
  needs: [install]
  script:
    - npx nx affected -t lint --base=$CI_MERGE_REQUEST_DIFF_BASE_SHA --parallel=3
  only:
    - merge_requests

test:
  stage: test
  needs: [install]
  script:
    - npx nx affected -t test --base=$CI_MERGE_REQUEST_DIFF_BASE_SHA --parallel=3 --coverage
  coverage: '/Statements\s*:\s*(\d+\.?\d*)%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
  only:
    - merge_requests

build:
  stage: build
  needs: [install]
  script:
    - npx nx affected -t build --base=$CI_MERGE_REQUEST_DIFF_BASE_SHA --configuration=production
  artifacts:
    paths:
      - dist/
    expire_in: 1 week
  only:
    - merge_requests
    - main
````

## Azure Pipelines

### Pipeline Básico```yaml

trigger:

- main

pr:

- main

pool:
vmImage: "ubuntu-latest"

variables:
CI: "true"
NX_CLOUD_ACCESS_TOKEN: $(NX_CLOUD_ACCESS_TOKEN)

steps:

- task: NodeTool@0
  inputs:
  versionSpec: "20.x"
  displayName: "Install Node.js"

- script: npm ci
  displayName: "Install dependencies"

- script: |
  npx nx affected -t lint --base=origin/main --parallel=3
  displayName: "Lint affected"

- script: |
  npx nx affected -t test --base=origin/main --parallel=3 --configuration=ci
  displayName: "Test affected"

- script: |
  npx nx affected -t build --base=origin/main --parallel=3
  displayName: "Build affected"

- task: PublishTestResults@2
  condition: succeededOrFailed()
  inputs:
  testResultsFormat: "JUnit"
  testResultsFiles: "\*\*/junit.xml"

- task: PublishCodeCoverageResults@1
  inputs:
  codeCoverageTool: "Cobertura"
  summaryFileLocation: "coverage/cobertura-coverage.xml"

````
## CírculoCI

### Configuração Básica```yaml
version: 2.1

orbs:
  node: circleci/node@5.1

jobs:
  main:
    docker:
      - image: cimg/node:20.0
    steps:
      - checkout
      - node/install-packages:
          pkg-manager: npm
      - run:
          name: Run affected lint
          command: npx nx affected -t lint --base=origin/main --parallel=3
      - run:
          name: Run affected test
          command: npx nx affected -t test --base=origin/main --parallel=3
      - run:
          name: Run affected build
          command: npx nx affected -t build --base=origin/main --parallel=3

workflows:
  version: 2
  ci:
    jobs:
      - main
````

##Jenkins

### Arquivo Jenkins```groovy

pipeline {
agent any

environment {
NX_CLOUD_ACCESS_TOKEN = credentials('nx-cloud-token')
}

stages {
stage('Install') {
steps {
sh 'npm ci'
}
}

    stage('Lint') {
      steps {
        sh 'npx nx affected -t lint --base=origin/main --parallel=3'
      }
    }

    stage('Test') {
      steps {
        sh 'npx nx affected -t test --base=origin/main --parallel=3'
      }
    }

    stage('Build') {
      steps {
        sh 'npx nx affected -t build --base=origin/main --parallel=3'
      }
    }

}

post {
always {
junit '\*\*/junit.xml'
publishHTML(target: [
reportDir: 'coverage',
reportFiles: 'index.html',
reportName: 'Coverage Report'
])
}
}
}

````
## Melhores práticas para CI/CD

### Usar comandos afetados

Sempre use comandos afetados para executar apenas o que mudou:```bash
# Good
nx affected -t test --base=main

# Avoid (in CI)
nx run-many -t test --all
````

### Ativar nuvem Nx

Adicione Nx Cloud para execução de tarefas distribuídas e cache remoto:```yaml
env:
NX_CLOUD_ACCESS_TOKEN: ${{ secrets.NX_CLOUD_ACCESS_TOKEN }}

````
### Definir SHA de base adequado

Certifique-se de que o histórico do git esteja disponível:```yaml
- uses: actions/checkout@v4
  with:
    fetch-depth: 0  # Important for affected commands
````

### Execução Paralela

Use execução paralela para melhor desempenho:```bash
nx affected -t test --parallel=3

````
### Dependências de cache

Armazene node_modules em cache entre execuções:```yaml
- uses: actions/setup-node@v4
  with:
    cache: "npm"
````

### Construção e implantação separadas

Mantenha a compilação e a implantação como tarefas separadas:```yaml
jobs:
build:
steps: - run: nx affected -t build
deploy:
needs: [build]
steps: - run: deploy.sh

```

```
