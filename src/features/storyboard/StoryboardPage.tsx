import type { FC } from 'react';
import { EmptyState } from '@/lib/components/empty-state';
import { useTranslate } from '@/lib/i18n/use-translate';

export const StoryboardPage: FC = () => {
  const translate = useTranslate();

  return (
    <EmptyState
      title={translate('page.storyboard.title')}
      description={translate('page.storyboard.description')}
      headingLevel={1}
    />
  );
};
