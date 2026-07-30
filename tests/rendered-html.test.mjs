import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

test("builds the static GitHub Pages application", async () => {
  const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
  const assetNames = await readdir(new URL("../dist/assets/", import.meta.url));
  const scriptNames = assetNames.filter((name) => name.endsWith(".js"));
  const scripts = await Promise.all(
    scriptNames.map((name) => readFile(new URL(`../dist/assets/${name}`, import.meta.url), "utf8")),
  );
  const javascript = scripts.join("\n");

  assert.match(html, /The Distance Remaining/);
  assert.match(html, /\/sus-viz\/assets\//);
  assert.match(html, /https:\/\/sirnosh\.github\.io\/sus-viz\/og\.png/);
  assert.match(javascript, /Progress is measurable/);
  assert.match(javascript, /D3 line chart showing emissions indexed at 100/);
  assert.match(javascript, /Interactive 3D campus field encoding 19 LEED-certified buildings/);
  assert.match(javascript, /Neither has a universitywide numeric target in the cited progress report/);
  assert.match(javascript, /Net zero is not equivalent to a linear zero-emissions endpoint/);
  assert.match(javascript, /Not calculated/);
  assert.match(javascript, /food-share-strip/);
  assert.match(javascript, /aria-pressed/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/i);
});
