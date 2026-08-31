import type { FC } from 'react';
import { useTranslate } from '@/lib/i18n/use-translate';
import { BIBLE_GAP_KEYS } from '@/features/bible/bible.constants';
import './bible-gaps.css';

export const BibleGaps: FC = () => {
  const translate = useTranslate();

  return (
    <section className="bible-gaps">
      <h2 className="bible-gaps__title">{translate('bible.gaps.heading')}</h2>
      <ul className="bible-gaps__list">
        {BIBLE_GAP_KEYS.map((key) => (
          <li key={key}>{translate(key)}</li>
        ))}
      </ul>
    </section>
  );
};
