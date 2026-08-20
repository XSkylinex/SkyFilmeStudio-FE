import { resolveOfflineIndicatorFacts } from '@/shell/offline-indicator/helpers/resolve-offline-indicator-facts';
import type { OfflineMode } from '@/shell/offline-indicator/offline-indicator.interface';

const BASE_OFFLINE_MODE: OfflineMode = {
  localOnly: true,
  strictOffline: false,
  allowLanWorkers: false,
  claudeCodeOperatorEnabled: false,
};

describe('resolveOfflineIndicatorFacts', () => {
  it('reports unknown, and only unknown, when no payload has arrived yet', () => {
    expect(resolveOfflineIndicatorFacts(undefined)).toEqual(['unknown']);
  });

  it('reports remote first but still reports every other true flag, instead of remote swallowing them', () => {
    const facts = resolveOfflineIndicatorFacts({
      ...BASE_OFFLINE_MODE,
      localOnly: false,
      strictOffline: true,
      allowLanWorkers: true,
      claudeCodeOperatorEnabled: true,
    });

    expect(facts).toEqual([
      'remote',
      'operator-enabled',
      'lan-workers',
      'strict-offline',
    ]);
  });

  it('reports the Claude Code operator even when the build is not local-only', () => {
    const facts = resolveOfflineIndicatorFacts({
      ...BASE_OFFLINE_MODE,
      localOnly: false,
      claudeCodeOperatorEnabled: true,
    });

    expect(facts).toEqual(['remote', 'operator-enabled']);
  });

  it('reports both lan-workers and strict-offline when both are true, instead of the strict-offline absolute swallowing the lan-workers fact', () => {
    const facts = resolveOfflineIndicatorFacts({
      ...BASE_OFFLINE_MODE,
      strictOffline: true,
      allowLanWorkers: true,
    });

    expect(facts).toContain('lan-workers');
    expect(facts).toContain('strict-offline');
    expect(facts.indexOf('lan-workers')).toBeLessThan(
      facts.indexOf('strict-offline'),
    );
  });

  it('reports operator-enabled ahead of strict-offline when a backend somehow reports both', () => {
    const facts = resolveOfflineIndicatorFacts({
      ...BASE_OFFLINE_MODE,
      strictOffline: true,
      claudeCodeOperatorEnabled: true,
    });

    expect(facts[0]).toBe('operator-enabled');
    expect(facts).toContain('strict-offline');
  });

  it('falls back to exactly local when every risk flag is false', () => {
    expect(resolveOfflineIndicatorFacts(BASE_OFFLINE_MODE)).toEqual(['local']);
  });
});
