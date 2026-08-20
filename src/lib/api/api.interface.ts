import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import type { TranslationValues } from '@/lib/i18n/interfaces/catalogue';
import type { ErrorCode } from 'sky-filme-studio-be/contracts';

export type StudioErrorKind = 'NETWORK' | 'HTTP' | 'MALFORMED' | 'CONTRACT';

export type ErrorPresentation = 'TRANSIENT' | 'PERSISTENT';

export interface ErrorCodeGuidance {
  readonly presentation: ErrorPresentation;
  readonly messageKey: TranslationKey;
}

export interface StudioErrorInput {
  kind: StudioErrorKind;
  messageKey: TranslationKey;
  messageValues?: TranslationValues | undefined;
  code?: ErrorCode | undefined;
  status?: number | undefined;
  detail?: string | undefined;
  cause?: unknown;
}
