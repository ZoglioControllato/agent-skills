# Bibliotecas de ícones

Leia este arquivo quando o usuário solicitar diagramas com ícones de serviço (AWS, GCP, Azure, Kubernetes, etc.) ou solicitar diagramas de arquitetura profissional.

## Como funciona

Excalidraw oferece suporte a bibliotecas de ícones (arquivos `.excalidrawlib`) que fornecem ícones padronizados e profissionais. Esta habilidade pode usar bibliotecas de ícones pré-divididos para criar diagramas de arquitetura sofisticados.

## Verificando bibliotecas disponíveis```

Look for: libraries/<library-name>/reference.md

````
Se `reference.md` existir, a biblioteca está pronta. Ele contém uma tabela de consulta de todos os nomes de ícones disponíveis.

Se nenhuma biblioteca estiver configurada, ofereça duas opções:

1. Crie o diagrama usando formas básicas (retângulos, elipses) com rótulos – ainda funcionais, apenas menos polidos visualmente
2. Oriente o usuário na configuração da biblioteca (veja abaixo)

## Usando ícones (scripts Python - recomendado)

O repositório inclui scripts Python que lidam com a integração de ícones sem consumir tokens de contexto de IA:

### Adicionando ícones a um diagrama```bash
python scripts/add-icon-to-diagram.py \
  <diagram-path> <icon-name> <x> <y> \
  [--label "Text"] [--library-path PATH]
````

O sinalizador `--label` adiciona um rótulo de texto abaixo do ícone. Editar via `.excalidraw.edit` está habilitado por padrão; passe `--no-use-edit-suffix` para desabilitar.

**Exemplos:**

```bash
# Add EC2 icon at position (400, 300) with label
python scripts/add-icon-to-diagram.py diagram.excalidraw EC2 400 300 --label "Web Server"

# Add icon from a different library
python scripts/add-icon-to-diagram.py diagram.excalidraw Compute-Engine 500 200 \
  --library-path libraries/gcp-icons --label "API Server"
```

### Adicionando setas de conexão```bash

python scripts/add-arrow.py \
 <diagram-path> <from-x> <from-y> <to-x> <to-y> \
 [--label "Text"] [--style solid|dashed|dotted] [--color HEX]

````

**Exemplos:**

```bash
# Simple arrow
python scripts/add-arrow.py diagram.excalidraw 300 250 500 300

# Arrow with label and custom style
python scripts/add-arrow.py diagram.excalidraw 400 350 600 400 \
  --label "HTTPS" --style dashed --color "#7950f2"
````

### Fluxo de trabalho completo```bash

# 1. Create base diagram with title and structure

# (Create .excalidraw file with basic elements: title text, region rectangles)

# 2. Check icon availability

# Read: libraries/aws-architecture-icons/reference.md

# 3. Add icons with labels

python scripts/add-icon-to-diagram.py my-diagram.excalidraw "Internet-gateway" 200 150 --label "Internet Gateway"
python scripts/add-icon-to-diagram.py my-diagram.excalidraw VPC 250 250
python scripts/add-icon-to-diagram.py my-diagram.excalidraw ELB 350 300 --label "Load Balancer"
python scripts/add-icon-to-diagram.py my-diagram.excalidraw EC2 450 350 --label "Web Server"
python scripts/add-icon-to-diagram.py my-diagram.excalidraw RDS 550 400 --label "Database"

# 4. Add connecting arrows

python scripts/add-arrow.py my-diagram.excalidraw 250 200 300 250 --label "traffic"
python scripts/add-arrow.py my-diagram.excalidraw 300 300 400 300
python scripts/add-arrow.py my-diagram.excalidraw 500 380 600 400 --label "SQL" --style dashed

````

**Por que usar scripts:**

- ✅ Sem consumo de token – os dados JSON do ícone (200-1000 linhas cada) nunca entram no contexto da IA
- ✅ Coordenadas precisas — cálculos tratados de forma determinística
- ✅ Gerenciamento automático de ID – sem risco de colisão
- ✅ Rápido e reutilizável — funciona com qualquer biblioteca Excalidraw

## Configurando uma biblioteca

Oriente o usuário através destas etapas:

### Etapa 1: Criar diretório de biblioteca```bash
mkdir -p skills/excalidraw-studio/libraries/<library-name>
````

### Etapa 2: Baixe a biblioteca

- Visite: <https://libraries.excalidraw.com/>
- Procure o conjunto de ícones desejado (por exemplo, "Ícones de arquitetura AWS")
- Clique em download para obter o arquivo `.excalidrawlib`
- Coloque-o no diretório da Etapa 1

### Etapa 3: execute o script divisor```bash

python skills/excalidraw-studio/scripts/split-excalidraw-library.py \
 skills/excalidraw-studio/libraries/<library-name>/

````
### Etapa 4: verificar

Depois de executar o script, esta estrutura deverá existir:```
libraries/<library-name>/
  <library-name>.excalidrawlib  (original)
  reference.md                  (generated — icon lookup table)
  icons/                        (generated — individual icon files)
    API-Gateway.json
    EC2.json
    Lambda.json
    S3.json
    ...
````

## Integração manual de ícones (substituto)

Use isto apenas se os scripts Python não estiverem disponíveis. Essa abordagem é cara e propensa a erros.

1. Leia `libraries/<library-name>/reference.md` para encontrar nomes de ícones
2. Leia arquivos JSON de ícones individuais em `icons/` (200-1000 linhas cada)
3. Extraia a matriz de elementos, calcule a caixa delimitadora, aplique o deslocamento de coordenadas
4. Gere novos IDs exclusivos, atualize referências de groupIds
5. Copie os elementos transformados no diagrama

**Desafios:**

- ⚠️ Alto consumo de tokens (200-1000 linhas por ícone)
- ⚠️ Transformação de coordenadas complexas
- ⚠️ Risco de colisão de identidade
- ⚠️ Demorado para muitos ícones

## Bibliotecas Suportadas

Este fluxo de trabalho funciona com qualquer arquivo `.excalidrawlib` válido de <https://libraries.excalidraw.com/>. Categorias comuns:

- Ícones de serviço em nuvem (AWS, GCP, Azure)
- Ícones Kubernetes/infraestrutura
- Ícones de interface do usuário / materiais
- Ícones de diagrama de rede

A disponibilidade e os nomes variam; verifique no site antes de recomendar aos usuários.
