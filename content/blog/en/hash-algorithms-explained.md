# Hash Algorithms Explained: MD5, SHA-1, SHA-256 and Beyond

Hash algorithms are fundamental to modern computing, used in everything from password storage to blockchain technology. This guide explains how hash functions work and when to use each type.

## What is a Hash Function?

A hash function takes input data of any size and produces a fixed-size output called a hash, digest, or checksum. Key properties include:

- **Deterministic**: Same input always produces same output
- **Fast**: Quick to compute for any input size
- **One-way**: Cannot reverse the hash to get original input
- **Collision-resistant**: Hard to find two inputs with same hash
- **Avalanche effect**: Small input change causes large output change

## Common Hash Algorithms

### MD5 (Message Digest 5)

- **Output size**: 128 bits (32 hex characters)
- **Created**: 1991 by Ronald Rivest
- **Status**: Cryptographically broken

```
Input: "Hello World"
MD5:   b10a8db164e0754105b7a99be72e3fe5
```

**Use cases today:**
- File integrity checks (non-security)
- Checksums for downloads
- Cache keys

**Do NOT use for:**
- Password hashing
- Digital signatures
- Any security purpose

### SHA-1 (Secure Hash Algorithm 1)

- **Output size**: 160 bits (40 hex characters)
- **Created**: 1995 by NSA
- **Status**: Deprecated for security use

```
Input: "Hello World"
SHA-1: 0a4d55a8d778e5022fab701977c5d840bbc486d0
```

**Status**: Collision attacks demonstrated in 2017. Major browsers and Git are phasing it out.

### SHA-256 (SHA-2 Family)

- **Output size**: 256 bits (64 hex characters)
- **Created**: 2001 by NSA
- **Status**: Currently secure

```
Input: "Hello World"
SHA-256: a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e
```

**Use cases:**
- Digital signatures
- SSL/TLS certificates
- Bitcoin and cryptocurrencies
- File integrity verification

### SHA-3 (Keccak)

- **Output sizes**: 224, 256, 384, 512 bits
- **Created**: 2015 (standardized)
- **Status**: Current standard

Different internal structure from SHA-2, providing algorithm diversity.

### BLAKE2 and BLAKE3

Modern hash functions designed for speed:

- **BLAKE2**: Faster than MD5 while being secure
- **BLAKE3**: Even faster, parallelizable

## Comparison Table

| Algorithm | Output Size | Speed | Security | Use Case |
|-----------|-------------|-------|----------|----------|
| MD5 | 128 bits | Fast | Broken | Checksums only |
| SHA-1 | 160 bits | Fast | Weak | Legacy systems |
| SHA-256 | 256 bits | Medium | Strong | General security |
| SHA-512 | 512 bits | Medium | Strong | High security |
| SHA-3 | Variable | Medium | Strong | Future-proofing |
| BLAKE3 | 256 bits | Very Fast | Strong | Performance-critical |

## Password Hashing

Regular hash functions are NOT suitable for passwords. Use specialized password hashing functions:

### bcrypt

```javascript
// Node.js example
const bcrypt = require('bcrypt');
const hash = await bcrypt.hash('password', 10);
```

- Includes salt automatically
- Configurable work factor
- Deliberately slow

### Argon2

Winner of the Password Hashing Competition (2015):

- **Argon2d**: Maximum resistance to GPU attacks
- **Argon2i**: Resistance to side-channel attacks
- **Argon2id**: Hybrid (recommended)

### scrypt

Memory-hard function making hardware attacks expensive.

## Practical Applications

### 1. File Integrity

```bash
# Generate checksum
sha256sum file.zip > file.zip.sha256

# Verify checksum
sha256sum -c file.zip.sha256
```

### 2. Data Deduplication

```python
import hashlib

def get_file_hash(filepath):
    sha256 = hashlib.sha256()
    with open(filepath, 'rb') as f:
        for chunk in iter(lambda: f.read(4096), b''):
            sha256.update(chunk)
    return sha256.hexdigest()
```

### 3. Digital Signatures

Hash the document, then sign the hash:

```
Document → SHA-256 → Hash → RSA Sign → Signature
```

### 4. Blockchain

Each block contains hash of previous block:

```
Block N: hash(Block N-1 data + nonce) = 000abc...
```

## Security Recommendations

1. **Never use MD5 or SHA-1 for security**
2. **Use SHA-256 or SHA-3 for general hashing**
3. **Use bcrypt, Argon2, or scrypt for passwords**
4. **Always use salt for password hashing**
5. **Consider BLAKE3 for performance-critical applications**

## Conclusion

Understanding hash algorithms is essential for developers working with security, data integrity, or cryptography. Choose the right algorithm for your use case: SHA-256 for general security, specialized functions for passwords, and modern algorithms like BLAKE3 when performance matters.
