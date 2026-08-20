import type { OperatingMode } from 'sky-filme-studio-be/contracts';
import { resolveOfflineIndicatorView } from '@/shell/offline-indicator/helpers/resolve-offline-indicator-view';
import type { OfflineIndicatorHeadline } from '@/shell/offline-indicator/offline-indicator.interface';
import { buildSystemMode } from '../../../fixtures/system-mode.fixture';

const HEADLINE_FOR_MODE: readonly (readonly [
  OperatingMode,
  OfflineIndicatorHeadline,
])[] = [
  ['LOCAL_ONLY', 'local'],
  ['STRICT_OFFLINE', 'strict-offline'],
  ['CLAUDE_CODE_CONTEXT_SHARING', 'operator-enabled'],
  ['NON_LOCAL_GENERATION_ENABLED', 'remote'],
];

describe('resolveOfflineIndicatorView', () => {
  it('reports unknown, and only unknown, when no payload has arrived yet', () => {
    expect(resolveOfflineIndicatorView(undefined)).toEqual({
      headline: 'unknown',
      facts: ['unknown'],
    });
  });

  HEADLINE_FOR_MODE.forEach(([operatingMode, headline]) => {
    it(`headlines ${operatingMode} as ${headline}`, () => {
      const view = resolveOfflineIndicatorView(
        buildSystemMode({ operatingMode }),
      );

      expect(view.headline).toBe(headline);
      expect(view.facts).toEqual([headline]);
    });
  });

  it('takes the operating mode the orchestrator computed, not the flags it was computed from', () => {
    const view = resolveOfflineIndicatorView(
      buildSystemMode({
        operatingMode: 'STRICT_OFFLINE',
        localOnly: false,
        strictOffline: false,
        claudeCodeOperatorEnabled: true,
      }),
    );

    expect(view.headline).toBe('strict-offline');
  });

  it('adds LAN workers as a second fact without letting it take the headline', () => {
    const view = resolveOfflineIndicatorView(
      buildSystemMode({
        operatingMode: 'STRICT_OFFLINE',
        allowLanWorkers: true,
      }),
    );

    expect(view.headline).toBe('strict-offline');
    expect(view.facts).toEqual(['strict-offline', 'lan-workers']);
  });

  it('omits the LAN fact entirely when LAN workers are not allowed', () => {
    const view = resolveOfflineIndicatorView(
      buildSystemMode({ allowLanWorkers: false }),
    );

    expect(view.facts).not.toContain('lan-workers');
  });
});
