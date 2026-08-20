import type { FC } from 'react';
import { EmptyState } from '@/lib/components/empty-state';
import { useTranslate } from '@/lib/i18n/use-translate';

export const LocationsPage: FC = () => {
  const translate = useTranslate();

  return (
    <EmptyState
      title={translate('page.locations.title')}
      description={translate('page.locations.description')}
      headingLevel={1}
    />
  );
};
