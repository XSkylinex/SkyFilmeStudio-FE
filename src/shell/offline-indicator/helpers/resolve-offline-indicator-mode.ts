import { resolveOfflineIndicatorFacts } from './resolve-offline-indicator-facts';
import type {
  OfflineIndicatorMode,
  OfflineMode,
} from '../offline-indicator.interface';

export const resolveOfflineIndicatorMode = (
  offlineMode: OfflineMode | undefined,
): OfflineIndicatorMode => {
  const facts = resolveOfflineIndicatorFacts(offlineMode);
  return facts[0] ?? 'unknown';
};
