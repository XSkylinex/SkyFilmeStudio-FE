import type { PreflightStatus } from 'sky-filme-studio-be/contracts';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';

export const PREFLIGHT_STATUS_LABEL_KEY = {
  PASS: 'system.preflight.status.PASS',
  FAIL: 'system.preflight.status.FAIL',
  NOT_APPLICABLE: 'system.preflight.status.NOT_APPLICABLE',
  NOT_IMPLEMENTED: 'system.preflight.status.NOT_IMPLEMENTED',
} satisfies Record<PreflightStatus, TranslationKey>;
