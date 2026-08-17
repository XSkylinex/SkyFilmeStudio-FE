import { resolveOfflineIndicatorMode } from '@/shell/offline-indicator/helpers/resolve-offline-indicator-mode';
import type { OfflineMode } from '@/shell/offline-indicator/offline-indicator.interface';

const BASE_OFFLINE_MODE: OfflineMode = {
  localOnly: true,
  strictOffline: false,
  allowLanWorkers: false,
  claudeCodeOperatorEnabled: false,
};

describe('resolveOfflineIndicatorMode', () => {
  it('reports remote whenever the build is not local-only, above every other signal', () => {
    const mode = resolveOfflineIndicatorMode({
      ...BASE_OFFLINE_MODE,
      localOnly: false,
      strictOffline: true,
      claudeCodeOperatorEnabled: true,
    });

    expect(mode).toBe('remote');
  });

  it('reports operator-enabled when the Claude Code operator is on, even under strict offline', () => {
    const mode = resolveOfflineIndicatorMode({
      ...BASE_OFFLINE_MODE,
      strictOffline: true,
      claudeCodeOperatorEnabled: true,
    });

    expect(mode).toBe('operator-enabled');
  });

  it('reports strict-offline distinctly from operator-enabled', () => {
    const mode = resolveOfflineIndicatorMode({
      ...BASE_OFFLINE_MODE,
      strictOffline: true,
    });

    expect(mode).toBe('strict-offline');
    expect(mode).not.toBe('operator-enabled');
  });

  it('reports lan-workers when LAN workers are allowed and nothing stronger applies', () => {
    const mode = resolveOfflineIndicatorMode({
      ...BASE_OFFLINE_MODE,
      allowLanWorkers: true,
    });

    expect(mode).toBe('lan-workers');
  });

  it('reports local as the default when nothing else is set', () => {
    expect(resolveOfflineIndicatorMode(BASE_OFFLINE_MODE)).toBe('local');
  });
});
