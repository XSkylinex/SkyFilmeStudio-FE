import type { OperatingMode } from 'sky-filme-studio-be/contracts';

export interface OfflineMode {
  readonly operatingMode: OperatingMode;
  readonly allowLanWorkers: boolean;
}

export type OfflineIndicatorHeadline =
  'unknown' | 'remote' | 'operator-enabled' | 'strict-offline' | 'local';

export type OfflineIndicatorFact = OfflineIndicatorHeadline | 'lan-workers';

export interface OfflineIndicatorProps {
  offlineMode?: OfflineMode | undefined;
}

export interface OfflineIndicatorView {
  readonly headline: OfflineIndicatorHeadline;
  readonly facts: readonly OfflineIndicatorFact[];
}
