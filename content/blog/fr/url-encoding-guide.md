# Guide d'Encodage URL : Tout ce que Vous Devez Savoir

L'encodage URL (aussi appelé encodage pourcent) est essentiel pour le développement web. Ce guide explique pourquoi les URLs ont besoin d'encodage, comment ça fonctionne et les erreurs courantes à éviter.

## Pourquoi l'Encodage URL Existe

Les URLs ne peuvent contenir qu'un ensemble limité de caractères du jeu ASCII. Quand vous devez inclure des caractères spéciaux, espaces ou caractères non-ASCII dans une URL, ils doivent être encodés.

### Caractères Réservés

Ces caractères ont une signification spéciale dans les URLs :

| Caractère | But | Encodé |
|-----------|-----|--------|
| : | Séparateur de protocole | %3A |
| / | Séparateur de chemin | %2F |
| ? | Début de query string | %3F |
| # | Identifiant de fragment | %23 |
| & | Séparateur de paramètres | %26 |

## Comment Fonctionne l'Encodage URL

L'encodage URL convertit les caractères en leurs valeurs ASCII hexadécimales précédées d'un signe pourcent :

```
Caractère → Code ASCII → Valeur Hex → %ValeurHex

Espace → 32 → 20 → %20
! → 33 → 21 → %21
@ → 64 → 40 → %40
```

## Fonctions d'Encodage JavaScript

| Fonction | Cas d'Utilisation |
|----------|-------------------|
| `encodeURI` | Encoder une URL complète |
| `encodeURIComponent` | Encoder des paramètres URL |
| `URLSearchParams` | Construire des query strings |

## Meilleures Pratiques

1. **Toujours encoder l'entrée utilisateur** avant de l'inclure dans les URLs
2. **Utilisez `encodeURIComponent`** pour les paramètres de requête
3. **Préférez `URLSearchParams`** pour construire des query strings

## Conclusion

L'encodage URL est un concept web fondamental que tout développeur doit comprendre.
