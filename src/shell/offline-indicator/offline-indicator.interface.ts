export interface OfflineMode {
  readonly localOnly: boolean;
  readonly strictOffline: boolean;
  readonly allowLanWorkers: boolean;
  readonly claudeCodeOperatorEnabled: boolean;
}

export type OfflineIndicatorMode =
  'remote' | 'operator-enabled' | 'lan-workers' | 'strict-offline' | 'local';

export interface OfflineIndicatorProps {
  offlineMode: OfflineMode;
}
