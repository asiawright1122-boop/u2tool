# Hash-Algorithmen erklärt: MD5, SHA-1, SHA-256 und darüber hinaus

Hash-Algorithmen sind grundlegend für die moderne Informatik und werden in allem verwendet, von der Passwortspeicherung bis zur Blockchain-Technologie. Dieser Leitfaden erklärt, wie Hash-Funktionen funktionieren und wann jeder Typ verwendet werden sollte.

## Was ist eine Hash-Funktion?

Eine Hash-Funktion nimmt Eingabedaten beliebiger Größe und erzeugt eine Ausgabe fester Größe, die Hash, Digest oder Prüfsumme genannt wird. Wichtige Eigenschaften:

- **Deterministisch**: Gleiche Eingabe erzeugt immer gleiche Ausgabe
- **Schnell**: Schnelle Berechnung für jede Eingabegröße
- **Einweg**: Hash kann nicht umgekehrt werden, um Originaleingabe zu erhalten
- **Kollisionsresistent**: Schwer, zwei Eingaben mit gleichem Hash zu finden
- **Lawineneffekt**: Kleine Eingabeänderung verursacht große Ausgabeänderung

## Gängige Hash-Algorithmen

### MD5 (Message Digest 5)

- **Ausgabegröße**: 128 Bit (32 Hexadezimalzeichen)
- **Erstellt**: 1991 von Ronald Rivest
- **Status**: Kryptografisch gebrochen

**Aktuelle Anwendungsfälle:**
- Dateiintegritätsprüfungen (nicht Sicherheit)
- Prüfsummen für Downloads
- Cache-Schlüssel

### SHA-256 (SHA-2-Familie)

- **Ausgabegröße**: 256 Bit (64 Hexadezimalzeichen)
- **Erstellt**: 2001 von der NSA
- **Status**: Derzeit sicher

**Anwendungsfälle:**
- Digitale Signaturen
- SSL/TLS-Zertifikate
- Bitcoin und Kryptowährungen

## Passwort-Hashing

Reguläre Hash-Funktionen sind NICHT für Passwörter geeignet. Verwenden Sie spezialisierte Funktionen wie bcrypt, Argon2 oder scrypt.

## Fazit

Das Verständnis von Hash-Algorithmen ist für Entwickler, die mit Sicherheit, Datenintegrität oder Kryptografie arbeiten, unerlässlich.
