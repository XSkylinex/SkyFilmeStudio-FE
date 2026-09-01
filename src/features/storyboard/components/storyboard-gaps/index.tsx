import type { FC } from 'react';
import { useTranslate } from '@/lib/i18n/use-translate';
import './storyboard-gaps.css';

const GAP_KEYS = [
  'storyboard.gaps.images',
  'storyboard.gaps.generate',
  'storyboard.gaps.operations',
  'storyboard.gaps.keyframeRequirement',
  'storyboard.gaps.progress',
] as const;

export const StoryboardGaps: FC = () => {
  const translate = useTranslate();

  return (
    <section className="storyboard-gaps">
      <h2 className="storyboard-gaps__title">
        {translate('storyboard.gaps.heading')}
      </h2>
      <ul className="storyboard-gaps__list">
        {GAP_KEYS.map((key) => (
          <li key={key} className="storyboard-gaps__item">
            {translate(key)}
          </li>
        ))}
      </ul>
    </section>
  );
};
