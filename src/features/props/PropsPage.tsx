import type { FC } from 'react';
import { EmptyState } from '@/lib/components/empty-state';
import { useTranslate } from '@/lib/i18n/use-translate';

export const PropsPage: FC = () => {
  const translate = useTranslate();

  return (
    <EmptyState
      title={translate('page.props.title')}
      description={translate('page.props.description')}
      headingLevel={1}
    />
  );
};
