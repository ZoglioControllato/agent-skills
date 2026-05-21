# Ferramentas da Biblioteca Excalidraw

Este diretório contém scripts para trabalhar com bibliotecas Excalidraw.

## split-excalidraw-library.py

Divide um arquivo de biblioteca Excalidraw (`*.excalidrawlib`) em arquivos JSON de ícones individuais para uso eficiente de tokens por assistentes de IA.

### Pré-requisitos

- Python 3.6 ou superior
- Não são necessárias dependências adicionais (usa apenas biblioteca padrão)

### Uso```bash

python split-excalidraw-library.py <path-to-library-directory>

````
### Fluxo de trabalho passo a passo

1. **Criar diretório de biblioteca**:

   ```bash
   mkdir -p habilidades/excalidraw-studio/libraries/aws-architecture-icons
````

2. **Baixe e coloque o arquivo da biblioteca**:
   - Visite: <https://libraries.excalidraw.com/>
   - Procure por "AWS Architecture Icons" e baixe o arquivo `.excalidrawlib`
   - Renomeie-o para corresponder ao nome do diretório: `aws-architecture-icons.excalidrawlib`
   - Coloque-o no diretório criado no passo 1

3. **Execute o script**:

   ```bash
   habilidades python/excalidraw-studio/scripts/split-excalidraw-library.py habilidades/excalidraw-studio/libraries/aws-architecture-icons/
   ```

### Estrutura de saída

O script cria a seguinte estrutura no diretório da biblioteca:```
skills/excalidraw-studio/libraries/aws-architecture-icons/
aws-architecture-icons.excalidrawlib # Original file (kept)
reference.md # Generated: Quick reference table
icons/ # Generated: Individual icon files
API-Gateway.json
CloudFront.json
EC2.json
S3.json
...

````
### O que o script faz

1. **Lê** o arquivo `.excalidrawlib`
2. **Extrai** cada ícone do array `libraryItems`
3. **Higieniza** nomes de ícones para criar nomes de arquivos válidos (espaços → hifens, remove caracteres especiais)
4. **Salva** cada ícone como um arquivo JSON separado no diretório `icons/`
5. **Gera** um arquivo `reference.md` com uma tabela mapeando nomes de ícones para nomes de arquivos

### Benefícios

- **Eficiência de token**: a IA pode primeiro ler o leve `reference.md` para encontrar ícones relevantes e, em seguida, carregar apenas os arquivos de ícones específicos necessários
- **Organização**: os ícones são organizados em uma estrutura de diretórios clara
- **Extensibilidade**: os usuários podem adicionar vários conjuntos de bibliotecas lado a lado

### Fluxo de trabalho recomendado

1. Baixe as bibliotecas Excalidraw desejadas em <https://libraries.excalidraw.com/>
2. Execute este script em cada arquivo de biblioteca
3. Mova as pastas geradas para `../libraries/`
4. O assistente de IA usará arquivos `reference.md` para localizar e usar ícones de forma eficiente

### Fontes de biblioteca (exemplos – verifique a disponibilidade)

- Exemplos encontrados em <https://libraries.excalidraw.com/> podem incluir conjuntos de ícones de nuvem/serviço.
- A disponibilidade muda ao longo do tempo; verifique os nomes exatos das bibliotecas no site antes de usar.
- Este script funciona com qualquer arquivo `.excalidrawlib` válido que você fornecer.

### Solução de problemas

**Erro: Arquivo não encontrado**

- Verifique se o caminho do arquivo está correto
- Certifique-se de que o arquivo tenha uma extensão `.excalidrawlib`

**Erro: formato de arquivo de biblioteca inválido**

- Certifique-se de que o arquivo seja um arquivo de biblioteca Excalidraw válido
- Verifique se contém um array `libraryItems`

### Considerações sobre licença

Ao usar bibliotecas de ícones de terceiros:

- **Ícones da arquitetura AWS**: Sujeito à licença de conteúdo da AWS
- **Ícones do GCP**: sujeito aos termos do Google
- **Outras bibliotecas**: Verifique a licença de cada biblioteca

Este script é para uso pessoal/organizacional. A redistribuição de arquivos de ícones divididos deve estar de acordo com os termos de licença da biblioteca original.

## add-icon-to-diagram.py

Adiciona um ícone específico de uma biblioteca Excalidraw dividida em um diagrama `.excalidraw` existente. O script lida com a tradução de coordenadas e evita colisões de ID e pode, opcionalmente, adicionar um rótulo sob o ícone.

### Pré-requisitos

- Python 3.6 ou superior
- Um arquivo de diagrama (`.excalidraw`)
- Um diretório de biblioteca de ícones divididos (criado por `split-excalidraw-library.py`)

### Uso```bash
python add-icon-to-diagram.py <diagram-path> <icon-name> <x> <y> [OPTIONS]
````

**Opções**

- `--library-path PATH`: Caminho para o diretório da biblioteca de ícones (padrão: `aws-architecture-icons`)
- `--label TEXT`: Adicione um rótulo de texto abaixo do ícone
  -- `--use-edit-suffix` : Edite via `.excalidraw.edit` para evitar problemas de substituição do editor (habilitado por padrão; passe `--no-use-edit-suffix` para desabilitar)

### Exemplos```bash

# Add EC2 icon at position (400, 300)

python add-icon-to-diagram.py diagram.excalidraw EC2 400 300

# Add VPC icon with label

python add-icon-to-diagram.py diagram.excalidraw VPC 200 150 --label "VPC"

# Safe edit mode is enabled by default (avoids editor overwrite issues)

# Use `--no-use-edit-suffix` to disable

python add-icon-to-diagram.py diagram.excalidraw EC2 500 300

# Add icon from another library

python add-icon-to-diagram.py diagram.excalidraw Compute-Engine 500 200 \
 --library-path libraries/gcp-icons --label "API Server"

````
### O que o script faz

1. **Carrega** o ícone JSON do diretório `icons/` da biblioteca
2. **Calcula** a caixa delimitadora do ícone
3. **Desloca** todas as coordenadas para a posição alvo
4. **Gera** IDs exclusivos para todos os elementos e grupos
5. **Acrescenta** os elementos transformados ao diagrama
6. **(Opcional)** Adiciona um rótulo abaixo do ícone

---

## add-arrow.py

Adiciona uma seta reta entre dois pontos em um diagrama `.excalidraw` existente. Suporta rótulos e estilos de linha opcionais.

### Pré-requisitos

- Python 3.6 ou superior
- Um arquivo de diagrama (`.excalidraw`)

### Uso```bash
python add-arrow.py <diagram-path> <from-x> <from-y> <to-x> <to-y> [OPTIONS]
````

**Opções**

- `--style {solid | tracejado | pontilhado}`: estilo de linha (padrão: `solid`)
- `--color HEX`: Cor da seta (padrão: `#1e1e1e`)
- `--label TEXT`: Adicione um rótulo de texto na seta
  -- `--use-edit-suffix` : Edite via `.excalidraw.edit` para evitar problemas de substituição do editor (habilitado por padrão; passe `--no-use-edit-suffix` para desabilitar)

### Exemplos```bash

# Simple arrow

python add-arrow.py diagram.excalidraw 300 200 500 300

# Arrow with label

python add-arrow.py diagram.excalidraw 300 200 500 300 --label "HTTPS"

# Dashed arrow with custom color

python add-arrow.py diagram.excalidraw 400 350 600 400 --style dashed --color "#7950f2"

# Safe edit mode is enabled by default (avoids editor overwrite issues)

# Use `--no-use-edit-suffix` to disable

python add-arrow.py diagram.excalidraw 300 200 500 300

```
### O que o script faz

1. **Cria** um elemento de seta a partir das coordenadas fornecidas
2. **(Opcional)** Adiciona um rótulo próximo ao ponto médio da seta
3. **Acrescenta** elementos ao diagrama
4. **Salva** o arquivo atualizado
```
