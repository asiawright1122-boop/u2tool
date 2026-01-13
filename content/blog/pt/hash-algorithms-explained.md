# Algoritmos Hash Explicados: MD5, SHA-1, SHA-256 e Além

Algoritmos hash são fundamentais para a computação moderna, usados em tudo, desde armazenamento de senhas até tecnologia blockchain. Este guia explica como funções hash funcionam e quando usar cada tipo.

## O que é uma Função Hash?

Uma função hash recebe dados de entrada de qualquer tamanho e produz uma saída de tamanho fixo chamada hash, digest ou checksum. Propriedades principais:

- **Determinística**: Mesma entrada sempre produz mesma saída
- **Rápida**: Cálculo rápido para qualquer tamanho de entrada
- **Unidirecional**: Não é possível reverter o hash para obter entrada original
- **Resistente a colisões**: Difícil encontrar duas entradas com mesmo hash
- **Efeito avalanche**: Pequena mudança na entrada causa grande mudança na saída

## Algoritmos Hash Comuns

### MD5 (Message Digest 5)

- **Tamanho de saída**: 128 bits (32 caracteres hexadecimais)
- **Criado**: 1991 por Ronald Rivest
- **Status**: Criptograficamente quebrado

**Casos de uso atuais:**
- Verificações de integridade de arquivos (não segurança)
- Checksums para downloads
- Chaves de cache

### SHA-256 (Família SHA-2)

- **Tamanho de saída**: 256 bits (64 caracteres hexadecimais)
- **Criado**: 2001 pela NSA
- **Status**: Atualmente seguro

**Casos de uso:**
- Assinaturas digitais
- Certificados SSL/TLS
- Bitcoin e criptomoedas

## Hash de Senhas

Funções hash regulares NÃO são adequadas para senhas. Use funções especializadas como bcrypt, Argon2 ou scrypt.

## Conclusão

Entender algoritmos hash é essencial para desenvolvedores que trabalham com segurança, integridade de dados ou criptografia. Escolha o algoritmo certo para seu caso de uso.
