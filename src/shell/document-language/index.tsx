import { useEffect } from 'react';
import type { FC } from 'react';
import { resolveTextDirection } from '@/lib/i18n/helpers/resolve-text-direction';
import { applyDocumentLanguage } from '@/shell/helpers/apply-document-language';
import { selectInterfaceLanguage } from '@/shell/shell.slice';
import { useAppSelector } from '@/shell/store/hooks';

export const DocumentLanguage: FC = () => {
  const interfaceLanguage = useAppSelector(selectInterfaceLanguage);

  useEffect(() => {
    applyDocumentLanguage(
      interfaceLanguage,
      resolveTextDirection(interfaceLanguage),
    );
  }, [interfaceLanguage]);

  return null;
};
