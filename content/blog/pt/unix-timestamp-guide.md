# Guia de Timestamp Unix: Trabalhando com Tempo Epoch

Timestamps Unix são a forma universal de representar tempo na computação. Este guia cobre tudo, desde conceitos básicos até aplicações práticas e o problema do ano 2038.

## O que é um Timestamp Unix?

Um timestamp Unix (também chamado de tempo Epoch ou tempo POSIX) é o número de segundos que se passaram desde 1 de janeiro de 1970, 00:00:00 UTC. Este momento é chamado de "Unix Epoch".

```
Unix Epoch: 1 de janeiro de 1970, 00:00:00 UTC
Timestamp: 0

Exemplo de tempo atual:
13 de janeiro de 2025, 12:00:00 UTC
Timestamp: 1736769600
```

## Por que Usar Timestamps Unix?

1. **Universal**: Mesmo valor independentemente do fuso horário
2. **Simples**: Apenas um número, fácil de armazenar e comparar
3. **Compacto**: Ocupa menos armazenamento que strings de data
4. **Ordenável**: Comparação numérica funciona naturalmente
5. **Agnóstico de linguagem**: Funciona em qualquer linguagem de programação

## Conversão de Timestamps

### JavaScript

```javascript
// Timestamp atual (segundos)
const timestamp = Math.floor(Date.now() / 1000);

// Timestamp para Date
const date = new Date(timestamp * 1000);

// Date para timestamp
const ts = Math.floor(new Date('2025-01-13').getTime() / 1000);
```

## Constantes de Tempo

| Unidade | Segundos |
|---------|----------|
| Minuto | 60 |
| Hora | 3.600 |
| Dia | 86.400 |
| Semana | 604.800 |

## O Problema do Ano 2038

Sistemas de 32 bits armazenam timestamps como inteiros com sinal, com valor máximo de 2.147.483.647. Isso corresponde a 19 de janeiro de 2038, 03:14:07 UTC.

## Conclusão

Timestamps Unix são essenciais para qualquer desenvolvedor que trabalhe com datas e horas. Lembre-se de considerar fusos horários ao exibir para usuários e use inteiros de 64 bits para preparação futura.
