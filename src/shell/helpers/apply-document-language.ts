import type { DocumentDirection } from '@/shell/interfaces/document-direction';

export const applyDocumentLanguage = (
  language: string,
  direction: DocumentDirection,
): void => {
  document.documentElement.lang = language;
  document.documentElement.dir = direction;
};
