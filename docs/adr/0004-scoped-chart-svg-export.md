# 0004. Export recovery-chart SVG from the current display list

**Status:** Accepted (local implementation; deployment pending)
**Date:** 2026-10-09

## Context

The word-cloud and graph tools advertise PNG and SVG export. Browser regression
tests showed both buttons returning PNG bytes, with the second download merely
named `.svg`. ECharts' Canvas renderer uses `canvas.toDataURL`; passing type SVG
does not switch renderers. The current graph layout, pan/zoom and randomized
word placement must survive export.

## Decision

Use a small `chart-export.ts` adapter only in these two tools. Keep live previews
and PNG export on Canvas. For SVG, use a detached ZRender SVG painter to serialize
the live display list, background and dimensions, without layout or CSS animation.
Dispose the detached painter, never the live chart or its storage.

Declare ZRender 6.1.0 as a direct exact dependency, matching the version already
locked by ECharts. No library version is upgraded. Bridge ECharts' bundled nominal
Storage type to ZRender's equivalent type only inside this adapter.

## Alternatives and consequences

- A PNG embedded in SVG would change the file format but lose the vector benefit.
- Recreating a chart in SVG can rerandomize word placement or reset a force layout.
- Switching the shared preview renderer affects unrelated tools and requires a
  separate raster-export path. It is not part of this repair.

The chosen deep import relies on a lower-level ZRender API. ECharts/ZRender
upgrades must rerun the real-browser export gate. It verifies MIME, valid SVG XML,
multiple text elements and no embedded bitmap for the two chart fixtures. This is
not a promise that every ECharts effect can be exported this way. Fonts remain
dependent on the viewer; not all devices render text identically.

Official renderer context: [ECharts Canvas vs SVG](https://echarts.apache.org/handbook/en/best-practices/canvas-vs-svg/).

## Scope

No change to `EChartsWrapper`, runtime selection, shared renderer defaults,
indexability, other chart tools, or dependency versions.
