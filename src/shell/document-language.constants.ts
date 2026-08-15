import type { DocumentDirection } from '@/shell/interfaces/document-direction';

export const DOCUMENT_DIRECTION = {
  LTR: 'ltr',
  RTL: 'rtl',
} satisfies Record<string, DocumentDirection>;

export const DEFAULT_INTERFACE_LANGUAGE = 'en';

export const DEFAULT_DOCUMENT_DIRECTION: DocumentDirection =
  DOCUMENT_DIRECTION.LTR;
