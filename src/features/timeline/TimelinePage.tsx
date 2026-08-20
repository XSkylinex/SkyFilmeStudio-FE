import type { FC } from 'react';
import { EmptyState } from '@/lib/components/empty-state';
import { useTranslate } from '@/lib/i18n/use-translate';

export const TimelinePage: FC = () => {
  const translate = useTranslate();

  return (
    <EmptyState
      title={translate('page.timeline.title')}
      description={translate('page.timeline.description')}
      headingLevel={1}
    />
  );
};
