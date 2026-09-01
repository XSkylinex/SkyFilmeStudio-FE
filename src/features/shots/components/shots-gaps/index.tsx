import type { FC } from 'react';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import { useTranslate } from '@/lib/i18n/use-translate';
import './shots-gaps.css';

const GAP_KEYS = [
  'shots.gaps.picture',
  'shots.gaps.decision',
  'shots.gaps.operations',
  'shots.gaps.identity',
  'shots.gaps.hero',
  'shots.gaps.attempts',
  'shots.gaps.queue',
] satisfies readonly TranslationKey[];

export const ShotsGaps: FC = () => {
  const translate = useTranslate();

  return (
    <section className="shots-gaps">
      <h2 className="shots-gaps__title">{translate('shots.gaps.heading')}</h2>
      <ul className="shots-gaps__list">
        {GAP_KEYS.map((key) => (
          <li key={key} className="shots-gaps__item">
            {translate(key)}
          </li>
        ))}
      </ul>
    </section>
  );
};
