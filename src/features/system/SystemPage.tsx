import type { FC } from 'react';
import { EmptyState } from '@/lib/components/empty-state';
import { useTranslate } from '@/lib/i18n/use-translate';

export const SystemPage: FC = () => {
  const translate = useTranslate();

  return (
    <EmptyState
      title={translate('page.system.title')}
      description={translate('page.system.description')}
      headingLevel={1}
    />
  );
};
