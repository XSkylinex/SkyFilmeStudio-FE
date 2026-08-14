#!/usr/bin/env node
// What is the real newest version of a package, when was it published, and is it
// old enough to install?
//
//   node .claude/skills/newest/scripts/pkg-check.mjs react vite typescript
//   node .claude/skills/newest/scripts/pkg-check.mjs --all      # every dep in package.json
//
// Why this exists rather than `npm view`:
//   `npm view` fails with EACCES on this machine — ~/.npm/_cacache contains
//   root-owned files from an older npm. Measured 2026-08-14: `npx oxlint` died with
//   "npm error code EACCES … mkdir /Users/…/.npm/_cacache/index-v5/…". That reads as
//   "the package does not exist" and it is not. This script talks to the registry
//   directly over HTTPS and touches no npm cache.
//
// Yarn 4 quarantine: if `npmMinimalAgeGate` is set in .yarnrc.yml, `yarn add` REFUSES
// a version published inside that window ("All versions satisfying … are quarantined").
// The AGE column below is how you pick the newest version that will actually install.
// Nothing is configured in this repo today, so the gate is off — but NestJS and @swc/core
// both published on 2026-08-14, so a same-day version is a live scenario, not a hypothetical.
//
// Prints, per package: installed range · registry latest · publish date · age in days
// · other dist-tags worth knowing (next/rc/beta), because a package whose `latest` is
// 0.x while `rc` is 1.0.0 is a decision, not a lookup.

import { readFile } from "node:fs/promises";

const REGISTRY = "https://registry.npmjs.org";
const NAME_WIDTH = 34;
const DAY_MS = 86_400_000;

const args = process.argv.slice(2);

const readManifest = async () => JSON.parse(await readFile(new URL("package.json", `file://${process.cwd()}/`), "utf8"));

const resolveTargets = async () => {
  if (args.length > 0 && args[0] !== "--all") return { names: args, ranges: {} };
  const manifest = await readManifest();
  const ranges = { ...manifest.dependencies, ...manifest.devDependencies };
  return { names: Object.keys(ranges).sort(), ranges };
};

const NOTABLE_TAGS = new Set(["next", "rc", "beta", "canary", "experimental"]);

const inspect = async (name, range) => {
  const response = await fetch(`${REGISTRY}/${name.replace("/", "%2f")}`);
  if (!response.ok) return `${name.padEnd(NAME_WIDTH)} HTTP ${response.status}`;

  const packument = await response.json();
  const tags = packument["dist-tags"] ?? {};
  const latest = tags.latest ?? "?";
  const published = packument.time?.[latest];
  const ageDays = published ? Math.floor((Date.now() - Date.parse(published)) / DAY_MS) : null;

  const notable = Object.entries(tags)
    .filter(([tag, version]) => NOTABLE_TAGS.has(tag) && version !== latest)
    .map(([tag, version]) => `${tag}=${version}`)
    .join(" ");

  return [
    name.padEnd(NAME_WIDTH),
    (range ?? "—").padEnd(12),
    String(latest).padEnd(14),
    (published?.slice(0, 10) ?? "—").padEnd(11),
    `${ageDays ?? "?"}d`.padEnd(6),
    notable,
  ].join(" ").trimEnd();
};

const { names, ranges } = await resolveTargets();
if (names.length === 0) {
  process.stderr.write("usage: pkg-check.mjs <package>… | --all\n");
  process.exit(2);
}

const header = [
  "PACKAGE".padEnd(NAME_WIDTH),
  "IN REPO".padEnd(12),
  "LATEST".padEnd(14),
  "PUBLISHED".padEnd(11),
  "AGE".padEnd(6),
  "OTHER TAGS",
].join(" ");

const rows = await Promise.all(names.map((name) => inspect(name, ranges[name])));
process.stdout.write(`${header}\n${rows.join("\n")}\n`);
