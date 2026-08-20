import type { FC } from 'react';
import { EmptyState } from '@/lib/components/empty-state';
import { useTranslate } from '@/lib/i18n/use-translate';

export const NotFoundPage: FC = () => {
  const translate = useTranslate();

  return (
    <EmptyState
      title={translate('page.notFound.title')}
      description={translate('page.notFound.description')}
      headingLevel={1}
    />
  );
};
