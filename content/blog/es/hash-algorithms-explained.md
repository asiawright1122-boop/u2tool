# Algoritmos Hash Explicados: MD5, SHA-1, SHA-256 y Más

Los algoritmos hash son fundamentales para la computación moderna, usados en todo desde almacenamiento de contraseñas hasta tecnología blockchain. Esta guía explica cómo funcionan las funciones hash y cuándo usar cada tipo.

## ¿Qué es una Función Hash?

Una función hash toma datos de entrada de cualquier tamaño y produce una salida de tamaño fijo llamada hash, digest o checksum. Propiedades clave:

- **Determinista**: La misma entrada siempre produce la misma salida
- **Rápida**: Cálculo rápido para cualquier tamaño de entrada
- **Unidireccional**: No se puede revertir el hash para obtener la entrada original
- **Resistente a colisiones**: Difícil encontrar dos entradas con el mismo hash
- **Efecto avalancha**: Pequeño cambio en entrada causa gran cambio en salida

## Algoritmos Hash Comunes

### MD5 (Message Digest 5)

- **Tamaño de salida**: 128 bits (32 caracteres hexadecimales)
- **Creado**: 1991 por Ronald Rivest
- **Estado**: Criptográficamente roto

**Casos de uso actuales:**
- Verificaciones de integridad de archivos (no seguridad)
- Checksums para descargas
- Claves de caché

**NO usar para:**
- Hashing de contraseñas
- Firmas digitales
- Cualquier propósito de seguridad


### SHA-256 (Familia SHA-2)

- **Tamaño de salida**: 256 bits (64 caracteres hexadecimales)
- **Creado**: 2001 por NSA
- **Estado**: Actualmente seguro

**Casos de uso:**
- Firmas digitales
- Certificados SSL/TLS
- Bitcoin y criptomonedas
- Verificación de integridad de archivos

## Tabla de Comparación

| Algoritmo | Tamaño Salida | Velocidad | Seguridad | Caso de Uso |
|-----------|---------------|-----------|-----------|-------------|
| MD5 | 128 bits | Rápido | Roto | Solo checksums |
| SHA-1 | 160 bits | Rápido | Débil | Sistemas legacy |
| SHA-256 | 256 bits | Medio | Fuerte | Seguridad general |
| SHA-512 | 512 bits | Medio | Fuerte | Alta seguridad |

## Hashing de Contraseñas

Las funciones hash regulares NO son adecuadas para contraseñas. Usa funciones especializadas:

### bcrypt

- Incluye salt automáticamente
- Factor de trabajo configurable
- Deliberadamente lento

### Argon2

Ganador del Password Hashing Competition (2015):

- **Argon2d**: Máxima resistencia a ataques GPU
- **Argon2i**: Resistencia a ataques de canal lateral
- **Argon2id**: Híbrido (recomendado)

## Recomendaciones de Seguridad

1. **Nunca uses MD5 o SHA-1 para seguridad**
2. **Usa SHA-256 o SHA-3 para hashing general**
3. **Usa bcrypt, Argon2 o scrypt para contraseñas**
4. **Siempre usa salt para hashing de contraseñas**

## Conclusión

Entender los algoritmos hash es esencial para desarrolladores que trabajan con seguridad, integridad de datos o criptografía. Elige el algoritmo correcto para tu caso de uso.
