import type { FC } from 'react';
import { EmptyState } from '@/lib/components/empty-state';
import { useTranslate } from '@/lib/i18n/use-translate';

export const StylesPage: FC = () => {
  const translate = useTranslate();

  return (
    <EmptyState
      title={translate('page.styles.title')}
      description={translate('page.styles.description')}
      headingLevel={1}
    />
  );
};
