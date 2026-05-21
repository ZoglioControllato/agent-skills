# Referência de funções do Shopify

As funções do Shopify substituem os scripts como forma de personalizar a lógica de back-end. Eles são executados em uma sandbox WebAssembly com garantias rigorosas de desempenho.

## Visão geral

| Artigo             | Valor                                     |
| ------------------ | ----------------------------------------- |
| Tempo de execução  | WebAssembly (Wasm)                        |
| Idiomas            | Rust (recomendado), JavaScript (via Javy) |
| Limite de execução | Limite de contagem de instruções de 11ms  |
| Limite de memória  | Memória linear de 64 KB                   |
| Entrada/Saída      | JSON (stdin/stdout)                       |
| Versão da API      | 2026-01                                   |

## Tipos de funções

| Tipo                     | Finalidade                                   | Substitui                          |
| ------------------------ | -------------------------------------------- | ---------------------------------- |
| `descontos_produtos`     | Descontos automáticos em produtos            | Scripts do Shopify (item de linha) |
| `order_descontos`        | Descontos em nível de pedido                 | Scripts do Shopify (pedido)        |
| `descontos_envio`        | Descontos nas taxas de envio                 | Scripts do Shopify (frete)         |
| `pagamento_customização` | Ocultar/reordenar métodos de pagamento       | Scripts do Shopify                 |
| `delivery_customization` | Ocultar/reordenar/renomear opções de entrega | ShopifyS                           |

criptas |
| `cart_transform` | Mesclar/expandir/atualizar linhas do carrinho | Novo |
| `fulfillment_constraints` | Restringir locais de atendimento | Novo |
| `order_routing_location_rule` | Roteamento de pedidos personalizados | Novo |
| `cart_checkout_validation` | Validar carrinho na finalização da compra | Novo |

## Primeiros passos

### Crie uma função```bash

# Generate a new function extension

shopify app generate extension --template discount_function_rust

# or

shopify app generate extension --template discount_function_javascript

# Structure created:

extensions/my-discount/
├── src/
│ ├── main.rs # Rust: function logic
│ └── run.graphql # Input query
├── Cargo.toml # Rust dependencies
├── shopify.extension.toml
└── schema.graphql # Generated API schema

````
### Consulta de entrada (run.graphql)

Defina quais dados sua função recebe:```graphql
query RunInput {
  cart {
    lines {
      quantity
      merchandise {
        ... on ProductVariant {
          id
          product {
            id
            hasAnyTag(tags: ["VIP"])
          }
        }
      }
      cost {
        amountPerQuantity {
          amount
          currencyCode
        }
      }
    }
  }
  discountNode {
    metafield(namespace: "discount", key: "config") {
      value
    }
  }
}
````

### Implementação de ferrugem```rust

use shopify_function::prelude::\*;
use shopify_function::Result;

#[shopify_function_target(rename = "function")]
fn function(input: input::ResponseData) -> Result<output::FunctionRunResult> {
let config: serde_json::Value = serde_json::from_str(
input.discount_node.metafield
.as_ref()
.map(|m| m.value.as_str())
.unwrap_or("{}"),
)?;

    let percentage = config.get("percentage")
        .and_then(|v| v.as_f64())
        .unwrap_or(0.0);

    let targets: Vec<output::Target> = input
        .cart
        .lines
        .iter()
        .filter_map(|line| {
            let variant = match &line.merchandise {
                input::InputCartLinesMerchandise::ProductVariant(v) => v,
                _ => return None,
            };

            if variant.product.has_any_tag {
                Some(output::Target::ProductVariant(
                    output::ProductVariantTarget {
                        id: variant.id.clone(),
                        quantity: None,
                    },
                ))
            } else {
                None
            }
        })
        .collect();

    if targets.is_empty() {
        return Ok(output::FunctionRunResult {
            discounts: vec![],
            discount_application_strategy:
                output::DiscountApplicationStrategy::FIRST,
        });
    }

    Ok(output::FunctionRunResult {
        discounts: vec![output::Discount {
            message: Some(format!("{}% VIP discount", percentage)),
            targets,
            value: output::Value::Percentage(output::Percentage {
                value: percentage.to_string(),
            }),
        }],
        discount_application_strategy:
            output::DiscountApplicationStrategy::FIRST,
    })

}

````
### Implementação de JavaScript```javascript
// src/run.js
export function run(input) {
  const config = JSON.parse(
    input?.discountNode?.metafield?.value ?? "{}"
  );

  const percentage = parseFloat(config.percentage) || 0;

  const targets = input.cart.lines
    .filter((line) => {
      return line.merchandise?.__typename === "ProductVariant"
        && line.merchandise.product.hasAnyTag;
    })
    .map((line) => ({
      productVariant: { id: line.merchandise.id },
    }));

  if (targets.length === 0) {
    return { discounts: [], discountApplicationStrategy: "FIRST" };
  }

  return {
    discounts: [
      {
        message: `${percentage}% VIP discount`,
        targets,
        value: {
          percentage: { value: percentage.toString() },
        },
      },
    ],
    discountApplicationStrategy: "FIRST",
  };
}
````

## Configuração

### shopify.extension.toml```toml

api_version = "2026-01"

[[extensions]]
name = "VIP Discount"
handle = "vip-discount"
type = "function"

[extensions.build]
command = "cargo wasi build --release"
path = "target/wasm32-wasi/release/vip-discount.wasm"

# For JavaScript:

# command = "npx javy compile src/run.js -o dist/function.wasm"

# path = "dist/function.wasm"

[extensions.targeting]
target = "purchase.product-discount.run"

[extensions.ui]
handle = "vip-discount-ui"

[extensions.input.variables]
namespace = "discount"
key = "config"

````
## Teste

### Testes unitários (Rust)```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_no_discount_without_tag() {
        let input = input::ResponseData {
            cart: input::InputCart {
                lines: vec![/* line without VIP tag */],
            },
            discount_node: input::InputDiscountNode {
                metafield: Some(input::InputDiscountNodeMetafield {
                    value: r#"{"percentage": 10}"#.to_string(),
                }),
            },
        };

        let result = function(input).unwrap();
        assert!(result.discounts.is_empty());
    }
}
````

### Testes locais```bash

# Test with sample input

shopify app function run --path extensions/my-discount

# Build and preview

shopify app dev

````
## Implantação```bash
# Deploy function with app
shopify app deploy

# Functions are versioned with the app
# Each deploy creates a new function version
````

## Migração de Scripts

| Roteiros                     | Funções                              |
| ---------------------------- | ------------------------------------ |
| DSL tipo Ruby                | Ferrugem ou JavaScript (Wasm)        |
| Apenas loja online           | Todos os canais (POS, B2B, headless) |
| Limitado a 3 tipos           | Mais de 10 tipos de funções          |
| Sem controle de versão       | Baseado em Git, pronto para CI/CD    |
| Aplicativo Editor de scripts | CLI do Shopify                       |
| Hospedado pelo Shopify       | Lógica hospedada pelo desenvolvedor  |

**Etapas de migração:**

1. Identifique os scripts em uso (Configurações > Aplicativos > Editor de scripts)
2. Mapeie cada Script para um tipo de Função (veja tabela acima)
3. Reescreva a lógica em Rust ou JavaScript
4. Teste com `execução da função do aplicativo shopify`
5. Implante e ative por meio do administrador do Shopify
6. Desative scripts antigos

## Diretrizes de desempenho

- As funções devem ser concluídas dentro do limite de contagem de instruções (equivalente a aproximadamente 11 ms)
- Minimize as alocações - reutilize buffers sempre que possível
- Evite operações complexas de strings em caminhos quentes
- Rust compila para Wasm menor e mais rápido que JavaScript
- Use `cargo wasi build --release` para compilações otimizadas
- Perfil com `função do aplicativo shopify run --export-timing`

## Melhores práticas

1. **Use Rust para produção** - binários menores, execução mais rápida
2. **Use JavaScript para prototipagem** – iteração mais rápida, sintaxe familiar
3. **Mantenha o mínimo de consultas de entrada** - solicite apenas os campos necessários
4. **Armazene a configuração em metacampos** - evite valores codificados
5. **Casos extremos de teste** - carrinhos vazios, metacampos ausentes, quantidades zero
6. **Versione suas funções** - use controle de versão semântico com implantações de aplicativos
7. **Monitorar a execução** -

verifique os logs de função no Painel do Parceiro
