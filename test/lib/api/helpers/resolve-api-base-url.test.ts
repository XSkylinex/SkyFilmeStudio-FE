import { resolveApiBaseUrl } from '@/lib/api/helpers/resolve-api-base-url';

describe('resolveApiBaseUrl', () => {
  it('uses a configured loopback URL over the page origin', () => {
    expect(
      resolveApiBaseUrl({
        configured: 'http://127.0.0.1:9999',
        pageOrigin: 'http://example.com',
      }),
    ).toBe('http://127.0.0.1:9999');
  });

  it('throws and names the host when the configured URL points off this machine', () => {
    expect(() =>
      resolveApiBaseUrl({
        configured: 'http://example.com',
        pageOrigin: 'http://localhost:3000',
      }),
    ).toThrow('example.com');
  });

  it('throws on a configured value that is not a valid URL at all', () => {
    expect(() =>
      resolveApiBaseUrl({
        configured: 'not a url',
        pageOrigin: 'http://localhost:3000',
      }),
    ).toThrow('not a url');
  });

  it('resolves to same-origin when unset and the page itself is loopback', () => {
    expect(
      resolveApiBaseUrl({
        configured: undefined,
        pageOrigin: 'http://localhost:5173',
      }),
    ).toBe('');
  });

  it('treats an empty configured value the same as unset', () => {
    expect(
      resolveApiBaseUrl({
        configured: '',
        pageOrigin: 'http://localhost:5173',
      }),
    ).toBe('');
  });

  it('throws when unset and the page serving the build is not loopback', () => {
    expect(() =>
      resolveApiBaseUrl({
        configured: undefined,
        pageOrigin: 'https://example.com',
      }),
    ).toThrow('example.com');
  });

  it('refuses a configured URL that carries a path, instead of silently dropping it', () => {
    expect(() =>
      resolveApiBaseUrl({
        configured: 'http://127.0.0.1:5556/api/v1',
        pageOrigin: 'http://localhost:5173',
      }),
    ).toThrow(/no path/i);
  });

  it('refuses a configured URL that carries credentials', () => {
    expect(() =>
      resolveApiBaseUrl({
        configured: 'http://user:pass@127.0.0.1:5556',
        pageOrigin: 'http://localhost:5173',
      }),
    ).toThrow(/credentials/i);
  });

  it('refuses a scheme fetch cannot use, rather than failing later inside the request', () => {
    expect(() =>
      resolveApiBaseUrl({
        configured: 'ws://127.0.0.1:5556',
        pageOrigin: 'http://localhost:5173',
      }),
    ).toThrow(/http or https/i);
  });

  it('refuses a host that only begins with the loopback range', () => {
    expect(() =>
      resolveApiBaseUrl({
        configured: 'http://127.0.0.1.evil.example.com',
        pageOrigin: 'http://localhost:5173',
      }),
    ).toThrow(/must address this machine/i);
  });
});
