#!/usr/bin/env node
// Answers one question: is a web feature inside the browser floor this repo builds to?
//
//   node .claude/skills/newest/scripts/floor-check.mjs has color-mix view-transitions
//
// Feature ids are webstatus.dev ids. Find one with:
//   curl -s "https://api.webstatus.dev/v1/features?q=<text>&page_size=5"
//
// The floor is not a preference — it is what Vite 8's default build.target
// ('baseline-widely-available') actually resolves to. Read the CONSTANT, not the JSDoc.
// Under Yarn PnP the package is a zip, so grep the cache entry:
//
//   Z=$(find ~/.yarn/berry/cache -name "vite-npm-8*.zip" | head -1)
//   unzip -p "$Z" node_modules/vite/dist/node/chunks/node.js \
//     | grep -A8 BASELINE_WIDELY_AVAILABLE_TARGET
//
// Measured 2026-08-14 against vite 8.2.1:
//   ESBUILD_BASELINE_WIDELY_AVAILABLE_TARGET
//     = ["chrome111","edge111","firefox114","safari16.4","ios16.4"]
//
// That is FIVE entries. Vite's own `build.target` JSDoc lists only four — it omits
// ios16.4, and iOS Safari is exactly the engine most likely to lag. Trusting the prose
// instead of the constant is how a floor check ships wrong.
//
// Chrome and Firefox share version numbers across desktop and Android, so one entry
// each covers both surfaces webstatus.dev reports separately.
//
// Re-read the constant after every Vite upgrade and update FLOOR if the versions moved.
//
// Lives under .claude/, which oxlint does lint — keep it warning-clean.

const FLOOR = {
  chrome: 111,
  chrome_android: 111,
  edge: 111,
  firefox: 114,
  firefox_android: 114,
  safari: 16.4,
  safari_ios: 16.4,
};
const API = "https://api.webstatus.dev/v1/features";
const ID_WIDTH = 24;

const ids = process.argv.slice(2);
if (ids.length === 0) {
  process.stderr.write("usage: floor-check.mjs <feature-id>…  (e.g. has nesting light-dark)\n");
  process.exit(2);
}

const describe = (feature) => {
  const impls = feature.browser_implementations ?? {};
  const entries = Object.entries(FLOOR);

  const shippedWithin = ([browser, floorVersion]) => {
    const impl = impls[browser];
    return impl?.status === "available" && Number.parseFloat(impl.version) <= floorVersion;
  };

  // Only the browsers that block are worth printing; listing all seven buries them.
  const blockers = entries.filter((entry) => !shippedWithin(entry)).map((entry) => {
    const [browser] = entry;
    const impl = impls[browser];
    return impl?.status === "available" ? `${browser} ${impl.version}` : `${browser} none`;
  });

  const inside = blockers.length === 0;
  const status = (feature.baseline?.status ?? "?").padEnd(8);
  const why = inside ? `all ${entries.length} at or below floor` : `blocked by: ${blockers.join(", ")}`;
  return `${status} ${inside ? "INSIDE " : "OUTSIDE"} floor | ${why}`;
};

const lookups = ids.map(async (id) => {
  const response = await fetch(`${API}/${encodeURIComponent(id)}`);
  if (!response.ok) return `NOT-FOUND — search: ${API}?q=${encodeURIComponent(id)}`;
  return describe(await response.json());
});

const results = await Promise.all(lookups);
process.stdout.write(results.map((line, i) => `${ids[i].padEnd(ID_WIDTH)} ${line}`).join("\n") + "\n");
