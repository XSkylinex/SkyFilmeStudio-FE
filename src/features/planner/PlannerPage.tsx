import type { FC } from 'react';
import { EmptyState } from '@/lib/components/empty-state';
import { useTranslate } from '@/lib/i18n/use-translate';

export const PlannerPage: FC = () => {
  const translate = useTranslate();

  return (
    <EmptyState
      title={translate('page.planner.title')}
      description={translate('page.planner.description')}
      headingLevel={1}
    />
  );
};
