import { getApiBaseUrl } from '@/lib/api/api-base-url';

describe('getApiBaseUrl', () => {
  it('resolves to same-origin under Vitest, since jsdom serves the page from a loopback origin and nothing configures VITE_ORCHESTRATOR_URL', () => {
    expect(getApiBaseUrl()).toBe('');
  });

  it('resolves once and reuses the answer, so a misconfiguration cannot half-apply mid-session', () => {
    expect(getApiBaseUrl()).toBe(getApiBaseUrl());
  });
});
