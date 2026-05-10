# 28-02 Summary: Ranked v0.0.9 Repair Scope

## Outcome

Ranked the next repair waves and selected bounded downstream scopes for Phase 29 and Phase 30.

## Selected Scope

### Phase 29 Text Utility Reference Data

- `ASCII_FONTS`
- `flipMap`
- `mirrorMap`
- `MORSE_CODE`
- `NATO_ALPHABET`
- `REVERSE_MORSE`
- `smallCapsMap`
- `subscriptMap`
- `superscriptMap`

### Phase 30 Validation Reference Data

- `commonPasswords`
- `commonTypos`
- `disposableDomains`
- `freeProviders`

## Evidence

- [`docs/RUNTIME_HELPER_DEBT_INVENTORY.md`](/Users/kaka/Dev/u2tool/docs/RUNTIME_HELPER_DEBT_INVENTORY.md) ranks the selected exports as likely broken imported compatibility data.
- The inventory also surfaced nonselected future candidates such as `fontMappings`, `fontStyles`, `defaultColors`, `emojiData`, `K`, and `bicDatabase`.

## Notes

- The selected Phase 29 scope intentionally stays on text utility transformations and leaves broader UI/reference-data candidates for later ranked waves.
- Phase 30 is limited to email/password validation data because those examples are deterministic and directly user-visible.
