# Algorithmes de Hachage Expliqués : MD5, SHA-1, SHA-256 et Au-delà

Les algorithmes de hachage sont fondamentaux pour l'informatique moderne, utilisés dans tout, du stockage de mots de passe à la technologie blockchain. Ce guide explique comment fonctionnent les fonctions de hachage et quand utiliser chaque type.

## Qu'est-ce qu'une Fonction de Hachage ?

Une fonction de hachage prend des données d'entrée de n'importe quelle taille et produit une sortie de taille fixe appelée hash, digest ou checksum. Propriétés clés :

- **Déterministe** : La même entrée produit toujours la même sortie
- **Rapide** : Calcul rapide pour toute taille d'entrée
- **Unidirectionnelle** : Impossible de retrouver l'entrée originale à partir du hash
- **Résistante aux collisions** : Difficile de trouver deux entrées avec le même hash
- **Effet avalanche** : Un petit changement d'entrée cause un grand changement de sortie

## Algorithmes de Hachage Courants

### MD5 (Message Digest 5)

- **Taille de sortie** : 128 bits (32 caractères hexadécimaux)
- **Créé** : 1991 par Ronald Rivest
- **Statut** : Cryptographiquement cassé

**Cas d'utilisation actuels :**
- Vérifications d'intégrité de fichiers (non sécurité)
- Checksums pour téléchargements
- Clés de cache

### SHA-256 (Famille SHA-2)

- **Taille de sortie** : 256 bits (64 caractères hexadécimaux)
- **Créé** : 2001 par la NSA
- **Statut** : Actuellement sécurisé

**Cas d'utilisation :**
- Signatures numériques
- Certificats SSL/TLS
- Bitcoin et cryptomonnaies

## Hachage de Mots de Passe

Les fonctions de hachage régulières ne sont PAS adaptées aux mots de passe. Utilisez des fonctions spécialisées comme bcrypt, Argon2 ou scrypt.

## Conclusion

Comprendre les algorithmes de hachage est essentiel pour les développeurs travaillant avec la sécurité, l'intégrité des données ou la cryptographie.
