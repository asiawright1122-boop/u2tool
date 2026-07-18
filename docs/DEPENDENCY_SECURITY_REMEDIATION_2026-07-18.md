# Production Dependency Security Remediation

## Scope

The remediation branch upgrades the vulnerable production dependency ranges identified by `npm audit`:

- `devalue` `5.8.1`
- `dompurify` `3.4.12`
- `echarts` `6.1.0`
- `exifreader` `4.41.0`
- `js-yaml` `4.3.0`
- `svelte` `5.56.6`

`npm audit --omit=dev --json` reports zero production vulnerabilities after the upgrade.

## Known Peer Declaration

`echarts-liquidfill@3.1.0` and `echarts-wordcloud@2.1.0` still declare `echarts: ^5.0.1`. The latest published versions have the same peer range, so `npm ls echarts echarts-liquidfill echarts-wordcloud --all` reports the ECharts 6.1.0 tree as invalid. This was already present on the ECharts 6.0.0 remediation base and is not a new application code change.

The affected tools dynamically load these plugins through `src/lib/echarts/plugin-runtime.ts`. Their production browser path is covered by:

```bash
npm run validate:echarts-plugin-runtime -- --base-url http://127.0.0.1:4324 --locale en
```

The probe requires both liquid-fill and word-cloud pages to render a non-empty visual Canvas and to produce no page or console errors. The peer declaration remains an explicit integration risk until the plugins publish an ECharts 6 peer range or the project intentionally returns to ECharts 5 with a documented audit exception.
