# Guía de Conversión de Formatos de Color: HEX, RGB, HSL y Más

Entender los formatos de color es esencial para desarrolladores web y diseñadores. Esta guía completa explica diferentes modelos de color, cuándo usar cada uno y cómo convertir entre ellos.

## Resumen de Modelos de Color

### RGB (Rojo, Verde, Azul)

El modelo de color digital más común, basado en mezcla aditiva:

```
Formato: rgb(red, green, blue)
Rango: 0-255 para cada canal
Ejemplo: rgb(255, 99, 71) - Rojo tomate
```

### HEX (Hexadecimal)

Representación compacta de RGB:

```
Formato: #RRGGBB o #RGB (abreviado)
Rango: 00-FF (0-255 en hex)
Ejemplo: #FF6347 - Rojo tomate
```

### HSL (Tono, Saturación, Luminosidad)

Más intuitivo para humanos:

```
Formato: hsl(hue, saturation%, lightness%)
Tono: 0-360 (grados en rueda de color)
Saturación: 0-100% (gris a vívido)
Luminosidad: 0-100% (negro a blanco)
Ejemplo: hsl(9, 100%, 64%) - Rojo tomate
```

## Cuándo Usar Cada Formato

| Formato | Mejor Para | Pros | Contras |
|---------|------------|------|---------|
| HEX | CSS, diseño web | Compacto, amplio soporte | Difícil de leer/modificar |
| RGB | Manipulación programática | Operaciones matemáticas fáciles | No intuitivo |
| HSL | Crear esquemas de color | Ajustes intuitivos | Menos común |

## Fórmulas de Conversión

### RGB a HEX

```javascript
function rgbToHex(r, g, b) {
  return '#' + [r, g, b]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');
}

rgbToHex(255, 99, 71); // "#ff6347"
```

## Crear Esquemas de Color con HSL

HSL facilita crear esquemas de color armoniosos:

### Colores Complementarios

Opuestos en la rueda de color (180° de diferencia):

```css
:root {
  --primary: hsl(200, 70%, 50%);      /* Azul */
  --complement: hsl(20, 70%, 50%);    /* Naranja */
}
```

### Variaciones de Luminosidad

Crear tonos y matices:

```css
:root {
  --primary-100: hsl(200, 70%, 90%);  /* Más claro */
  --primary-500: hsl(200, 70%, 50%);  /* Base */
  --primary-900: hsl(200, 70%, 10%);  /* Más oscuro */
}
```

## Herramientas Recomendadas

### U2Tool Convertidor de Color

[U2Tool Convertidor de Color](https://www.u2tool.com/es/tools/color-converter) ofrece:

- ✅ Convertir entre HEX, RGB, HSL, HSV, CMYK
- ✅ Vista previa de color en tiempo real
- ✅ Copiar cualquier formato con un clic
- ✅ Herramienta selector de color
- ✅ Se ejecuta completamente en el navegador

## FAQ

### ¿Por qué los colores se ven diferentes en diferentes pantallas?

Las pantallas tienen diferentes perfiles de color, brillo y calibración. Para colores consistentes: usa perfiles de color (sRGB para web), calibra monitores, prueba en múltiples dispositivos.

### ¿Cuándo debo usar HEX vs RGB?

Usa HEX para valores CSS estáticos (código más limpio). Usa RGB/RGBA cuando necesites transparencia, manipulación programática de color o generación dinámica de color.

## Conclusión

Entender los formatos de color te ayuda a trabajar más eficientemente con colores en desarrollo web y diseño. Usa [U2Tool Convertidor de Color](https://www.u2tool.com/es/tools/color-converter) para conversiones rápidas y HSL para crear esquemas de color armoniosos.
