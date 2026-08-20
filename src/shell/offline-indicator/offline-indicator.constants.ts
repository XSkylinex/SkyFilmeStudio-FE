import type { StatusTone } from '@/lib/interfaces/status-tone';
import { STATUS_TONE } from '@/lib/status-tone.constants';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import type { OfflineIndicatorMode } from './offline-indicator.interface';

export const OFFLINE_INDICATOR_MODE_TONE = {
  unknown: STATUS_TONE.CHECKING,
  remote: STATUS_TONE.DANGER,
  'operator-enabled': STATUS_TONE.WARNING,
  'lan-workers': STATUS_TONE.ATTENTION,
  'strict-offline': STATUS_TONE.SUCCESS,
  local: STATUS_TONE.READY,
} satisfies Record<OfflineIndicatorMode, StatusTone>;

export const OFFLINE_INDICATOR_MODE_LABEL_KEY = {
  unknown: 'offline.unknown.label',
  remote: 'offline.remote.label',
  'operator-enabled': 'offline.operatorEnabled.label',
  'lan-workers': 'offline.lanWorkers.label',
  'strict-offline': 'offline.strictOffline.label',
  local: 'offline.local.label',
} satisfies Record<OfflineIndicatorMode, TranslationKey>;

export const OFFLINE_INDICATOR_MODE_DESCRIPTION_KEY = {
  unknown: 'offline.unknown.description',
  remote: 'offline.remote.description',
  'operator-enabled': 'offline.operatorEnabled.description',
  'lan-workers': 'offline.lanWorkers.description',
  'strict-offline': 'offline.strictOffline.description',
  local: 'offline.local.description',
} satisfies Record<OfflineIndicatorMode, TranslationKey>;
