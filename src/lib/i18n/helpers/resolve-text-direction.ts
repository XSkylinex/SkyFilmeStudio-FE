import { DOCUMENT_DIRECTION } from '@/shell/document-language.constants';
import type { DocumentDirection } from '@/shell/interfaces/document-direction';
import { RTL_PRIMARY_SUBTAGS } from '@/lib/i18n/i18n.constants';

const SUBTAG_SEPARATOR = '-';

export const resolveTextDirection = (
  languageTag: string | undefined,
): DocumentDirection => {
  const primarySubtag = (languageTag ?? '')
    .split(SUBTAG_SEPARATOR)[0]
    ?.toLowerCase();

  return primarySubtag !== undefined && RTL_PRIMARY_SUBTAGS.has(primarySubtag)
    ? DOCUMENT_DIRECTION.RTL
    : DOCUMENT_DIRECTION.LTR;
};
