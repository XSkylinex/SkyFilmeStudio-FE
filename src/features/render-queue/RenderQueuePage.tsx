import type { FC } from 'react';
import { EmptyState } from '@/lib/components/empty-state';
import { useTranslate } from '@/lib/i18n/use-translate';

export const RenderQueuePage: FC = () => {
  const translate = useTranslate();

  return (
    <EmptyState
      title={translate('page.renderQueue.title')}
      description={translate('page.renderQueue.description')}
      headingLevel={1}
    />
  );
};
