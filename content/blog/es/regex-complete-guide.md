# Guía Completa de Expresiones Regulares: De Principiante a Experto

Las expresiones regulares (regex) son herramientas poderosas de coincidencia de patrones utilizadas en programación, procesamiento de texto y validación de datos. Esta guía completa cubre desde la sintaxis básica hasta técnicas avanzadas, con ejemplos prácticos y herramientas recomendadas.

## ¿Qué son las Expresiones Regulares?

Una expresión regular es una secuencia de caracteres que define un patrón de búsqueda. Se utiliza para:

- **Búsqueda de texto**: Encontrar patrones específicos en cadenas
- **Validación**: Verificar si la entrada coincide con el formato esperado (emails, teléfonos, etc.)
- **Reemplazo de texto**: Buscar y reemplazar patrones
- **Extracción de datos**: Extraer información específica del texto

## Sintaxis Básica de Regex

### Caracteres Literales

La regex más simple coincide con caracteres exactos:

```
Patrón: hello
Coincide: "hello" en "hello world"
```

### Metacaracteres

Caracteres especiales con significados específicos:

| Carácter | Significado | Ejemplo |
|----------|-------------|---------|
| `.` | Cualquier carácter | `h.t` coincide con "hat", "hot", "hit" |
| `^` | Inicio de cadena | `^Hello` coincide con "Hello world" |
| `$` | Fin de cadena | `world$` coincide con "Hello world" |
| `*` | Cero o más | `ab*c` coincide con "ac", "abc", "abbc" |
| `+` | Uno o más | `ab+c` coincide con "abc", "abbc" |
| `?` | Cero o uno | `colou?r` coincide con "color", "colour" |

### Clases de Caracteres

Coinciden con conjuntos específicos de caracteres:

```
[abc]     - Coincide con a, b o c
[a-z]     - Coincide con cualquier minúscula
[A-Z]     - Coincide con cualquier mayúscula
[0-9]     - Coincide con cualquier dígito
[a-zA-Z]  - Coincide con cualquier letra
[^abc]    - Coincide con todo excepto a, b, c
```


### Clases de Caracteres Abreviadas

| Abreviatura | Equivalente | Significado |
|-------------|-------------|-------------|
| `\d` | `[0-9]` | Cualquier dígito |
| `\D` | `[^0-9]` | Cualquier no-dígito |
| `\w` | `[a-zA-Z0-9_]` | Carácter de palabra |
| `\W` | `[^a-zA-Z0-9_]` | No carácter de palabra |
| `\s` | `[ \t\n\r\f]` | Espacio en blanco |
| `\S` | `[^ \t\n\r\f]` | No espacio en blanco |

## Cuantificadores

Controlan cuántas veces coincide un patrón:

```
{n}     - Exactamente n veces
{n,}    - n o más veces
{n,m}   - Entre n y m veces
*       - Cero o más (igual que {0,})
+       - Uno o más (igual que {1,})
?       - Cero o uno (igual que {0,1})
```

## Patrones Comunes de Regex

### Validación de Email

```
^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$
```

### Número de Teléfono

```
^\+?[0-9]{1,3}[-.\s]?[0-9]{3,4}[-.\s]?[0-9]{4}$
```

### Validación de URL

```
^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$
```

### Fortaleza de Contraseña

Contraseña fuerte (8+ caracteres, mayúscula, minúscula, número, especial):

```
^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$
```

## Lookahead y Lookbehind

### Lookahead Positivo `(?=...)`

Coincide solo si es seguido por el patrón:

```
\d+(?=px)   - Coincide con dígitos seguidos de "px": "100" en "100px"
```

### Lookahead Negativo `(?!...)`

Coincide solo si NO es seguido por el patrón:

```
\d+(?!px)   - Coincide con dígitos NO seguidos de "px"
```

## Flags de Regex

Modifican el comportamiento de regex:

| Flag | Nombre | Descripción |
|------|--------|-------------|
| `g` | Global | Encuentra todas las coincidencias |
| `i` | Insensible a mayúsculas | Ignora mayúsculas/minúsculas |
| `m` | Multilínea | ^ y $ coinciden con límites de línea |

## Herramientas Recomendadas

### U2Tool Probador de Regex

[U2Tool Probador de Regex](https://www.u2tool.com/es/tools/regex-tester) ofrece:

- ✅ Coincidencia de patrones en tiempo real
- ✅ Resaltado de coincidencias
- ✅ Explicación de regex
- ✅ Biblioteca de patrones comunes
- ✅ Soporte de múltiples flags
- ✅ Se ejecuta en el navegador, datos privados

### Cómo Usar

1. Visita [Probador de Regex](https://www.u2tool.com/es/tools/regex-tester)
2. Ingresa tu patrón regex
3. Ingresa cadena de prueba
4. Ve las coincidencias resaltadas en tiempo real
5. Ajusta el patrón según sea necesario

## FAQ

### ¿Cuál es la diferencia entre `*` y `+`?

`*` coincide con cero o más ocurrencias, mientras que `+` coincide con una o más. Por ejemplo, `ab*c` coincide con "ac" (cero b's), pero `ab+c` requiere al menos una "b", así que no coincidirá con "ac".

### ¿Cómo coincido con un carácter especial literal?

Escápalo con una barra invertida. Para coincidir con un punto literal, usa `\.`. Para coincidir con una barra invertida literal, usa `\\`.

### ¿Por qué mi regex no coincide?

Problemas comunes:
- Olvidar escapar caracteres especiales
- Faltan anclas (^ y $)
- Flags incorrectos (sensibilidad a mayúsculas)
- Cuantificadores codiciosos vs perezosos

## Conclusión

Las expresiones regulares son herramientas esenciales para desarrolladores. Comienza con patrones básicos y aprende gradualmente características avanzadas. Practica con [U2Tool Probador de Regex](https://www.u2tool.com/es/tools/regex-tester) para mejorar tus habilidades de regex.

Recuerda: Una regex bien elaborada puede ahorrar horas de procesamiento manual de texto, pero una demasiado compleja puede ser una pesadilla de mantenimiento. Mantén los patrones lo más simples posible mientras cumples tus requisitos.
