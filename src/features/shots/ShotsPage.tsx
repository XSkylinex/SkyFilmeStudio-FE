import type { FC } from 'react';
import { EmptyState } from '@/lib/components/empty-state';
import { useTranslate } from '@/lib/i18n/use-translate';

export const ShotsPage: FC = () => {
  const translate = useTranslate();

  return (
    <EmptyState
      title={translate('page.shots.title')}
      description={translate('page.shots.description')}
      headingLevel={1}
    />
  );
};
