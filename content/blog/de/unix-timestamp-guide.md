# Unix-Zeitstempel-Leitfaden: Arbeiten mit Epoch-Zeit

Unix-Zeitstempel sind die universelle Methode zur Darstellung von Zeit in der Informatik. Dieser Leitfaden behandelt alles von grundlegenden Konzepten bis zu praktischen Anwendungen und dem Jahr-2038-Problem.

## Was ist ein Unix-Zeitstempel?

Ein Unix-Zeitstempel (auch Epoch-Zeit oder POSIX-Zeit genannt) ist die Anzahl der Sekunden, die seit dem 1. Januar 1970, 00:00:00 UTC vergangen sind. Dieser Moment wird "Unix Epoch" genannt.

```
Unix Epoch: 1. Januar 1970, 00:00:00 UTC
Zeitstempel: 0

Aktuelles Zeitbeispiel:
13. Januar 2025, 12:00:00 UTC
Zeitstempel: 1736769600
```

## Warum Unix-Zeitstempel verwenden?

1. **Universal**: Gleicher Wert unabhängig von der Zeitzone
2. **Einfach**: Nur eine Zahl, leicht zu speichern und vergleichen
3. **Kompakt**: Benötigt weniger Speicher als Datumsstrings
4. **Sortierbar**: Numerischer Vergleich funktioniert natürlich
5. **Sprachunabhängig**: Funktioniert in jeder Programmiersprache

## Zeitstempel-Konvertierung

### JavaScript

```javascript
// Aktueller Zeitstempel (Sekunden)
const timestamp = Math.floor(Date.now() / 1000);

// Zeitstempel zu Date
const date = new Date(timestamp * 1000);

// Date zu Zeitstempel
const ts = Math.floor(new Date('2025-01-13').getTime() / 1000);
```

## Zeitkonstanten

| Einheit | Sekunden |
|---------|----------|
| Minute | 60 |
| Stunde | 3.600 |
| Tag | 86.400 |
| Woche | 604.800 |

## Das Jahr-2038-Problem

32-Bit-Systeme speichern Zeitstempel als vorzeichenbehaftete Ganzzahlen mit einem Maximalwert von 2.147.483.647. Dies entspricht dem 19. Januar 2038, 03:14:07 UTC.

## Fazit

Unix-Zeitstempel sind für jeden Entwickler, der mit Datum und Zeit arbeitet, unerlässlich. Denken Sie daran, Zeitzonen bei der Anzeige für Benutzer zu berücksichtigen.
