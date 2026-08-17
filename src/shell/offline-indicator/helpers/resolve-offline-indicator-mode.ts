import type {
  OfflineIndicatorMode,
  OfflineMode,
} from '../offline-indicator.interface';

export const resolveOfflineIndicatorMode = (
  offlineMode: OfflineMode,
): OfflineIndicatorMode => {
  if (!offlineMode.localOnly) {
    return 'remote';
  }
  if (offlineMode.claudeCodeOperatorEnabled) {
    return 'operator-enabled';
  }
  if (offlineMode.strictOffline) {
    return 'strict-offline';
  }
  if (offlineMode.allowLanWorkers) {
    return 'lan-workers';
  }
  return 'local';
};
