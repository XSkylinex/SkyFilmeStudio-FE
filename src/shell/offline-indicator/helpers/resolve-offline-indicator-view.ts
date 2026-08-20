import { OPERATING_MODE_HEADLINE } from '../offline-indicator.constants';
import type {
  OfflineIndicatorFact,
  OfflineIndicatorView,
  OfflineMode,
} from '../offline-indicator.interface';

export const resolveOfflineIndicatorView = (
  offlineMode: OfflineMode | undefined,
): OfflineIndicatorView => {
  if (!offlineMode) {
    return { headline: 'unknown', facts: ['unknown'] };
  }

  const headline = OPERATING_MODE_HEADLINE[offlineMode.operatingMode];
  const facts: OfflineIndicatorFact[] = [headline];

  if (offlineMode.allowLanWorkers) {
    facts.push('lan-workers');
  }

  return { headline, facts };
};
