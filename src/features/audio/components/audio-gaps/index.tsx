import type { FC } from 'react';
import type { TranslationKey } from '@/lib/i18n/catalogue/en';
import { useTranslate } from '@/lib/i18n/use-translate';
import './audio-gaps.css';

const GAP_KEYS = [
  'audio.gaps.playback',
  'audio.gaps.tierNotStored',
  'audio.gaps.music',
  'audio.gaps.sfx',
  'audio.gaps.scoreEdit',
  'audio.gaps.stems',
  'audio.gaps.loudness',
  'audio.gaps.asr',
] satisfies readonly TranslationKey[];

export const AudioGaps: FC = () => {
  const translate = useTranslate();

  return (
    <section className="audio-gaps">
      <h2 className="audio-gaps__title">{translate('audio.gaps.heading')}</h2>
      <ul className="audio-gaps__list">
        {GAP_KEYS.map((key) => (
          <li key={key} className="audio-gaps__item">
            {translate(key)}
          </li>
        ))}
      </ul>
    </section>
  );
};
