import type { FC } from 'react';
import { EmptyState } from '@/lib/components/empty-state';
import { useTranslate } from '@/lib/i18n/use-translate';

export const DashboardPage: FC = () => {
  const translate = useTranslate();

  return (
    <EmptyState
      title={translate('page.dashboard.title')}
      description={translate('page.dashboard.description')}
      headingLevel={1}
    />
  );
};
