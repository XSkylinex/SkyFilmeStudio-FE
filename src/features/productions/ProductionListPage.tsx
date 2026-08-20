import type { FC } from 'react';
import { EmptyState } from '@/lib/components/empty-state';
import { useTranslate } from '@/lib/i18n/use-translate';

export const ProductionListPage: FC = () => {
  const translate = useTranslate();

  return (
    <EmptyState
      title={translate('page.productions.title')}
      description={translate('page.productions.description')}
      headingLevel={1}
    />
  );
};
