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

  it('reports a host that merely looks like loopback', () => {
    const js = 'fetch("https://localhost.evil.example.com/exfiltrate")';

    expect(findExternalUrls(js)).toStrictEqual([
      'https://localhost.evil.example.com/exfiltrate',
    ]);
  });

  it('finds nothing in output that loads everything from itself', () => {
    const js =
      'const logo = "/assets/logo-a1b2c3.svg"; fetch("/api/capabilities");';

    expect(findExternalUrls(js)).toStrictEqual([]);
  });
});
