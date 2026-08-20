import type { FC } from 'react';
import { EmptyState } from '@/lib/components/empty-state';
import { useTranslate } from '@/lib/i18n/use-translate';

export const VoicesPage: FC = () => {
  const translate = useTranslate();

  return (
    <EmptyState
      title={translate('page.voices.title')}
      description={translate('page.voices.description')}
      headingLevel={1}
    />
  );
};
