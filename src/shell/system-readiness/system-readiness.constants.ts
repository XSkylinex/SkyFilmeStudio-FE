import type { StatusTone } from '@/lib/interfaces/status-tone';
import { STATUS_TONE } from '@/lib/status-tone.constants';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import type { SystemReadinessState } from './system-readiness.interface';

export const SYSTEM_READINESS_TONE = {
  unknown: STATUS_TONE.CHECKING,
  ready: STATUS_TONE.SUCCESS,
  blocked: STATUS_TONE.DANGER,
} satisfies Record<SystemReadinessState, StatusTone>;

export const SYSTEM_READINESS_LABEL_KEY = {
  unknown: 'readiness.unknown.label',
  ready: 'readiness.ready.label',
  blocked: 'readiness.blocked.label',
} satisfies Record<SystemReadinessState, TranslationKey>;

export const SYSTEM_READINESS_DESCRIPTION_KEY = {
  unknown: 'readiness.unknown.description',
  ready: 'readiness.ready.description',
  blocked: 'readiness.blocked.description',
} satisfies Record<SystemReadinessState, TranslationKey>;
