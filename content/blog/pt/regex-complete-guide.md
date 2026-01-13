# Guia Completo de Expressões Regulares: De Iniciante a Especialista

As expressões regulares (regex) são ferramentas poderosas de correspondência de padrões usadas em programação, processamento de texto e validação de dados. Este guia completo cobre desde a sintaxe básica até técnicas avançadas.

## O Que São Expressões Regulares?

Uma expressão regular é uma sequência de caracteres que define um padrão de busca. É usada para:

- **Busca de texto**: Encontrar padrões específicos em strings
- **Validação**: Verificar se a entrada corresponde ao formato esperado
- **Substituição de texto**: Buscar e substituir padrões
- **Extração de dados**: Extrair informações específicas do texto

## Sintaxe Básica de Regex

### Caracteres Literais

A regex mais simples corresponde a caracteres exatos:

```
Padrão: hello
Corresponde: "hello" em "hello world"
```

### Metacaracteres

Caracteres especiais com significados específicos:

| Caractere | Significado | Exemplo |
|-----------|-------------|---------|
| `.` | Qualquer caractere | `h.t` corresponde a "hat", "hot", "hit" |
| `^` | Início da string | `^Hello` corresponde a "Hello world" |
| `$` | Fim da string | `world$` corresponde a "Hello world" |
| `*` | Zero ou mais | `ab*c` corresponde a "ac", "abc", "abbc" |
| `+` | Um ou mais | `ab+c` corresponde a "abc", "abbc" |
| `?` | Zero ou um | `colou?r` corresponde a "color", "colour" |

### Classes de Caracteres

Correspondem a conjuntos específicos de caracteres:

```
[abc]     - Corresponde a a, b ou c
[a-z]     - Corresponde a qualquer minúscula
[A-Z]     - Corresponde a qualquer maiúscula
[0-9]     - Corresponde a qualquer dígito
```

## Padrões Comuns de Regex

### Validação de Email

```
^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$
```

### Validação de URL

```
^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$
```

## Ferramentas Recomendadas

### U2Tool Testador de Regex

[U2Tool Testador de Regex](https://www.u2tool.com/pt/tools/regex-tester) oferece:

- ✅ Correspondência de padrões em tempo real
- ✅ Destaque de correspondências
- ✅ Explicação de regex
- ✅ Biblioteca de padrões comuns
- ✅ Suporte a múltiplas flags
- ✅ Executa no navegador, dados privados

## FAQ

### Qual é a diferença entre `*` e `+`?

`*` corresponde a zero ou mais ocorrências, enquanto `+` corresponde a uma ou mais. Por exemplo, `ab*c` corresponde a "ac" (zero b's), mas `ab+c` requer pelo menos um "b".

## Conclusão

As expressões regulares são ferramentas essenciais para desenvolvedores. Pratique com [U2Tool Testador de Regex](https://www.u2tool.com/pt/tools/regex-tester) para melhorar suas habilidades de regex.
