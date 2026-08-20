import { isLoopbackHost } from '@/lib/api/helpers/is-loopback-host';

describe('isLoopbackHost', () => {
  it('treats localhost as loopback', () => {
    expect(isLoopbackHost('localhost')).toBe(true);
  });

  it('treats a subdomain of .localhost as loopback', () => {
    expect(isLoopbackHost('orchestrator.localhost')).toBe(true);
  });

  it('treats the IPv6 loopback literal as loopback', () => {
    expect(isLoopbackHost('[::1]')).toBe(true);
  });

  it('treats a 127.x address as loopback', () => {
    expect(isLoopbackHost('127.0.0.1')).toBe(true);
    expect(isLoopbackHost('127.255.255.255')).toBe(true);
  });

  it('does not treat a host that merely starts with "localhost" as loopback', () => {
    expect(isLoopbackHost('localhost.evil.example.com')).toBe(false);
  });

  it('does not treat an ordinary remote host as loopback', () => {
    expect(isLoopbackHost('example.com')).toBe(false);
  });
});
