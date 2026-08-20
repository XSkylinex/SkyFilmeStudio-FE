import type {
  OfflineIndicatorMode,
  OfflineMode,
} from '../offline-indicator.interface';

export const resolveOfflineIndicatorFacts = (
  offlineMode: OfflineMode | undefined,
): readonly OfflineIndicatorMode[] => {
  if (!offlineMode) {
    return ['unknown'];
  }

  const facts: OfflineIndicatorMode[] = [];
  if (!offlineMode.localOnly) {
    facts.push('remote');
  }
  if (offlineMode.claudeCodeOperatorEnabled) {
    facts.push('operator-enabled');
  }
  if (offlineMode.allowLanWorkers) {
    facts.push('lan-workers');
  }
  if (offlineMode.strictOffline) {
    facts.push('strict-offline');
  }

  return facts.length > 0 ? facts : ['local'];
};
