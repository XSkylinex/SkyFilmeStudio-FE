import type { FC } from 'react';
import { EmptyState } from '@/lib/components/empty-state';
import { useTranslate } from '@/lib/i18n/use-translate';

export const SubjectsPage: FC = () => {
  const translate = useTranslate();

  return (
    <EmptyState
      title={translate('page.subjects.title')}
      description={translate('page.subjects.description')}
      headingLevel={1}
    />
  );
};
