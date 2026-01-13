# Guia de Codificação URL: Tudo que Você Precisa Saber

A codificação URL (também chamada de codificação percentual) é essencial para desenvolvimento web. Este guia explica por que URLs precisam de codificação, como funciona e erros comuns a evitar.

## Por que a Codificação URL Existe

URLs só podem conter um conjunto limitado de caracteres do conjunto ASCII. Quando você precisa incluir caracteres especiais, espaços ou caracteres não-ASCII em uma URL, eles devem ser codificados.

### Caracteres Reservados

Estes caracteres têm significado especial em URLs:

| Caractere | Propósito | Codificado |
|-----------|-----------|------------|
| : | Separador de protocolo | %3A |
| / | Separador de caminho | %2F |
| ? | Início da query string | %3F |
| # | Identificador de fragmento | %23 |
| & | Separador de parâmetros | %26 |

## Como a Codificação URL Funciona

A codificação URL converte caracteres para seus valores ASCII hexadecimais precedidos por um sinal de porcentagem:

```
Caractere → Código ASCII → Valor Hex → %ValorHex

Espaço → 32 → 20 → %20
! → 33 → 21 → %21
@ → 64 → 40 → %40
```

## Funções de Codificação em JavaScript

### encodeURI vs encodeURIComponent

| Função | Caso de Uso |
|--------|-------------|
| `encodeURI` | Codificar URL completa |
| `encodeURIComponent` | Codificar parâmetros URL |
| `URLSearchParams` | Construir query strings |

## Melhores Práticas

1. **Sempre codifique entrada de usuário** antes de incluir em URLs
2. **Use `encodeURIComponent`** para parâmetros de consulta
3. **Prefira `URLSearchParams`** para construir query strings

## Conclusão

A codificação URL é um conceito web fundamental que todo desenvolvedor deve entender. A codificação adequada previne bugs e vulnerabilidades de segurança.
