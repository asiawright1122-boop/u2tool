# URL-Kodierung-Leitfaden: Alles, was Sie wissen müssen

URL-Kodierung (auch Prozent-Kodierung genannt) ist für die Webentwicklung unerlässlich. Dieser Leitfaden erklärt, warum URLs Kodierung benötigen, wie es funktioniert und häufige Fehler, die vermieden werden sollten.

## Warum URL-Kodierung existiert

URLs können nur einen begrenzten Satz von Zeichen aus dem ASCII-Zeichensatz enthalten. Wenn Sie Sonderzeichen, Leerzeichen oder Nicht-ASCII-Zeichen in eine URL aufnehmen müssen, müssen sie kodiert werden.

### Reservierte Zeichen

Diese Zeichen haben in URLs eine besondere Bedeutung:

| Zeichen | Zweck | Kodiert |
|---------|-------|---------|
| : | Protokoll-Trenner | %3A |
| / | Pfad-Trenner | %2F |
| ? | Query-String-Start | %3F |
| # | Fragment-Identifikator | %23 |
| & | Parameter-Trenner | %26 |

## Wie URL-Kodierung funktioniert

URL-Kodierung konvertiert Zeichen in ihre hexadezimalen ASCII-Werte, denen ein Prozentzeichen vorangestellt ist:

```
Zeichen → ASCII-Code → Hex-Wert → %HexWert

Leerzeichen → 32 → 20 → %20
! → 33 → 21 → %21
@ → 64 → 40 → %40
```

## JavaScript-Kodierungsfunktionen

| Funktion | Anwendungsfall |
|----------|----------------|
| `encodeURI` | Vollständige URL kodieren |
| `encodeURIComponent` | URL-Parameter kodieren |
| `URLSearchParams` | Query-Strings erstellen |

## Best Practices

1. **Immer Benutzereingaben kodieren** bevor sie in URLs aufgenommen werden
2. **Verwenden Sie `encodeURIComponent`** für Abfrageparameter
3. **Bevorzugen Sie `URLSearchParams`** zum Erstellen von Query-Strings

## Fazit

URL-Kodierung ist ein grundlegendes Web-Konzept, das jeder Entwickler verstehen sollte.
