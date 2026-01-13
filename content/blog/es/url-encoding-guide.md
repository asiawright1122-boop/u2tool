# Guía de Codificación URL: Todo lo que Necesitas Saber

La codificación URL (también llamada codificación porcentual) es esencial para el desarrollo web. Esta guía explica por qué las URLs necesitan codificación, cómo funciona y errores comunes a evitar.

## Por qué Existe la Codificación URL

Las URLs solo pueden contener un conjunto limitado de caracteres del conjunto ASCII. Cuando necesitas incluir caracteres especiales, espacios o caracteres no ASCII en una URL, deben ser codificados.

### Caracteres Reservados

Estos caracteres tienen significado especial en URLs:

| Carácter | Propósito | Codificado |
|----------|-----------|------------|
| : | Separador de protocolo | %3A |
| / | Separador de ruta | %2F |
| ? | Inicio de query string | %3F |
| # | Identificador de fragmento | %23 |
| & | Separador de parámetros | %26 |
| = | Separador clave-valor | %3D |

## Cómo Funciona la Codificación URL

La codificación URL convierte caracteres a sus valores ASCII hexadecimales precedidos por un signo de porcentaje:

```
Carácter → Código ASCII → Valor Hex → %ValorHex

Espacio → 32 → 20 → %20
! → 33 → 21 → %21
@ → 64 → 40 → %40
```

### Codificación de Caracteres No ASCII

Los caracteres no ASCII (como chino, árabe, emoji) primero se convierten a bytes UTF-8, luego cada byte se codifica con porcentaje.


## Funciones de Codificación en JavaScript

### encodeURI vs encodeURIComponent

```javascript
const url = 'https://example.com/path?name=John Doe&city=Madrid';

// encodeURI - codifica URL completa, preserva estructura
encodeURI(url);

// encodeURIComponent - codifica todo, para partes de URL
encodeURIComponent(url);
```

### Cuándo Usar Cada Una

| Función | Caso de Uso |
|---------|-------------|
| `encodeURI` | Codificar URL completa |
| `encodeURIComponent` | Codificar parámetros URL |
| `URLSearchParams` | Construir query strings |

## Errores Comunes

### 1. Doble Codificación

```javascript
// Incorrecto - codificando dos veces
const param = encodeURIComponent('hello world');
const url = encodeURI(`https://example.com?q=${param}`);

// Correcto
const url = `https://example.com?q=${encodeURIComponent('hello world')}`;
```

### 2. No Codificar Entrada de Usuario

```javascript
// Peligroso - vulnerabilidad XSS
const url = `https://example.com/search?q=${userInput}`;

// Seguro
const url = `https://example.com/search?q=${encodeURIComponent(userInput)}`;
```

## Mejores Prácticas

1. **Siempre codifica entrada de usuario** antes de incluir en URLs
2. **Usa `encodeURIComponent`** para parámetros de consulta
3. **Usa `encodeURI`** solo para URLs completas
4. **Prefiere `URLSearchParams`** para construir query strings
5. **Decodifica en el servidor** antes de procesar

## Conclusión

La codificación URL es un concepto web fundamental que todo desarrollador debe entender. La codificación adecuada previene bugs, vulnerabilidades de seguridad y asegura que tus aplicaciones funcionen correctamente con caracteres internacionales.
