# Requirements: U2Tool

## v0.0.12 Growth Acceleration and High-Performance Tool Expansion

### Performance Tuning & Loading Optimization
- [ ] PERF-01: Implement `SmartLink` component with hover prefetch and Network Information API awareness (skip prefetch on 3G/save-data).
- [ ] PERF-02: Split tool-specific translations into dynamic dynamic-chunks or client-side lazy loads to reduce core-bundle initialization weight.
- [ ] PERF-03: Set up edge headers cache controls for API routes (1-hour TTL with 24-hour stale-while-revalidate).

### SEO Restoration & GSC Compliance
- [ ] SEO-11: Resolve GSC canonical drifts on dynamic query routes by enforcing strict canonical route rendering for search paths.
- [ ] SEO-12: Implement search console validation playbook recommendations for high-value recovered pages to align metadata and internal link graph.

### Office & Productivity Tool expansion (add-office-tools Spec)
- [ ] OFFICE-01: Implement Svelte 5 `invoice-generator` with multi-currency dynamic calculations and client-side PDF export.
- [ ] OFFICE-02: Implement Svelte 5 `resume-builder` with templates selection, real-time preview, and PDF export.
- [ ] OFFICE-03: Implement Svelte 5 `signature-pad` (Canvas drawing, customized thickness/pen colors, PNG/SVG exports).
- [ ] OFFICE-04: Implement Svelte 5 `pomodoro-timer` (configurable sessions, audio notification and session history).
- [ ] OFFICE-05: Ensure complete 10-locale translation keys mapping for all new office tools.
