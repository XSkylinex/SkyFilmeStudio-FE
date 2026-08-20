import type { FC } from 'react';
import { EmptyState } from '@/lib/components/empty-state';
import { useTranslate } from '@/lib/i18n/use-translate';

export const AudioPage: FC = () => {
  const translate = useTranslate();

  return (
    <EmptyState
      title={translate('page.audio.title')}
      description={translate('page.audio.description')}
      headingLevel={1}
    />
  );
};
