import { DOCUMENT_DIRECTION } from '@/shell/document-language.constants';
import type { DocumentDirection } from '@/shell/interfaces/document-direction';
import {
  LTR_SCRIPT_SUBTAGS,
  RTL_PRIMARY_SUBTAGS,
  RTL_SCRIPT_SUBTAGS,
} from '@/lib/i18n/i18n.constants';

const SUBTAG_SEPARATOR = '-';

export const resolveTextDirection = (
  languageTag: string | undefined,
): DocumentDirection => {
  const subtags = (languageTag ?? '').toLowerCase().split(SUBTAG_SEPARATOR);
  const script = subtags.find((subtag) => subtag.length === 4);

  if (script !== undefined) {
    if (RTL_SCRIPT_SUBTAGS.has(script)) {
      return DOCUMENT_DIRECTION.RTL;
    }

    if (LTR_SCRIPT_SUBTAGS.has(script)) {
      return DOCUMENT_DIRECTION.LTR;
    }
  }

  return RTL_PRIMARY_SUBTAGS.has(subtags[0] ?? '')
    ? DOCUMENT_DIRECTION.RTL
    : DOCUMENT_DIRECTION.LTR;
};
