import type { FC } from 'react';
import { useTranslate } from '@/lib/i18n/use-translate';
import { SfxLibrary } from '@/features/sfx/components/sfx-library';
import './sfx-page.css';

export const SfxPage: FC = () => {
  const translate = useTranslate();

  return (
    <div className="sfx-page">
      <h1 className="sfx-page__title">{translate('page.sfx.title')}</h1>
      <p className="sfx-page__description">
        {translate('page.sfx.description')}
      </p>
      <SfxLibrary />
    </div>
  );
};
