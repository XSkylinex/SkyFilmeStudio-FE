import type { FC } from 'react';
import { EmptyState } from '@/lib/components/empty-state';
import { useTranslate } from '@/lib/i18n/use-translate';

export const AssetsPage: FC = () => {
  const translate = useTranslate();

  return (
    <EmptyState
      title={translate('page.assets.title')}
      description={translate('page.assets.description')}
      headingLevel={1}
    />
  );
};
