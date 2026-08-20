import type { FC } from 'react';
import { EmptyState } from '@/lib/components/empty-state';
import { useTranslate } from '@/lib/i18n/use-translate';

export const ProjectListPage: FC = () => {
  const translate = useTranslate();

  return (
    <EmptyState
      title={translate('page.projects.title')}
      description={translate('page.projects.description')}
      headingLevel={1}
    />
  );
};
