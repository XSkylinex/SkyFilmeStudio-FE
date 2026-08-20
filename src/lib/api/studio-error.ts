import type { ErrorCode } from 'sky-filme-studio-be/contracts';
import { EN_CATALOGUE } from '@/lib/i18n/catalogue/en';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import { translate } from '@/lib/i18n/helpers/translate';
import type { TranslationValues } from '@/lib/i18n/interfaces/catalogue';
import type {
  StudioErrorInput,
  StudioErrorKind,
} from '@/lib/api/api.interface';

export class StudioError extends Error {
  readonly kind: StudioErrorKind;
  readonly messageKey: TranslationKey;
  readonly messageValues: TranslationValues | undefined;
  readonly code: ErrorCode | undefined;
  readonly status: number | undefined;
  readonly detail: string | undefined;

  constructor(input: StudioErrorInput) {
    super(translate(EN_CATALOGUE, input.messageKey, input.messageValues), {
      cause: input.cause,
    });
    this.name = 'StudioError';
    this.kind = input.kind;
    this.messageKey = input.messageKey;
    this.messageValues = input.messageValues;
    this.code = input.code;
    this.status = input.status;
    this.detail = input.detail;
  }
}
