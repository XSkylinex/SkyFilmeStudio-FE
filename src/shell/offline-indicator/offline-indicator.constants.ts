import type { OperatingMode } from 'sky-filme-studio-be/contracts';
import type { StatusTone } from '@/lib/interfaces/status-tone';
import { STATUS_TONE } from '@/lib/status-tone.constants';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import type {
  OfflineIndicatorFact,
  OfflineIndicatorHeadline,
} from './offline-indicator.interface';

export const OPERATING_MODE_HEADLINE: Record<
  OperatingMode,
  OfflineIndicatorHeadline
> = {
  NON_LOCAL_GENERATION_ENABLED: 'remote',
  CLAUDE_CODE_CONTEXT_SHARING: 'operator-enabled',
  STRICT_OFFLINE: 'strict-offline',
  LOCAL_ONLY: 'local',
};

export const OFFLINE_INDICATOR_HEADLINE_TONE = {
  unknown: STATUS_TONE.CHECKING,
  remote: STATUS_TONE.DANGER,
  'operator-enabled': STATUS_TONE.WARNING,
  'strict-offline': STATUS_TONE.SUCCESS,
  local: STATUS_TONE.READY,
} satisfies Record<OfflineIndicatorHeadline, StatusTone>;

export const OFFLINE_INDICATOR_HEADLINE_LABEL_KEY = {
  unknown: 'offline.unknown.label',
  remote: 'offline.remote.label',
  'operator-enabled': 'offline.operatorEnabled.label',
  'strict-offline': 'offline.strictOffline.label',
  local: 'offline.local.label',
} satisfies Record<OfflineIndicatorHeadline, TranslationKey>;

export const OFFLINE_INDICATOR_FACT_DESCRIPTION_KEY = {
  unknown: 'offline.unknown.description',
  remote: 'offline.remote.description',
  'operator-enabled': 'offline.operatorEnabled.description',
  'lan-workers': 'offline.lanWorkers.description',
  'strict-offline': 'offline.strictOffline.description',
  local: 'offline.local.description',
} satisfies Record<OfflineIndicatorFact, TranslationKey>;
