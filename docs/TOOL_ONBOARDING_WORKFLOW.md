# Tool Onboarding Workflow

This workflow keeps new tools from becoming a manual 10-locale copy job.

## 1. Create a Tool Spec

Create a JSON file with one tool entry and all 10 locale copies. Shortened example:

```json
{
  "slug": "example-calculator",
  "category": "finance",
  "icon": "calculator",
  "component": "PopularUtilityTool",
  "popular": true,
  "locales": {
    "en": {
      "name": "Example Calculator",
      "description": "Calculate an example result.",
      "seo_title": "Free Example Calculator Online",
      "seo_description": "Calculate an example result online for free."
    },
    "zh": {
      "name": "示例计算器",
      "description": "计算示例结果。",
      "seo_title": "免费在线示例计算器",
      "seo_description": "免费在线计算示例结果。"
    }
  }
}
```

The spec must include `en`, `zh`, `ja`, `ko`, `es`, `pt`, `fr`, `de`, `ru`, and `ar`.

## 2. Normalize SEO Copy

SEO-localized copy is generated or reviewed by the AI/content pass first, then normalized by script.

If your draft has all 10 locale `name` and `description` fields, generate the final spec:

```bash
npm run tools:localize-spec -- --input path/to/draft-tool.json --output path/to/localized-tool.json
```

The script fills missing `seo_title` and `seo_description` with locale-specific patterns, checks for English fallback in non-English locales, and warns on unusual SEO lengths.

If locale copy is missing, the script writes an `.ai-brief.md` file describing exactly what the AI/content pass must generate. Fill the missing locale entries, then rerun `tools:localize-spec`.

## 3. Generate Files

```bash
npm run tools:onboard -- --spec path/to/localized-tool.json
```

The script updates:

- `src/config/tools/<category>.ts`
- `src/messages/<locale>/base.json`
- `src/messages/<locale>/tools/<slug>.json`
- `src/components/tools/ToolImportMap.ts`

Use `--dry-run` to preview changes without writing files.

## 4. Add Runtime Logic

If the tool uses `PopularUtilityTool`, add the slug behavior in `src/components/tools/PopularUtilityTool.svelte`.

If the tool uses a dedicated component, create `src/components/tools/<Component>.svelte`.

## 5. Verify Localized Rendering

Start preview after a build:

```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 4321
```

Then validate the new tool in every locale:

```bash
npm run qa:tool-locales -- example-calculator
```

For multiple tools:

```bash
npm run qa:tool-locales -- example-calculator another-tool
```

This catches missing import-map entries, stuck `client:visible` hydration, English fallback in shared utility UI, missing title/H1 copy, and missing key result labels.

For day-to-day changes, run the changed-tool gate instead:

```bash
npm run qa:changed-tool-locales
```

It detects changed tool slugs from config, split locale files, tool components, and the import map, then forwards only those tools into the same localized rendering check. Use `--print-only` to see the detected slug set without launching Chrome.
