import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the sustainability story", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /The Distance Remaining/);
  assert.match(html, /Progress is measurable/);
  assert.match(html, /2024 SNAPSHOT/);
  assert.match(html, /Explore data/);
  assert.match(html, /Scope 1 and 2 emissions reduction/);
  assert.match(html, /Waste diverted from incineration and landfill/);
  assert.match(html, /D3 line chart showing emissions indexed at 100/);
  assert.match(html, /Interactive 3D campus field encoding 19 LEED-certified buildings/);
  assert.match(html, /<canvas/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});
