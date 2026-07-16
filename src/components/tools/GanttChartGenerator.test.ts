import { execFileSync } from "node:child_process";
import {
  createReadStream,
  existsSync,
  mkdtempSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { createServer, type Server } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import puppeteer, {
  type Browser,
  type ElementHandle,
  type Page,
} from "puppeteer";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const repoRoot = fileURLToPath(new URL("../../..", import.meta.url));
const fixtureRoot = path.join(
  repoRoot,
  "src/components/tools/test-fixtures/gantt-chart-generator",
);
const astroBin = path.join(repoRoot, "node_modules/.bin/astro");

let tempRoot = "";
let outDir = "";
let server: Server | undefined;
let browser: Browser | undefined;
let baseUrl = "";

beforeAll(async () => {
  tempRoot = mkdtempSync(path.join(tmpdir(), "u2tool-gantt-chart-"));
  outDir = path.join(tempRoot, "dist");
  const cacheDir = path.join(tempRoot, "cache");
  symlinkSync(
    path.join(repoRoot, "node_modules"),
    path.join(tempRoot, "node_modules"),
    "dir",
  );

  execFileSync(astroBin, ["build"], {
    cwd: fixtureRoot,
    encoding: "utf8",
    env: {
      ...process.env,
      GANTT_FIXTURE_OUT_DIR: outDir,
      GANTT_FIXTURE_CACHE_DIR: cacheDir,
      GANTT_FIXTURE_REPO_ROOT: repoRoot,
    },
    timeout: 60_000,
  });

  server = createServer((request, response) => {
    const requestPath = decodeURIComponent(
      new URL(request.url ?? "/", "http://localhost").pathname,
    );
    const requestedFile = requestPath.endsWith("/")
      ? `${requestPath}index.html`
      : requestPath;
    const filePath = path.join(outDir, requestedFile);

    if (
      !filePath.startsWith(outDir) ||
      !existsSync(filePath) ||
      !statSync(filePath).isFile()
    ) {
      response.statusCode = 404;
      response.end("Not found");
      return;
    }

    response.setHeader("content-type", contentType(filePath));
    createReadStream(filePath).pipe(response);
  });
  await new Promise<void>((resolve) => server!.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Gantt fixture server did not bind to a TCP port");
  }
  baseUrl = `http://127.0.0.1:${address.port}`;

  browser = await puppeteer.launch({
    headless: true,
    executablePath: puppeteer.executablePath(),
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
}, 60_000);

afterAll(async () => {
  await browser?.close();
  await new Promise<void>((resolve, reject) => {
    if (!server) {
      resolve();
      return;
    }
    server.close((error) => (error ? reject(error) : resolve()));
  });
  if (tempRoot) {
    rmSync(tempRoot, { recursive: true, force: true });
  }
});

describe("GanttChartGenerator public UI", () => {
  it("downloads a real PNG and vector SVG chart payload [capability:gantt-chart-generator:profile:release-readiness] [capability:gantt-chart-generator:produced-output:png-chart] [capability:gantt-chart-generator:produced-output:svg-chart] [capability:gantt-chart-generator:browser-feature:png-export] [capability:gantt-chart-generator:browser-feature:svg-export]", async () => {
    await withPage(async (page) => {
      await page.waitForSelector(".chart-frame canvas");
      await page.waitForFunction(
        () => !document.querySelector(".chart-frame .absolute"),
      );
      await page.waitForFunction(() => {
        const canvas = document.querySelector<HTMLCanvasElement>(
          ".chart-frame canvas",
        );
        return Boolean(canvas && canvas.width > 0 && canvas.height > 0);
      });
      await page.evaluate(() => {
        const capture = {
          links: [] as Array<{ download: string; href: string }>,
          blobs: [] as Blob[],
        };
        (
          window as unknown as { __ganttDownloads: typeof capture }
        ).__ganttDownloads = capture;
        URL.createObjectURL = (blob: Blob) => {
          capture.blobs.push(blob);
          return `blob:gantt-chart-${capture.blobs.length}`;
        };
        URL.revokeObjectURL = () => {};
        HTMLAnchorElement.prototype.click = function click() {
          capture.links.push({ download: this.download, href: this.href });
        };
      });

      await clickButton(page, "Download PNG");
      await clickButton(page, "Download SVG");
      await page.waitForFunction(
        () =>
          (window as unknown as { __ganttDownloads?: { links: unknown[] } })
            .__ganttDownloads?.links.length === 2,
      );

      const downloads = await page.evaluate(async () => {
        const capture = (
          window as unknown as {
            __ganttDownloads: {
              links: Array<{ download: string; href: string }>;
              blobs: Blob[];
            };
          }
        ).__ganttDownloads;
        return {
          links: capture.links,
          blobs: await Promise.all(
            capture.blobs.map(async (blob) => ({
              type: blob.type,
              text: await blob.text(),
            })),
          ),
        };
      });

      expect(downloads.links[0]).toMatchObject({
        download: "gantt-chart.png",
      });
      expect(downloads.links[0]?.href).toMatch(/^data:image\/png;base64,/);
      expect(downloads.links[1]).toMatchObject({
        download: "gantt-chart.svg",
      });
      expect(downloads.blobs).toHaveLength(1);
      expect(downloads.blobs[0]?.type).toBe("image/svg+xml;charset=utf-8");
      expect(downloads.blobs[0]?.text).toMatch(/^<svg\b/);
      expect(downloads.blobs[0]?.text).not.toContain("data:image/png");
    });
  }, 20_000);

  it("applies every template and keeps task fields dependencies milestones theme and critical highlighting editable [capability:gantt-chart-generator:profile:release-readiness] [capability:gantt-chart-generator:mode:local-project-planning] [capability:gantt-chart-generator:accepted-input:task-fields] [capability:gantt-chart-generator:produced-output:critical-path] [capability:gantt-chart-generator:browser-feature:task-name-dates-progress] [capability:gantt-chart-generator:browser-feature:dependencies] [capability:gantt-chart-generator:browser-feature:milestones] [capability:gantt-chart-generator:browser-feature:critical-path-highlighting] [capability:gantt-chart-generator:browser-feature:project-templates] [capability:gantt-chart-generator:browser-feature:theme]", async () => {
    await withPage(async (page) => {
      await waitForEditor(page);

      const templates = [
        {
          id: "software-release",
          names: ["Plan release", "Build features", "Test release", "Release"],
        },
        {
          id: "marketing-campaign",
          names: ["Campaign brief", "Create campaign", "Launch campaign"],
        },
        {
          id: "event-preparation",
          names: [
            "Define event",
            "Arrange logistics",
            "Run rehearsal",
            "Event day",
          ],
        },
      ];

      for (const template of templates) {
        await page.select("#gantt-template", template.id);
        await clickButton(page, "Apply template");
        await page.waitForFunction(
          (expected) =>
            document.querySelectorAll(".task-row:not(.task-header)").length ===
            expected,
          {},
          template.names.length,
        );
        expect(await taskNames(page)).toEqual(template.names);
        expect(
          await page.$$eval(
            '[data-critical-task="true"]',
            (nodes) => nodes.length,
          ),
        ).toBe(template.names.length);
        expect(
          await page.$$eval(
            ".milestone-control input:checked",
            (nodes) => nodes.length,
          ),
        ).toBe(1);
      }

      const firstName = await page.$(
        '.task-row:not(.task-header) input[type="text"]',
      );
      expect(firstName).not.toBeNull();
      await firstName!.click({ clickCount: 3 });
      await firstName!.type("Edited event scope");
      await firstName!.evaluate((node) =>
        node.dispatchEvent(new Event("change", { bubbles: true })),
      );
      await page.evaluate(() => {
        const rows = Array.from(
          document.querySelectorAll<HTMLElement>(
            ".task-row:not(.task-header)",
          ),
        );
        const first = rows[0]!;
        const second = rows[1]!;
        const dates = first.querySelectorAll<HTMLInputElement>(
          'input[type="date"]',
        );
        dates[0]!.value = "2026-08-01";
        dates[0]!.dispatchEvent(new Event("change", { bubbles: true }));
        dates[1]!.value = "2026-08-03";
        dates[1]!.dispatchEvent(new Event("change", { bubbles: true }));
        const progress = first.querySelector<HTMLInputElement>(
          'input[type="number"]',
        )!;
        progress.value = "37";
        progress.dispatchEvent(new Event("change", { bubbles: true }));
        const milestone = first.querySelector<HTMLInputElement>(
          '.milestone-control input[type="checkbox"]',
        )!;
        milestone.checked = true;
        milestone.dispatchEvent(new Event("change", { bubbles: true }));
        const dependencies = second.querySelector<HTMLSelectElement>(
          "select.dependency-select",
        )!;
        for (const option of dependencies.options) option.selected = false;
        dependencies.dispatchEvent(new Event("change", { bubbles: true }));
      });
      await page.select("#gantt-color-theme", "forest");

      expect(await taskNames(page)).toEqual([
        "Edited event scope",
        "Arrange logistics",
        "Run rehearsal",
        "Event day",
      ]);
      expect(
        await page.$eval(
          "#gantt-color-theme",
          (node) => (node as HTMLSelectElement).value,
        ),
      ).toBe("forest");
      expect(
        await page.$eval(
          '.task-row:not(.task-header) input[type="date"]',
          (node) => (node as HTMLInputElement).value,
        ),
      ).toBe("2026-08-01");
      expect(
        await page.$eval(
          '.task-row:not(.task-header) input[type="number"]',
          (node) => (node as HTMLInputElement).value,
        ),
      ).toBe("37");
      expect(
        await page.$$eval(
          ".milestone-control input:checked",
          (nodes) => nodes.length,
        ),
      ).toBe(2);
      expect(
        await page.$$eval(
          '.task-row:not(.task-header):nth-child(3) select.dependency-select option:checked',
          (nodes) => nodes.length,
        ),
      ).toBe(0);
      expect(
        await page.$eval("[data-critical-path-summary]", (node) =>
          node.textContent?.trim(),
        ),
      ).toMatch(/^Critical path: \d+ days$/);
    });
  }, 20_000);

  it("imports valid JSON and CSV then rejects duplicate IDs without replacing the valid editor state [capability:gantt-chart-generator:profile:release-readiness] [capability:gantt-chart-generator:accepted-input:json-project] [capability:gantt-chart-generator:accepted-input:csv-project] [capability:gantt-chart-generator:browser-feature:project-data-exchange]", async () => {
    await withPage(async (page) => {
      await waitForEditor(page);
      const pageErrors: string[] = [];
      page.on("pageerror", (error: unknown) =>
        pageErrors.push(error instanceof Error ? error.message : String(error)),
      );

      await uploadTextFile(
        page,
        'input[type="file"][accept*="application/json"]',
        "valid.json",
        JSON.stringify([ganttTask("valid-json", "Valid JSON import")]),
      );
      await page.waitForFunction(
        () =>
          document.querySelector<HTMLInputElement>(
            '.task-row:not(.task-header) input[type="text"]',
          )?.value === "Valid JSON import",
      );

      await uploadTextFile(
        page,
        'input[type="file"][accept*="text/csv"]',
        "valid.csv",
        [
          "id,name,startDate,endDate,progress,milestone,dependencyIds",
          "valid-csv,Valid CSV import,2026-07-01,2026-07-02,25,false,[]",
        ].join("\n"),
      );
      await page.waitForFunction(
        () =>
          document.querySelector<HTMLInputElement>(
            '.task-row:not(.task-header) input[type="text"]',
          )?.value === "Valid CSV import",
      );
      const originalNames = await taskNames(page);

      await uploadTextFile(
        page,
        'input[type="file"][accept*="application/json"]',
        "duplicate.json",
        JSON.stringify([
          ganttTask("duplicate", "First"),
          ganttTask("duplicate", "Second"),
        ]),
      );
      await page.waitForFunction(() =>
        document
          .querySelector('[role="alert"]')
          ?.textContent?.includes("Duplicate task ID"),
      );
      expect(await taskNames(page)).toEqual(originalNames);

      await uploadTextFile(
        page,
        'input[type="file"][accept*="text/csv"]',
        "duplicate.csv",
        [
          "id,name,startDate,endDate,progress,milestone,dependencyIds",
          "duplicate,First,2026-07-01,2026-07-02,0,false,[]",
          "duplicate,Second,2026-07-01,2026-07-02,0,false,[]",
        ].join("\n"),
      );
      await page.waitForFunction(() =>
        document
          .querySelector('[role="alert"]')
          ?.textContent?.includes("Duplicate task ID"),
      );
      expect(await taskNames(page)).toEqual(originalNames);
      expect(pageErrors).toEqual([]);
    });
  }, 20_000);

  it("renders imported task markup as escaped tooltip text", async () => {
    await withPage(async (page) => {
      await waitForEditor(page);
      await uploadTextFile(
        page,
        'input[type="file"][accept*="application/json"]',
        "tooltip.json",
        JSON.stringify([
          ganttTask(
            "unsafe-tooltip",
            '<img src=x onerror="window.__ganttPwned=1">Unsafe tooltip',
          ),
        ]),
      );
      await page.waitForFunction(
        () =>
          document.querySelector<HTMLInputElement>(
            '.task-row:not(.task-header) input[type="text"]',
          )?.value.includes("Unsafe tooltip"),
      );

      const tooltip = await revealTooltip(page, "window.__ganttPwned");
      expect(tooltip.text).toContain(
        '<img src=x onerror="window.__ganttPwned=1">Unsafe tooltip',
      );
      expect(tooltip.html).toContain("&lt;img");
      expect(tooltip.hasExecutableMarkup).toBe(false);
      expect(
        await page.evaluate(
          () => (window as unknown as { __ganttPwned?: number }).__ganttPwned,
        ),
      ).toBeUndefined();
    });
  }, 20_000);

  it("exports JSON and CSV and restores edits from browser-local storage [capability:gantt-chart-generator:profile:release-readiness] [capability:gantt-chart-generator:produced-output:json-project] [capability:gantt-chart-generator:produced-output:csv-project] [capability:gantt-chart-generator:browser-feature:local-persistence] [capability:gantt-chart-generator:browser-feature:project-data-exchange]", async () => {
    await withPage(async (page) => {
      await waitForEditor(page);
      await installDownloadCapture(page);

      const firstName = await page.$(
        '.task-row:not(.task-header) input[type="text"]',
      );
      await firstName!.click({ clickCount: 3 });
      await firstName!.type("Saved locally");
      await firstName!.evaluate((node) =>
        node.dispatchEvent(new Event("change", { bubbles: true })),
      );
      await clickButton(page, "Save locally");

      await page.evaluate(() => {
        window.confirm = () => true;
      });
      await clickButton(page, "Clear");
      await page.waitForFunction(
        () =>
          document.querySelectorAll(".task-row:not(.task-header)").length === 0,
      );
      await clickButton(page, "Restore saved");
      await page.waitForFunction(
        () =>
          document.querySelectorAll(".task-row:not(.task-header)").length > 0,
      );
      expect((await taskNames(page))[0]).toBe("Saved locally");

      await clickButton(page, "Export JSON");
      await clickButton(page, "Export CSV");
      const downloads = await capturedDownloads(page);
      expect(downloads.links.map(({ download }) => download)).toEqual([
        "gantt-project.json",
        "gantt-project.csv",
      ]);
      expect(downloads.blobs[0]?.text).toContain('"name": "Saved locally"');
      expect(downloads.blobs[1]?.text).toContain("Saved locally");
    });
  }, 20_000);

  it("discloses local-only service limits and performs project workflows without network requests [capability:gantt-chart-generator:profile:release-readiness] [capability:gantt-chart-generator:limit:no-collaboration] [capability:gantt-chart-generator:limit:no-cloud-sync] [capability:gantt-chart-generator:limit:no-resource-management] [capability:gantt-chart-generator:limit:no-enterprise-workflow] [capability:gantt-chart-generator:limit:no-live-multi-user]", async () => {
    await withPage(async (page) => {
      await waitForEditor(page);
      const requests: string[] = [];
      page.on("request", (request) => requests.push(request.url()));

      await clickButton(page, "Save locally");
      await page.select("#gantt-template", "marketing-campaign");
      await clickButton(page, "Apply template");
      await clickButton(page, "Restore saved");

      expect(requests).toEqual([]);
      expect(
        await page.$$eval("[data-gantt-limit]", (nodes) =>
          nodes.map((node) => ({
            id: node.getAttribute("data-gantt-limit"),
            text: node.textContent?.trim(),
          })),
        ),
      ).toEqual([
        { id: "no-collaboration", text: "No collaboration or team sharing" },
        { id: "no-cloud-sync", text: "No cloud synchronization" },
        {
          id: "no-resource-management",
          text: "No resource allocation or management",
        },
        {
          id: "no-enterprise-workflow",
          text: "No enterprise approval workflow",
        },
        { id: "no-live-multi-user", text: "No live multi-user project status" },
      ]);
    });
  }, 20_000);
});

async function withPage(run: (page: Page) => Promise<void>): Promise<void> {
  const page = await browser!.newPage();
  try {
    await page.goto(baseUrl, { waitUntil: "networkidle0" });
    await run(page);
  } finally {
    await page.close();
  }
}

async function clickButton(page: Page, text: string): Promise<void> {
  const clicked = await page.$$eval(
    "button",
    (buttons, expectedText) => {
      const button = buttons.find(
        (candidate) => candidate.textContent?.trim() === expectedText,
      );
      if (!(button instanceof HTMLButtonElement)) return false;
      button.click();
      return true;
    },
    text,
  );
  expect(clicked, `missing button ${text}`).toBe(true);
}

async function waitForEditor(page: Page): Promise<void> {
  await page.waitForSelector(".task-row:not(.task-header)");
  await page.waitForSelector(".chart-frame canvas");
  await page.waitForFunction(
    () => !document.querySelector(".chart-frame .absolute"),
  );
}

async function taskNames(page: Page): Promise<string[]> {
  return page.$$eval(
    '.task-row:not(.task-header) input[type="text"]',
    (inputs) => inputs.map((input) => (input as HTMLInputElement).value),
  );
}

async function revealTooltip(
  page: Page,
  marker: string,
): Promise<{ html: string; text: string; hasExecutableMarkup: boolean }> {
  await page.waitForFunction(
    () =>
      typeof (
        window as unknown as { __showGanttTooltip?: () => boolean }
      ).__showGanttTooltip === "function",
  );
  const shown = await page.evaluate(() =>
    (
      window as unknown as { __showGanttTooltip: () => boolean }
    ).__showGanttTooltip(),
  );
  expect(shown).toBe(true);
  await page.waitForFunction(
    (expectedMarker) =>
      document
        .querySelector<HTMLElement>("[data-gantt-tooltip-probe]")
        ?.textContent?.includes(expectedMarker),
    {},
    marker,
  );
  return page.evaluate((expectedMarker) => {
    const node = document.querySelector<HTMLElement>(
      "[data-gantt-tooltip-probe]",
    )!;
    if (!node.textContent?.includes(expectedMarker)) {
      throw new Error("Tooltip probe did not render the expected task name");
    }
    return {
      html: node.innerHTML,
      text: node.textContent ?? "",
      hasExecutableMarkup: Boolean(node.querySelector("img,script")),
    };
  }, marker);
}

async function uploadTextFile(
  page: Page,
  selector: string,
  filename: string,
  contents: string,
): Promise<void> {
  const filePath = path.join(tempRoot, filename);
  writeFileSync(filePath, contents, "utf8");
  const input = (await page.$(selector)) as ElementHandle<HTMLInputElement> | null;
  expect(input, `missing file input ${selector}`).not.toBeNull();
  await input!.uploadFile(filePath);
}

function ganttTask(id: string, name: string) {
  return {
    id,
    name,
    startDate: "2026-07-01",
    endDate: "2026-07-02",
    progress: 0,
    milestone: false,
    dependencyIds: [],
  };
}

async function installDownloadCapture(page: Page): Promise<void> {
  await page.evaluate(() => {
    const capture = {
      links: [] as Array<{ download: string; href: string }>,
      blobs: [] as Blob[],
    };
    (
      window as unknown as { __ganttDownloads: typeof capture }
    ).__ganttDownloads = capture;
    URL.createObjectURL = (blob: Blob) => {
      capture.blobs.push(blob);
      return `blob:gantt-chart-${capture.blobs.length}`;
    };
    URL.revokeObjectURL = () => {};
    HTMLAnchorElement.prototype.click = function click() {
      capture.links.push({ download: this.download, href: this.href });
    };
  });
}

async function capturedDownloads(page: Page) {
  return page.evaluate(async () => {
    const capture = (
      window as unknown as {
        __ganttDownloads: {
          links: Array<{ download: string; href: string }>;
          blobs: Blob[];
        };
      }
    ).__ganttDownloads;
    return {
      links: capture.links,
      blobs: await Promise.all(
        capture.blobs.map(async (blob) => ({
          type: blob.type,
          text: await blob.text(),
        })),
      ),
    };
  });
}

function contentType(filePath: string): string {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".js") || filePath.endsWith(".mjs")) {
    return "text/javascript; charset=utf-8";
  }
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  if (filePath.endsWith(".json")) return "application/json; charset=utf-8";
  if (filePath.endsWith(".svg")) return "image/svg+xml";
  return "application/octet-stream";
}
